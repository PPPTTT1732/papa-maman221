import React, { useState } from 'react';
import { CalendarWidget } from '@/features/auth/ui/components/CalendarWidget';

interface Props {
  readonly title: string;
  readonly profName: string;
  readonly activeTab: string;
  readonly onSelectTab: (tab: string) => void;
  readonly onOpenSettings?: () => void;
}

export function ProfessorHeader({ title, profName, activeTab, onSelectTab }: Props) {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <header className="w-full top-0 sticky z-[100] bg-white/90 backdrop-blur-md border-b border-neutral-gray-200/80 shadow-sm animate-fade-in select-none">
      <div className="flex items-center justify-between px-6 md:px-8 w-full h-16 gap-4 relative">
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-headline-md text-headline-md font-black text-brand-red-deep md:hidden tracking-tight">École 221</span>
          <div className="hidden md:flex items-center text-neutral-gray-400">
            <span translate="no" className="material-symbols-outlined text-brand-red-deep text-[22px] mr-2">school</span>
            <span className="text-xs font-black uppercase text-secondary tracking-widest">Espace Enseignant</span>
          </div>
        </div>

        <div className="flex-grow" />

        <div className="flex items-center gap-4 shrink-0">
          {/* Welcome Greeting */}
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-black text-[#1E293B]">Bienvenue, {profName}</span>
            <span className="text-[10px] text-secondary font-bold">Portail connecté</span>
          </div>

          {/* Calendar Toggle */}
          <div className="relative">
            <button 
              onClick={() => setShowCalendar(!showCalendar)} 
              className={`relative w-9 h-9 flex items-center justify-center rounded-xl bg-neutral-gray-50 hover:bg-brand-red-light text-secondary hover:text-brand-red-deep transition-all cursor-pointer group ${showCalendar ? 'bg-brand-red-light text-brand-red-deep border border-brand-red-deep/10' : ''}`}
              title="Calendrier Académique"
            >
              <span translate="no" className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110">calendar_month</span>
            </button>
            {showCalendar && (
              <>
                <div onClick={() => setShowCalendar(false)} className="fixed inset-0 z-[180] cursor-default" />
                <div className="fixed top-16 left-4 right-4 sm:absolute sm:top-full sm:left-auto sm:right-0 sm:mt-3 w-[calc(100vw-32px)] sm:w-[650px] md:w-[750px] bg-white border border-neutral-gray-250 rounded-3xl shadow-2xl p-5 space-y-4 max-h-[min(85vh,44rem)] overflow-hidden z-[200] animate-slide-up">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                    <div className="flex items-center gap-2">
                      <span translate="no" className="material-symbols-outlined text-brand-red-deep font-bold text-xl">calendar_today</span>
                      <div>
                        <h4 className="font-title-lg text-xs font-black uppercase text-[#1E293B] tracking-wide">Calendrier Académique</h4>
                        <p className="text-[10px] text-secondary font-bold leading-none">Emploi du temps & Sessions</p>
                      </div>
                    </div>
                    <button onClick={() => setShowCalendar(false)} className="p-1 px-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-black text-[9px] uppercase tracking-wider transition-colors cursor-pointer">Fermer</button>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-neutral-100">
                    <CalendarWidget />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

    </header>
  );
}
