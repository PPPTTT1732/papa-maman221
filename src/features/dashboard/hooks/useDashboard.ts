import { useState, useEffect, useRef, useCallback } from 'react';
import { DbProfile, Attendance, LiveSession } from '../domain/Dashboard';
import { CoursItem } from '@/features/student/types'; // Used by the UI
import {
  getDashboardDataUseCase,
  registerClockInUseCase,
  sendLiveReactionUseCase,
  sendLiveChatUseCase
} from '../infrastructure/config/dependencies';

export function useDashboard() {
  const [selectedDay, setSelectedDay] = useState<'LUN' | 'MAR' | 'MER' | 'JEU' | 'VEN'>('MER');
  const [activeDetailCourse, setActiveDetailCourse] = useState<CoursItem | null>(null);
  
  const [dbProfile, setDbProfile] = useState<DbProfile | null>(null);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  
  const [selectedLiveId, setSelectedLiveId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [showPointage, setShowPointage] = useState(false);
  const [pointageType, setPointageType] = useState<'arrivée' | 'départ'>('arrivée');
  const [pointageMethod, setPointageMethod] = useState<'selection' | 'qrcode' | 'camera'>('selection');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [chatInput, setChatInput] = useState("");
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const selectedLive = liveSessions.find(s => s.id === selectedLiveId) || null;

  const triggerToast = useCallback((msg: string) => {
    setShowToast(msg); 
    setTimeout(() => setShowToast(null), 3500);
  }, []);

  const playBeep = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator(); const gn = ctx.createGain();
      osc.connect(gn); gn.connect(ctx.destination);
      osc.frequency.setValueAtTime(880, ctx.currentTime); gn.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start(); osc.stop(ctx.currentTime + 0.15);
    } catch (err) {
      console.warn("Beep audio failing:", err);
    }
  };

  const loadData = useCallback(async () => {
    try {
      const data = await getDashboardDataUseCase();
      setDbProfile(data.profile);
      setAttendances(data.attendances);
      setLiveSessions(data.liveSessions);
    } catch (err) {
      console.warn("Could not load dashboard data:", err);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const fetchAsync = async () => {
      if (!active) return;
      await loadData();
    };
    fetchAsync();
    const interval = setInterval(() => { fetchAsync(); }, 10000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [loadData]);

  const startCamera = async () => {
    setPointageMethod('camera');
    try {
      const str = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setCameraStream(str); 
      if (videoRef.current) videoRef.current.srcObject = str;
    } catch (err) {
      console.warn("Camera input error:", err);
    }
    setTimeout(() => registerClockIn('Camera Scan'), 3200);
  };

  const stopCamera = () => {
    if (cameraStream) { 
      cameraStream.getTracks().forEach(t => t.stop()); 
      setCameraStream(null); 
    }
  };

  const registerClockIn = async (method: string) => {
    playBeep(); 
    stopCamera();
    try {
      await registerClockInUseCase(pointageType, method);
      setPointageMethod('selection'); 
      setShowPointage(false);
      triggerToast(`Pointage ${pointageType} validé`); 
      loadData();
    } catch (err) {
      console.error("Erreur pointage:", err);
      triggerToast("Erreur lors du pointage");
    }
  };

  const sendLiveReaction = async (type: string) => {
    if (!selectedLive) return;
    try {
      const newReactions = await sendLiveReactionUseCase(selectedLive.id, type);
      setLiveSessions(prev => prev.map(s => s.id === selectedLive.id ? { ...s, reactions: newReactions } : s));
    } catch (err) {
      console.error("Erreur reaction:", err);
    }
  };

  const sendLiveChat = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!chatInput.trim() || !selectedLive) return;
    const user = dbProfile?.name || "Étudiant"; 
    const text = chatInput; 
    setChatInput("");
    try {
      const updatedSession = await sendLiveChatUseCase(selectedLive.id, user, text);
      setLiveSessions(prev => prev.map(s => s.id === selectedLive.id ? updatedSession : s));
    } catch (err) {
      console.error("Erreur chat:", err);
    }
  };

  return {
    selectedDay, setSelectedDay, activeDetailCourse, setActiveDetailCourse, dbProfile, attendances,
    liveSessions, selectedLiveId, setSelectedLiveId, selectedLive, showToast, triggerToast, showPointage, setShowPointage,
    pointageType, setPointageType, pointageMethod, setPointageMethod, cameraStream, chatInput, setChatInput,
    videoRef, startCamera, stopCamera, registerClockIn, sendLiveReaction, sendLiveChat
  };
}
