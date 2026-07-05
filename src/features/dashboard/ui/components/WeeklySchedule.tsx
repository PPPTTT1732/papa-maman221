import React from 'react';
import { CoursItem } from '@/features/student/types';
import { COURS_DATA_DASHBOARD } from '@/features/student/data/mockCourses';

interface WeeklyScheduleProps {
  selectedDay: 'LUN' | 'MAR' | 'MER' | 'JEU' | 'VEN';
  setSelectedDay: (day: 'LUN' | 'MAR' | 'MER' | 'JEU' | 'VEN') => void;
  onSelectCourse: (course: CoursItem) => void;
}

export function WeeklySchedule({
  selectedDay,
  setSelectedDay,
  onSelectCourse
}: WeeklyScheduleProps) {
  const activeCours = COURS_DATA_DASHBOARD.find(c => c.jour === selectedDay);

  const DAYS_ORDER = [
    { key: 'LUN', name: 'Lundi' },
    { key: 'MAR', name: 'Mardi' },
    { key: 'MER', name: 'Mercredi' },
    { key: 'JEU', name: 'Jeudi' },
    { key: 'VEN', name: 'Vendredi' }
  ] as const;

  return (
    <section className="col-span-12 bg-white/90 backdrop-blur-md border border-neutral-gray-200 rounded-3xl p-6 shadow-sm overflow-hidden flex flex-col min-h-[350px] h-[350px] justify-between">
      {/* 1. Shared Header */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h3 className="font-title-lg text-sm font-black flex items-center gap-2 text-[#291715]">
          <span translate="no" className="material-symbols-outlined text-brand-red-deep">calendar_month</span>
          Emploi du temps hebdomadaire
        </h3>
        <div className="flex items-center gap-1">
          <span className="font-extrabold text-[10px] bg-brand-red-light text-brand-red-deep px-2.5 py-1 rounded-lg">Semaine Courante</span>
        </div>
      </div>

      {/* 2. Mobile Day-By-Day Selector (shown ONLY on mobile below md) */}
      <div className="block md:hidden w-full space-y-4">
        <div className="grid grid-cols-5 gap-1.5 shrink-0">
          {(['LUN', 'MAR', 'MER', 'JEU', 'VEN'] as const).map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`py-2 px-1 text-center font-black text-xs rounded-xl transition-all duration-250 cursor-pointer ${
                selectedDay === day
                  ? 'bg-brand-red-deep text-white shadow-md shadow-brand-red-deep/15 scale-102'
                  : 'bg-neutral-gray-50 border border-neutral-gray-150 text-secondary hover:bg-neutral-100'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="flex-grow flex flex-col justify-center min-h-[140px]">
          {!activeCours ? (
            <p className="text-center text-xs text-secondary py-4">Aucun cours prévu</p>
          ) : (
            <div 
              onClick={() => onSelectCourse(activeCours)}
              className={`p-4 rounded-2xl border transition-all duration-300 pointer-events-auto cursor-pointer hover:shadow hover:scale-101 group relative ${
                activeCours.enCours 
                  ? 'bg-brand-red-light/75 border-brand-red-deep/30 shadow-xs' 
                  : 'bg-neutral-50/50 border-neutral-gray-200 hover:border-brand-red-deep/25'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[9.5px] font-black text-brand-red-deep uppercase tracking-widest">{activeCours.heure}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[8.5px] font-black uppercase ${
                  activeCours.enCours ? 'bg-brand-red-deep text-white animate-pulse' : 'bg-neutral-gray-200 text-[#291715]'
                }`}>
                  {activeCours.type}
                </span>
              </div>
              
              <h4 className="font-black text-xs text-on-surface mb-1 group-hover:text-brand-red-deep transition-colors">
                {activeCours.nom}
              </h4>
              
              <div className="flex items-center justify-between text-[11px] text-secondary">
                <div className="flex items-center gap-1.5 font-bold">
                  <span translate="no" className="material-symbols-outlined text-xs text-brand-red-deep">location_on</span>
                  <span>{activeCours.salle}</span>
                  <span className="text-neutral-300">•</span>
                  <span className="truncate max-w-[130px] font-heavy text-neutral-500">{activeCours.professeur}</span>
                </div>
                <span translate="no" className="material-symbols-outlined text-xs text-brand-red-deep group-hover:translate-x-0.5 transition-all">arrow_forward</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Tablet/Desktop Week Grid (shown ONLY on md and above) */}
      <div className="hidden md:grid grid-cols-5 gap-3 flex-grow items-stretch select-none">
        {DAYS_ORDER.map((dayObj) => {
          const course = COURS_DATA_DASHBOARD.find(c => c.jour === dayObj.key);
          const isToday = dayObj.key === 'MER'; // Mercredi is simulated as today in other panels
          const isEnCours = course?.enCours;

          return (
            <div 
              key={dayObj.key}
              style={{ height: '201px' }}
              className={`p-3 rounded-2xl border flex flex-col justify-between transition-all duration-300 relative ${
                isEnCours
                  ? 'bg-brand-red-light/60 border-brand-red-deep shadow-sm shadow-brand-red-deep/5 ring-1 ring-brand-red-deep/20 scale-[1.01]'
                  : isToday
                    ? 'bg-white border-[#B3181C]/25 shadow-2xs'
                    : 'bg-neutral-50/40 border-neutral-gray-150 hover:bg-[#FFF8F7]/30 hover:border-brand-red-deep/15'
              }`}
            >
              <div className="flex flex-col flex-grow">
                {/* Day Header Column */}
                <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-neutral-100">
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest ${
                    isEnCours || isToday ? 'text-brand-red-deep font-black' : 'text-neutral-gray-500'
                  }`}>
                    {dayObj.name}
                  </span>
                  {isEnCours && (
                    <span className="flex h-1.5 w-1.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red-deep opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-red-deep"></span>
                    </span>
                  )}
                </div>

                {course ? (
                  <div 
                    onClick={() => onSelectCourse(course)}
                    className="cursor-pointer group flex flex-col flex-grow h-full justify-between"
                  >
                    <div>
                      {/* Time */}
                      <span className={`text-[9px] font-extrabold font-mono mb-1 inline-block ${
                        isEnCours ? 'text-brand-red-deep' : 'text-neutral-gray-400'
                      }`}>
                        {course.heure}
                      </span>

                      {/* Course Title */}
                      <h4 className={`text-[11.5px] font-bold leading-tight mb-2 tracking-tight line-clamp-2 transition-colors duration-250 ${
                        isEnCours 
                          ? 'text-brand-red-deep font-black group-hover:text-black' 
                          : 'text-[#291715] group-hover:text-brand-red-deep'
                      }`}>
                        {course.nom}
                      </h4>
                    </div>

                    {/* Meta info */}
                    <div className="space-y-0.5 mt-auto">
                      <div className="flex items-center gap-1 text-[9.5px] text-neutral-gray-400 font-semibold">
                        <span translate="no" className="material-symbols-outlined text-[10px] text-brand-red-deep/70">location_on</span>
                        <span className="truncate">{course.salle}</span>
                      </div>
                      <div className="text-[9px] text-neutral-gray-500 font-medium truncate">
                        {course.professeur}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-neutral-gray-300">
                    <span translate="no" className="material-symbols-outlined text-lg">event_busy</span>
                    <span className="text-[9px] font-bold mt-1">Aucun cours</span>
                  </div>
                )}
              </div>

              {/* Day/Type Badge overlay at the bottom corner for premium feel */}
              {course && (
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-neutral-100/50">
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md ${
                    course.type === 'CM' 
                      ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                      : course.type === 'TP' 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {course.type}
                  </span>
                  {isEnCours && (
                    <span className="text-[8px] font-black text-brand-red-deep uppercase tracking-widest animate-pulse">
                      Direct
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
