import React from 'react';
import { LiveSession } from '@/features/student/types';

interface RegisteredCoursesProps {
  liveSessions: LiveSession[];
  onSelectLive: (id: string) => void;
}

export function RegisteredCourses({ liveSessions, onSelectLive }: RegisteredCoursesProps) {
  return (
    <section className="col-span-12 md:col-span-8 space-y-4">
      <h3 className="font-title-lg text-sm font-black flex items-center gap-2 text-[#291715]">
        <span translate="no" className="material-symbols-outlined text-brand-red-deep">school</span>
        Maquette de mes cours (Analyse de crédits)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {liveSessions.map(c => {
          const progressPercentage = c.id === 'live-1' ? 78 : 50;
          return (
            <div key={c.id} className="bg-white border border-neutral-gray-200 rounded-2xl overflow-hidden hover:shadow transition-shadow group p-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[8.5px] font-black bg-brand-red-light text-brand-red-deep px-2 py-0.5 rounded uppercase">{c.teacherName}</span>
                  <span translate="no" className="material-symbols-outlined text-xs text-[#E3A857]">star</span>
                </div>
                <h4 className="font-bold text-xs text-[#291715] group-hover:text-brand-red-deep transition-colors line-clamp-1">{c.courseName}</h4>
                <p className="text-[10px] text-secondary line-clamp-2 mt-1 leading-relaxed">{c.title}</p>
              </div>
              <div className="mt-4 space-y-2">
                <div className="w-full bg-neutral-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-brand-red-deep h-full rounded-full transition-all" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500">
                  <span>Progression : {progressPercentage}%</span>
                  <button 
                    onClick={() => onSelectLive(c.id)}
                    className="text-brand-red-deep font-black hover:underline cursor-pointer"
                  >
                    Suivre le direct
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
