import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { LiveSession } from '@/features/student/types';

interface RealTimeMeetRoomProps {
  selectedLive: LiveSession;
  onLeave: () => void;
  triggerToast: (msg: string) => void;
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isTeacher: boolean;
  isMuted: boolean;
  isSpeaking: boolean;
  handRaised: boolean;
  cameraOn: boolean;
}

export function RealTimeMeetRoom({ selectedLive, onLeave, triggerToast }: RealTimeMeetRoomProps) {
  // Meet Stages: 'greenroom' (salle d'attente) or 'active' (en réunion)
  const [stage, setStage] = useState<'greenroom' | 'active'>('greenroom');

  // Media States
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isCameraSimulated, setIsCameraSimulated] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [hasVisualEffects, setHasVisualEffects] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'spotlight'>('grid');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Media element references
  const roomRef = useRef<HTMLDivElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);

  const toggleFullscreen = async () => {
    if (!roomRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await roomRef.current.requestFullscreen();
        setIsFullscreen(true);
        triggerToast('Mode plein écran activé (Cadre rouge)');
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
        triggerToast('Plein écran désactivé');
      }
    } catch (err) {
      console.warn("HTML5 Fullscreen not supported or blocked, using CSS fallback:", err);
      const nextState = !isFullscreen;
      setIsFullscreen(nextState);
      triggerToast(nextState ? 'Mode plein écran activé (Cadre rouge)' : 'Plein écran désactivé');
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === roomRef.current);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Hardcoded simulated online class participants
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: 'prof',
      name: selectedLive.teacherName || 'Dr. Cheikh Bamba',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop',
      isTeacher: true,
      isMuted: false,
      isSpeaking: true,
      handRaised: false,
      cameraOn: true,
    },
    {
      id: 'std-1',
      name: 'Aminata Diop',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
      isTeacher: false,
      isMuted: true,
      isSpeaking: false,
      handRaised: false,
      cameraOn: true,
    },
    {
      id: 'std-2',
      name: 'Babacar Ndiaye',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
      isTeacher: false,
      isMuted: false,
      isSpeaking: false,
      handRaised: true,
      cameraOn: false,
    },
  ]);

  // Request user camera and microphone
  const initLocalMedia = async (forceCamState?: boolean, forceMicState?: boolean) => {
    try {
      const cam = forceCamState !== undefined ? forceCamState : isCamOn;
      const mic = forceMicState !== undefined ? forceMicState : isMicOn;

      // Stop previous stream if any
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }

      if (!cam && !mic) {
        setLocalStream(null);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: cam ? { width: 640, height: 480, facingMode: 'user' } : false,
        audio: mic,
      });

      setLocalStream(stream);
      setIsCameraSimulated(false);

      // Attach stream to video preview
      if (localVideoRef.current && stream) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Accès caméra/micro réel indisponible, utilisation du flux simulé:', err);
      setIsCameraSimulated(true);
      setIsCamOn(true);
      setLocalStream(null);
      triggerToast('Accès caméra réel refusé. Caméra virtuelle activée.');
    }
  };

  // Handle camera toggling
  const toggleCamera = async () => {
    const nextState = !isCamOn;
    setIsCamOn(nextState);
    if (nextState) {
      setIsCameraSimulated(false);
      await initLocalMedia(true, isMicOn);
    } else {
      // If turning off, we stop video tracks
      setIsCameraSimulated(false);
      if (localStream) {
        localStream.getVideoTracks().forEach(track => {
          track.stop();
          localStream.removeTrack(track);
        });
        // Retain audio track
        if (localStream.getAudioTracks().length === 0) {
          setLocalStream(null);
        }
      }
    }
    triggerToast(nextState ? 'Caméra activée' : 'Caméra désactivée');
  };

  // Handle microphone toggling
  const toggleMicrophone = () => {
    const nextState = !isMicOn;
    setIsMicOn(nextState);
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = nextState;
      });
    }
    triggerToast(nextState ? 'Microphone réactivé' : 'Microphone coupé');
  };

  // Real Screen Sharing using navigator.mediaDevices.getDisplayMedia
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
      setScreenStream(null);
      setIsScreenSharing(false);
      triggerToast('Partage d\'écran arrêté');
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });
        setScreenStream(stream);
        setIsScreenSharing(true);
        triggerToast('Partage d\'écran démarré');

        // Handle stream ending when user clicks "Stop Sharing" on browser banner
        stream.getVideoTracks()[0].onended = () => {
          setScreenStream(null);
          setIsScreenSharing(false);
          triggerToast('Partage d\'écran arrêté');
        };
      } catch (err) {
        console.warn('Partage d\'écran annulé ou refusé:', err);
      }
    }
  };

  // Run initial preview on greenroom stage load
  useEffect(() => {
    let active = true;
    if (stage === 'greenroom') {
      Promise.resolve().then(() => {
        if (active) {
          initLocalMedia(isCamOn, isMicOn);
        }
      });
    }
    return () => {
      active = false;
      // Cleanup streams on unmount
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, isCamOn, isMicOn, localStream, screenStream]);

  // Hook local video element to local stream whenever stream or stage changes
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, stage]);

  // Hook screen share video element
  useEffect(() => {
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
    }
  }, [screenStream, isScreenSharing]);

  // Handle entering active room
  const handleJoinMeet = () => {
    setStage('active');
    triggerToast('Vous avez rejoint la visioconférence !');
  };

  // Handle simulated participant actions (talking, hand raise etc)
  useEffect(() => {
    if (stage !== 'active') return;

    const interval = setInterval(() => {
      setParticipants(prev => prev.map(p => {
        // Teacher speaks frequently
        if (p.isTeacher) {
          return { ...p, isSpeaking: Math.random() > 0.35 };
        }
        // Babacar speaks randomly
        if (p.id === 'std-2') {
          return { ...p, isSpeaking: Math.random() > 0.7 && !p.isMuted };
        }
        return p;
      }));
    }, 3200);

    return () => clearInterval(interval);
  }, [stage]);

  return (
    <div 
      ref={roomRef}
      className={
        isFullscreen
          ? "fixed inset-0 z-[9999] bg-[#111] flex flex-col justify-between overflow-hidden relative border-[6px] border-[#B3181C] select-none animate-fade-in text-white shadow-2xl"
          : "w-full h-full min-h-[440px] bg-[#111] rounded-2xl flex flex-col justify-between overflow-hidden relative border border-white/10 select-none animate-fade-in text-white shadow-2xl"
      }
    >
      
      {/* 1. GREENROOM SCREEN (Salle d'attente pré-connexion) */}
      {stage === 'greenroom' && (
        <div className="flex-grow flex flex-col lg:flex-row items-center justify-center p-6 lg:p-10 gap-8 h-full bg-gradient-to-b from-[#1b1b1b] to-[#0f0f0f]">
          
          {/* Pre-join camera box preview */}
          <div className="w-full lg:w-1/2 max-w-sm aspect-video bg-neutral-900 rounded-2xl overflow-hidden border border-white/10 relative flex flex-col justify-between shadow-lg">
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase text-[#E3A857]">
              Aperçu Caméra
            </div>

            {/* Video or Avatar */}
            <div className="flex-grow flex items-center justify-center relative w-full h-full">
              {isCamOn && localStream ? (
                <video 
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : isCamOn && isCameraSimulated ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-850 to-neutral-950 p-4">
                  {/* Slow zooming simulated student avatar */}
                  <img 
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop" 
                    alt="Simulation Webcam" 
                    className={`w-14 h-14 rounded-full border-2 border-[#E3A857] object-cover animate-[pulse_2.5s_infinite] ${hasVisualEffects ? 'filter grayscale contrast-120 saturate-50 brightness-110' : ''}`}
                    referrerPolicy="no-referrer"
                  />
                  <div className="mt-2 text-center">
                    <p className="text-[9px] font-black text-[#E3A857] uppercase tracking-wider flex items-center gap-1 justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E3A857] animate-ping"></span>
                      Caméra Virtuelle
                    </p>
                    <p className="text-[8px] text-neutral-400 font-semibold leading-none mt-1">Filtre : {hasVisualEffects ? 'Sépia Noir & Blanc' : 'Normal'}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-brand-red-deep/25 border-2 border-brand-red-deep flex items-center justify-center text-xl font-black text-[#E3A857]">
                    AD
                  </div>
                  <p className="text-[10px] text-neutral-450 font-bold">Caméra désactivée</p>
                </div>
              )}
            </div>

            {/* Control buttons below video preview */}
            <div className="p-3 bg-black/40 border-t border-white/5 flex justify-center gap-3">
              <button
                onClick={toggleMicrophone}
                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                  isMicOn 
                    ? 'bg-neutral-800 hover:bg-neutral-750 text-white' 
                    : 'bg-red-600 hover:bg-red-750 text-white animate-pulse'
                }`}
                title={isMicOn ? 'Couper le micro' : 'Activer le micro'}
              >
                <Icon icon={isMicOn ? 'lucide:mic' : 'lucide:mic-off'} className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={toggleCamera}
                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                  isCamOn 
                    ? 'bg-neutral-800 hover:bg-neutral-750 text-white' 
                    : 'bg-red-600 hover:bg-red-750 text-white animate-pulse'
                }`}
                title={isCamOn ? 'Couper la caméra' : 'Activer la caméra'}
              >
                <Icon icon={isCamOn ? 'lucide:video' : 'lucide:video-off'} className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Connection prompt detail block */}
          <div className="w-full lg:w-1/2 max-w-sm text-center lg:text-left space-y-4">
            <div className="space-y-1.5">
              <span className="bg-[#B3181C]/25 text-[#FF8587] border border-[#B3181C]/45 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Visioconférence Privée
              </span>
              <h4 className="text-xl font-black tracking-tight mt-1 leading-snug">Prêt à rejoindre la séance ?</h4>
              <p className="text-xs text-neutral-400 font-semibold leading-relaxed">
                Connectez-vous directement sur l'application avec vos collègues et le <span className="text-white font-extrabold">{selectedLive.teacherName}</span>.
              </p>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2 text-left">
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <Icon icon="lucide:check-circle" className="h-4 w-4 text-emerald-500" />
                <span>Audio : {isMicOn ? 'Microphone connecté et actif' : 'Muet'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <Icon icon="lucide:check-circle" className="h-4 w-4 text-emerald-500" />
                <span>Vidéo : {isCamOn ? 'Webcam active' : 'Aucun flux vidéo'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <Icon icon="lucide:users" className="h-4 w-4 text-emerald-400" />
                <span>{participants.length} autres participants connectés</span>
              </div>
            </div>

            <div className="flex flex-row items-center gap-2 pt-2 w-full">
              <button
                onClick={handleJoinMeet}
                className="flex-grow py-3 px-3 bg-brand-red-deep hover:bg-brand-red-deep/95 hover:scale-101 active:scale-[0.99] text-white font-black text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-brand-red-deep/20 whitespace-nowrap"
              >
                <Icon icon="lucide:video" className="h-4 w-4" />
                <span>Rejoindre</span>
              </button>
              <button
                onClick={onLeave}
                className="py-3 px-4 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 font-bold text-xs rounded-2xl transition-all cursor-pointer whitespace-nowrap"
              >
                Retour slides
              </button>
              <button
                onClick={toggleFullscreen}
                className={`p-3 w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer transition-all flex-shrink-0 ${
                  isFullscreen 
                    ? 'bg-red-650 text-white hover:bg-red-700 shadow-md shadow-red-650/30' 
                    : 'bg-neutral-800 hover:bg-neutral-750 text-neutral-300'
                }`}
                title={isFullscreen ? "Quitter le plein écran (Cadre rouge)" : "Plein écran (Cadre rouge)"}
              >
                <Icon icon={isFullscreen ? 'lucide:minimize-2' : 'lucide:maximize-2'} className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACTIVE VIDEO CALL SCREEN */}
      {stage === 'active' && (
        <div className="flex-grow flex flex-col h-full bg-[#161616] relative">
          
          {/* Top informational header banner */}
          <div className="p-4 bg-gradient-to-b from-black/85 to-transparent absolute top-0 inset-x-0 z-30 flex justify-between items-center pointer-events-none">
            <div className="pointer-events-auto bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
              <span className="font-mono text-[9px] font-black tracking-widest text-red-500 uppercase">LIVE VISIO</span>
              <span className="h-3 w-px bg-white/25"></span>
              <span className="text-[10px] font-bold text-neutral-200 truncate max-w-[120px] sm:max-w-xs">{selectedLive.title}</span>
            </div>

            <div className="pointer-events-auto flex gap-2">
              {isFullscreen && (
                <div className="bg-red-650/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-red-500/30 flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                  <span className="font-mono text-[9px] font-black text-white uppercase tracking-wider">Plein Écran Encadré</span>
                </div>
              )}
              <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
                <Icon icon="lucide:users" className="h-3.5 w-3.5 text-emerald-450" />
                <span className="font-mono text-[9px] font-black text-emerald-400">{participants.length + 1} DIRECT</span>
              </div>
            </div>
          </div>

          {/* Active Speakers & Presentation Stage Grid layout */}
          <div className="flex-grow p-4 pt-16 pb-20 flex items-center justify-center h-full">
            
            {/* Grid display Container */}
            <div className={`w-full h-full max-w-5xl mx-auto grid gap-4 ${
              isScreenSharing 
                ? 'grid-rows-12 md:grid-cols-12' 
                : participants.length === 0 ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4'
            }`}>
              
              {/* Screen Sharing Component Column (Main spotlight if screen sharing) */}
              {isScreenSharing && (
                <div className="row-span-7 md:col-span-8 bg-black border border-[#B3181C]/35 rounded-2xl overflow-hidden relative flex flex-col shadow-inner group">
                  <div className="absolute top-3 left-3 bg-red-600/90 text-white text-[9px] font-black px-2.5 py-1 rounded-lg z-10 flex items-center gap-1">
                    <Icon icon="lucide:screen-share" className="h-3.5 w-3.5" />
                    <span>VOTRE PARTAGE D'ÉCRAN ACTIF</span>
                  </div>

                  <video 
                    ref={screenVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-contain"
                  />

                  <div className="absolute bottom-3 right-3 bg-black/60 px-3 py-1 rounded-lg text-[9px] font-heavy text-neutral-300">
                    Cliquez sur "Arrêter" pour quitter le partage
                  </div>
                </div>
              )}

              {/* Participants Grid items (occupies the rest) */}
              <div className={`${
                isScreenSharing 
                  ? 'row-span-5 md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-3 overflow-y-auto no-scrollbar max-h-[220px] md:max-h-full' 
                  : 'col-span-4 grid grid-cols-2 lg:grid-cols-2 gap-4 h-full max-h-[460px]'
              }`}>
                
                {/* 1. LOCAL USER WEB CAMERA BLOCK */}
                <div className={`bg-neutral-900 border rounded-2xl overflow-hidden relative flex flex-col justify-between shadow-lg transition-all ${
                  isHandRaised ? 'border-amber-500/50 shadow-md shadow-amber-500/5' : 'border-white/10'
                }`}>
                  <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-lg text-[9px] font-black tracking-wide flex items-center gap-1 z-15">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Vous (Abdoulaye Diallo)</span>
                  </div>

                  {/* Hand raise floating indicator */}
                  {isHandRaised && (
                    <div className="absolute top-2.5 right-2.5 bg-amber-500 text-black p-1 rounded-lg z-15 shadow animate-[bounce_2s_infinite]">
                      <Icon icon="lucide:hand" className="h-3.5 w-3.5" />
                    </div>
                  )}

                  <div className="flex-grow flex items-center justify-center relative bg-gradient-to-b from-[#212121] to-[#151515] h-full min-h-[100px] w-full">
                    {isCamOn && localStream ? (
                      <video 
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover transform -scale-x-100 ${hasVisualEffects ? 'filter saturate-120 contrast-105' : ''}`}
                      />
                    ) : isCamOn && isCameraSimulated ? (
                      <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-850 to-neutral-950 p-2">
                        {/* Slow zooming simulated student avatar */}
                        <img 
                          src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop" 
                          alt="Simulation Webcam" 
                          className={`w-12 h-12 rounded-full border border-[#E3A857] object-cover animate-[pulse_3s_infinite] ${hasVisualEffects ? 'filter grayscale contrast-120 saturate-50 brightness-110' : ''}`}
                          referrerPolicy="no-referrer"
                        />
                        <div className="mt-1.5 text-center">
                          <p className="text-[8px] font-black text-[#E3A857] uppercase tracking-wider flex items-center gap-1 justify-center">
                            <span className="w-1 h-1 rounded-full bg-[#E3A857] animate-ping"></span>
                            Caméra Virtuelle
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-brand-red-deep text-white font-black flex items-center justify-center text-lg shadow">
                        AD
                      </div>
                    )}
                  </div>

                  {/* Mic mute indicator */}
                  <div className="absolute bottom-2.5 right-2.5 z-15">
                    <span className={`p-1.5 rounded-full flex items-center justify-center ${
                      isMicOn ? 'bg-black/60 text-emerald-400' : 'bg-red-600/90 text-white animate-pulse'
                    }`}>
                      <Icon icon={isMicOn ? 'lucide:mic' : 'lucide:mic-off'} className="h-3 w-3" />
                    </span>
                  </div>
                </div>

                {/* 2. LIVE SIMULATED PARTICIPANTS */}
                {participants.map((p) => (
                  <div 
                    key={p.id}
                    className={`bg-neutral-900 border rounded-2xl overflow-hidden relative flex flex-col justify-between shadow-lg transition-all ${
                      p.isSpeaking 
                        ? 'border-brand-red-deep ring-2 ring-brand-red-deep/40 shadow-md shadow-brand-red-deep/10' 
                        : p.handRaised 
                          ? 'border-amber-500/50 shadow-md shadow-amber-500/5' 
                          : 'border-white/10'
                    }`}
                  >
                    {/* Participant Title Tag */}
                    <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-lg text-[9px] font-black tracking-wide flex items-center gap-1.5 z-15">
                      {p.isTeacher && (
                        <span className="bg-brand-red-deep text-white text-[7px] font-black px-1.5 py-0.2 rounded uppercase">
                          PROF
                        </span>
                      )}
                      <span>{p.name}</span>
                    </div>

                    {/* Raised hand indicator */}
                    {p.handRaised && (
                      <div className="absolute top-2.5 right-2.5 bg-amber-500 text-black p-1 rounded-lg z-15 shadow animate-pulse">
                        <Icon icon="lucide:hand" className="h-3.5 w-3.5" />
                      </div>
                    )}

                    {/* Webcam Body or Initials */}
                    <div className="flex-grow flex items-center justify-center bg-gradient-to-b from-neutral-800 to-neutral-900 h-full min-h-[100px] relative">
                      {p.cameraOn ? (
                        <div className="w-full h-full relative">
                          <img 
                            src={p.avatar} 
                            alt={p.name} 
                            className={`w-full h-full object-cover opacity-85 transition-transform ${p.isSpeaking ? 'scale-102' : 'scale-100'}`}
                          />
                          {p.isSpeaking && (
                            <div className="absolute inset-0 bg-brand-red-deep/5 pointer-events-none"></div>
                          )}
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-neutral-800 border border-white/10 text-white font-black flex items-center justify-center text-lg uppercase shadow">
                          {p.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}

                      {/* Speaking Wave Animation overlay */}
                      {p.isSpeaking && (
                        <div className="absolute bottom-2.5 left-2.5 flex items-end gap-0.5 bg-black/60 px-1.5 py-1 rounded-md">
                          <div className="w-0.5 h-3 bg-brand-red-deep rounded-full animate-[bounce_0.6s_infinite_0.1s]"></div>
                          <div className="w-0.5 h-4.5 bg-brand-red-deep rounded-full animate-[bounce_0.6s_infinite_0.3s]"></div>
                          <div className="w-0.5 h-2 bg-brand-red-deep rounded-full animate-[bounce_0.6s_infinite_0.2s]"></div>
                        </div>
                      )}
                    </div>

                    {/* Participant Microphone status badge */}
                    <div className="absolute bottom-2.5 right-2.5 z-15">
                      <span className={`p-1.5 rounded-full flex items-center justify-center ${
                        !p.isMuted ? 'bg-black/60 text-emerald-400' : 'bg-red-600/90 text-white'
                      }`}>
                        <Icon icon={!p.isMuted ? 'lucide:mic' : 'lucide:mic-off'} className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                ))}

              </div>
            </div>

          </div>

          {/* Bottom Interactive Call Utility Control Rail */}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-neutral-900/95 border-t border-white/5 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-30">
            
            {/* Visual Indicators left */}
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Qualité flux :</span>
              <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md text-emerald-400">
                <Icon icon="lucide:signal" className="h-3 w-3" />
                <span className="text-[9px] font-black">EXCELLENT</span>
              </div>
            </div>

            {/* Core Action Command Panel */}
            <div className="flex items-center gap-3 mx-auto sm:mx-0">
              
              {/* Audio Toggle button */}
              <button
                onClick={toggleMicrophone}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  isMicOn 
                    ? 'bg-neutral-800 hover:bg-neutral-750 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                }`}
                title={isMicOn ? 'Couper le micro' : 'Réactiver le micro'}
              >
                <Icon icon={isMicOn ? 'lucide:mic' : 'lucide:mic-off'} className="h-4.5 w-4.5" />
              </button>

              {/* Camera Toggle button */}
              <button
                onClick={toggleCamera}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  isCamOn 
                    ? 'bg-neutral-800 hover:bg-neutral-750 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
                title={isCamOn ? 'Désactiver la caméra' : 'Activer la caméra'}
              >
                <Icon icon={isCamOn ? 'lucide:video' : 'lucide:video-off'} className="h-4.5 w-4.5" />
              </button>

              {/* Screen Sharing Toggle Button */}
              <button
                onClick={toggleScreenShare}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  isScreenSharing 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                    : 'bg-neutral-800 hover:bg-neutral-750 text-neutral-300'
                }`}
                title={isScreenSharing ? 'Arrêter le partage d\'écran' : 'Partager mon écran'}
              >
                <Icon icon="lucide:screen-share" className="h-4.5 w-4.5" />
              </button>

              {/* Raise Hand Toggle Button */}
              <button
                onClick={() => {
                  const nextState = !isHandRaised;
                  setIsHandRaised(nextState);
                  triggerToast(nextState ? 'Vous avez levé la main' : 'Main baissée');
                }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  isHandRaised 
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/10' 
                    : 'bg-neutral-800 hover:bg-neutral-750 text-neutral-300'
                }`}
                title={isHandRaised ? 'Baisser la main' : 'Lever la main'}
              >
                <Icon icon="lucide:hand" className="h-4.5 w-4.5" />
              </button>

              {/* Virtual Background / Visual filter Toggle Button */}
              <button
                onClick={() => {
                  const nextState = !hasVisualEffects;
                  setHasVisualEffects(nextState);
                  triggerToast(nextState ? 'Filtre d\'image actif' : 'Filtre d\'image désactivé');
                }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  hasVisualEffects 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-neutral-800 hover:bg-neutral-750 text-neutral-300'
                }`}
                title="Activer les effets visuels"
              >
                <Icon icon="lucide:sparkles" className="h-4.5 w-4.5" />
              </button>

              {/* Disconnect Red Button */}
              <button
                onClick={() => {
                  setStage('greenroom');
                  triggerToast('Vous avez quitté la réunion.');
                }}
                className="px-5 h-10 bg-red-600 hover:bg-red-750 text-white rounded-xl font-black text-xs transition-all hover:scale-102 active:scale-98 flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-600/10"
              >
                <Icon icon="lucide:phone-off" className="h-4 w-4" />
                <span className="hidden sm:inline">Quitter</span>
              </button>

            </div>

            {/* Layout and Fullscreen controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const nextMode = layoutMode === 'grid' ? 'spotlight' : 'grid';
                  setLayoutMode(nextMode);
                  triggerToast(`Disposition : ${nextMode === 'grid' ? 'Mosaïque' : 'Focus'}`);
                }}
                className="w-9 h-9 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-neutral-300 flex items-center justify-center transition-colors cursor-pointer"
                title="Changer de disposition"
              >
                <Icon icon={layoutMode === 'grid' ? 'lucide:layout-grid' : 'lucide:square'} className="h-4 w-4" />
              </button>

              <button
                onClick={toggleFullscreen}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  isFullscreen 
                    ? 'bg-red-650 text-white hover:bg-red-700 shadow-md shadow-red-600/20' 
                    : 'bg-neutral-800 hover:bg-neutral-750 text-neutral-300'
                }`}
                title={isFullscreen ? 'Quitter le plein écran (Cadre rouge)' : 'Activer le plein écran (Cadre rouge)'}
              >
                <Icon icon={isFullscreen ? 'lucide:minimize-2' : 'lucide:maximize-2'} className="h-4 w-4" />
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default RealTimeMeetRoom;
