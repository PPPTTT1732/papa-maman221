import React from 'react';
import { LiveSession } from '@/features/student/types';

interface LiveStreamBannerProps {
  liveSessions: LiveSession[];
  onJoin: (id: string) => void;
}

export function LiveStreamBanner({ liveSessions, onJoin }: LiveStreamBannerProps) {
  return (
    <div className="bg-gradient-to-r from-neutral-900 to-brand-red-deep p-6 rounded-3xl text-white mb-8 border border-white/5 shadow-md flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden max-w-[800px] w-full">
      <div className="absolute right-0 top-0 bottom-0 opacity-15 overflow-hidden w-96 flex flex-wrap gap-2 pointer-events-none self-end transform translate-x-12 select-none font-mono text-[9px]">
        {`010101 MLFOUNDATIONS 221 ECOLE GLOBAL NEURAL NETS DEEP LEARNING`.repeat(6)}
      </div>

      <div className="relative z-10 flex items-center gap-4 text-left">
        <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center font-black animate-pulse shadow">
          <span className="material-symbols-outlined text-2xl animate-spin text-[#E3A857]">live_tv</span>
        </div>
        <div>
          <div className="flex gap-2 items-center">
            <span className="bg-success-green/30 text-white text-[8.5px] px-2 py-0.5 rounded-full font-black animate-pulse">EN DIRECT</span>
          </div>
          <h4 className="font-headline-sm text-sm font-black text-white leading-tight mt-1">Machine Learning Foundations en studio en live !</h4>
          <p className="text-white/80 text-[11px] font-semibold">Sujet: Convolutional Neural Networks (CNN) • Dr. Cheikh Ahmadou Bamba</p>
        </div>
      </div>
      <button 
        onClick={() => {
          const streamItem = liveSessions.find(s => s.status === 'active') || {
            id: "live-1"
          };
          onJoin(streamItem.id);
        }}
        className="relative z-10 py-3 px-5 rounded-2xl bg-white text-brand-red-deep font-black text-xs hover:bg-[#FFF8F7] shadow-lg leading-none shrink-0 transition-all hover:scale-102 cursor-pointer active:scale-98"
      >
        Rejoindre l'Amphi Virtuel
      </button>
    </div>
  );
}
