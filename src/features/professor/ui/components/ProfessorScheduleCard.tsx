import React from 'react';
import type { ProfessorSchedule } from '../../domain/ProfessorModels';

interface Props {
  readonly session: ProfessorSchedule;
  readonly onEnterCourse?: (courseId: string) => void;
}

export function ProfessorScheduleCard({ session, onEnterCourse }: Props) {
  return (
    <div className="p-4 rounded-2xl border border-neutral-gray-200 bg-neutral-gray-50/50 hover:bg-white hover:border-brand-red-deep/20 transition-all shadow-3xs flex flex-col justify-between">
      <div className="flex justify-between items-start mb-1">
        <span className="text-[9px] font-black text-brand-red-deep font-mono tracking-widest">{session.time}</span>
        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
          session.type === 'CM' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
          session.type === 'TP' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
          'bg-amber-50 text-amber-600 border border-amber-100'
        }`}>
          {session.type}
        </span>
      </div>

      <h4 className="font-black text-xs text-on-surface mb-2 leading-tight">{session.courseTitle}</h4>

      <div className="flex items-center justify-between mt-1 text-[10px] text-secondary">
        <div className="flex items-center gap-1 font-bold">
          <span className="material-symbols-outlined text-xs text-brand-red-deep">location_on</span>
          <span>Salle : {session.room}</span>
        </div>
        {session.courseId && onEnterCourse && (
          <button
            onClick={() => onEnterCourse(session.courseId!)}
            className="text-[9px] font-black text-brand-red-deep hover:underline cursor-pointer border-none bg-transparent p-0 flex items-center gap-0.5"
          >
            Rejoindre <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
          </button>
        )}
      </div>
    </div>
  );
}
