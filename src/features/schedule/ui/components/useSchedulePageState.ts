import { useState, useRef, useEffect } from 'react';
import { useSchedule } from '@/features/schedule/hooks/useSchedule';
import { CourseSession, CourseDay } from '@/features/schedule/domain/Schedule';
import { syncAllCoursesToGoogleCalendar } from '@/features/schedule/utils/googleCalendarSync';

export function useSchedulePageState() {
  const { schedule } = useSchedule();
  
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(() => {
    return typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('google_access_token') : null;
  });
  const [isSyncingWithGoogle, setIsSyncingWithGoogle] = useState(false);
  const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0 });
  
  const [selectedDayMobile, setSelectedDayMobile] = useState<CourseDay>('MER');
  const [activePlanCourse, setActivePlanCourse] = useState<CourseSession | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [filterType, setFilterType] = useState<'TOUS' | 'CM' | 'TD' | 'TP'>('TOUS');
  const [filterStatus, setFilterStatus] = useState<'TOUS' | 'termine' | 'actuel' | 'a_venir'>('TOUS');
  const [searchQuery, setSearchQuery] = useState('');

  const gridContainerRef = useRef<HTMLDivElement>(null);

  const triggerToast = (message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3500);
  };

  const handleFullSync = async () => {
    if (!googleAccessToken) return;
    setIsSyncingWithGoogle(true);
    setSyncProgress({ current: 0, total: schedule.length });
    try {
      const result = await syncAllCoursesToGoogleCalendar(
        googleAccessToken, schedule, (c, t) => setSyncProgress({ current: c, total: t })
      );
      triggerToast(`${result.successCount} cours synchronisés sur Google Calendar avec succès !`);
      setIsSyncModalOpen(false);
    } catch (error) {
      console.error(error);
      triggerToast("Erreur lors de la synchronisation de l'agenda.");
    } finally {
      setIsSyncingWithGoogle(false);
    }
  };

  const handleGoogleDisconnect = () => {
    sessionStorage.removeItem('google_access_token');
    setGoogleAccessToken(null);
    triggerToast("Déconnecté de Google.");
  };

  const scrollGrid = (direction: 'left' | 'right') => {
    if (gridContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      gridContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const fitsFilters = (c: CourseSession) => {
    const matchesType = filterType === 'TOUS' || c.type === filterType;
    const matchesStatus = filterStatus === 'TOUS' || c.status === filterStatus;
    const matchesSearch = searchQuery.trim() === '' || 
      c.nom.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.professeur.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.salle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  };

  const resetAllFilters = () => {
    setFilterType('TOUS'); setFilterStatus('TOUS'); setSearchQuery('');
    triggerToast('Filtres réinitialisés avec succès !');
  };

  useEffect(() => {
    document.body.style.overflow = activePlanCourse ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activePlanCourse]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get('access_token');
      if (token) {
        sessionStorage.setItem('google_access_token', token);
        setTimeout(() => {
          setGoogleAccessToken(token); setIsSyncModalOpen(true); triggerToast('Connexion à Google Calendar réussie !');
        }, 0);
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, []);

  return {
    schedule, isSyncModalOpen, setIsSyncModalOpen, googleAccessToken, setGoogleAccessToken,
    isSyncingWithGoogle, setIsSyncingWithGoogle, syncProgress, setSyncProgress,
    selectedDayMobile, setSelectedDayMobile, activePlanCourse, setActivePlanCourse,
    showToast, setShowToast, viewMode, setViewMode, filterType, setFilterType,
    filterStatus, setFilterStatus, searchQuery, setSearchQuery, gridContainerRef,
    triggerToast, handleFullSync, handleGoogleDisconnect, scrollGrid, fitsFilters, resetAllFilters
  };
}
