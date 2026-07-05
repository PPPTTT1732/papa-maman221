import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/shared/constants';
import { useAuthStore } from '@/core/store/authStore';

interface Props {
  showProfile: boolean; setShowProfile: (v: boolean) => void;
  setShowNotifications: (v: boolean) => void;
  setShowCalendar: (v: boolean) => void;
  studentMood: string; tempMood: string; setTempMood: (v: string) => void;
  isEditingMood: boolean; setIsEditingMood: (v: boolean) => void;
  onOpenSettings: () => void;
  onOpenSupport: () => void;
  triggerToast: (msg: string) => void;
  onMoodSave: () => void;
  profileRef: React.RefObject<HTMLDivElement | null>;
}

function getInitials(fullName?: string) {
  if (!fullName) return 'A D';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return parts.slice(0, 2).map((part) => part[0].toUpperCase()).join(' ');
}

export function ProfileDropdown({
  showProfile, setShowProfile, setShowNotifications, setShowCalendar,
  studentMood, tempMood, setTempMood, isEditingMood, setIsEditingMood,
  onOpenSettings, onOpenSupport, triggerToast, onMoodSave, profileRef
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { utilisateur, deconnexion } = useAuthStore();
  const initials = getInitials(utilisateur?.nom);
  const displayName = utilisateur?.nom ?? 'Étudiant(e) École 221';

  const getLevel = () => {
    const path = location.pathname;
    if (path.includes('planning')) return 'L3 GL';
    if (path.includes('notes')) return 'L3 GL';
    if (path.includes('cours')) return 'M1 GL';
    if (path.includes('devoirs')) return 'M1 GL';
    return 'M1 GL';
  };

  const getFullLevel = () => {
    const path = location.pathname;
    if (path.includes('planning')) return 'Licence 3 GL';
    if (path.includes('notes')) return 'Licence 3 GL';
    if (path.includes('cours')) return 'Master 1 GL';
    if (path.includes('devoirs')) return 'Master 1 GL';
    return 'Master 1 GL';
  };

  return (
    <div className="relative" ref={profileRef}>
      <button type="button" onClick={() => { setShowProfile(!showProfile); setShowCalendar(false); setShowNotifications(false); }} aria-label="Ouvrir le profil étudiant" className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-gray-50 hover:bg-brand-red-light text-secondary hover:text-brand-red-deep transition-all cursor-pointer shadow-sm ring-1 ring-neutral-gray-200/80 group">
        <div className="h-8.5 w-8.5 rounded-xl bg-brand-red-deep text-white font-heavy flex items-center justify-center overflow-hidden shadow-sm ring-2 ring-brand-red-light">
          <div className="w-full h-full bg-brand-red-deep text-white flex items-center justify-center font-black text-xs select-none">{initials}</div>
        </div>
      </button>
      {showProfile && (
        <div className="fixed top-16 left-4 right-4 sm:absolute sm:top-full sm:left-auto sm:right-0 mt-2 w-[min(92vw,24rem)] sm:w-84 bg-white border border-neutral-gray-200 rounded-3xl shadow-2xl z-[200] overflow-hidden animate-slide-up max-h-[min(86vh,38rem)]">
          <div className="p-5 text-center bg-gradient-to-br from-brand-red-deep to-[#1E40AF] text-white">
            <div className="w-14 h-14 rounded-2xl overflow-hidden mx-auto shadow-md border-2 border-white/20 mb-3">
              <div className="w-full h-full bg-white/20 text-white flex items-center justify-center font-black text-base select-none">{initials}</div>
            </div>
            <h4 className="font-headline-md text-sm font-black tracking-tight">{displayName}</h4>
            <p className="text-[10px] text-white/80 font-semibold mt-0.5">Matricule : #221-M382 • {getFullLevel()}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 bg-white/20 rounded-full text-[8.5px] font-black uppercase tracking-wider text-white">Promotion 221-GL</span>
          </div>
          <div className="p-4 space-y-4">
            <div className="space-y-1.5">
              <span className="text-[9px] font-label-md uppercase tracking-[0.2em] text-neutral-gray-400">Statut / Humeur</span>
              {isEditingMood ? (
                <div className="flex gap-1.5 items-center">
                  <input type="text" value={tempMood} onChange={(e) => setTempMood(e.target.value)} className="flex-grow text-xs font-semibold border border-neutral-gray-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-brand-red-deep bg-neutral-gray-50" placeholder="Que faites-vous ?" />
                  <button onClick={onMoodSave} className="bg-brand-red-deep text-white px-2.5 py-2 rounded-lg text-xs font-black">OK</button>
                </div>
              ) : (
                <div onClick={() => setIsEditingMood(true)} className="bg-neutral-gray-50 hover:bg-brand-red-light/30 border border-neutral-gray-150 p-2.5 rounded-xl cursor-pointer text-sm text-secondary font-body-md leading-relaxed flex items-center justify-between gap-2">
                  <span className="pr-2">{studentMood}</span>
                  <span className="material-symbols-outlined text-xs text-neutral-gray-400 shrink-0">edit</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button onClick={() => { setShowProfile(false); onOpenSettings(); }} className="p-2.5 border border-neutral-gray-200 rounded-xl font-black text-xs text-[#1E293B] hover:bg-neutral-gray-50 flex flex-col items-center gap-1 cursor-pointer">
                <span className="material-symbols-outlined text-brand-red-deep text-[18px]">settings</span>
                <span className="font-label-md text-label-md">Paramètres</span>
              </button>
              <button onClick={() => { setShowProfile(false); onOpenSupport(); }} className="p-2.5 border border-neutral-gray-200 rounded-xl font-black text-xs text-[#1E293B] hover:bg-neutral-gray-50 flex flex-col items-center gap-1 cursor-pointer">
                <span className="material-symbols-outlined text-brand-red-deep text-[18px]">support_agent</span>
                <span className="font-label-md text-label-md">Soutien</span>
              </button>
            </div>
            <div className="pt-2 border-t border-neutral-gray-100 space-y-1.5 text-[11px] text-secondary font-medium">
              <div className="flex justify-between gap-3"><span className="text-neutral-gray-500 font-label-md text-label-md">Faculté :</span><span className="font-body-md text-body-md text-[#1E293B] text-right">Sciences & Technologies</span></div>
              <div className="flex justify-between gap-3"><span className="text-neutral-gray-500 font-label-md text-label-md">Moyenne générale :</span><span className="font-label-md text-label-md text-brand-red-deep">16.69 / 20</span></div>
              <div className="flex justify-between gap-3"><span className="text-neutral-gray-500 font-label-md text-label-md">Inscriptions :</span><span className="text-success-green font-label-md text-label-md">🟢 Validé S1 & S2</span></div>
            </div>
            <button onClick={() => { setShowProfile(false); deconnexion(); localStorage.removeItem('access_token'); triggerToast('Déconnexion réussie'); setTimeout(() => navigate(ROUTES.login), 800); }} className="w-full py-2.5 bg-neutral-gray-100 hover:bg-brand-red-light hover:text-brand-red-deep font-label-md text-label-md text-secondary rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer">
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
