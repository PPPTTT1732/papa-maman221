import React, { useState } from 'react';
import type { ProfessorSchedule } from '../../domain/ProfessorModels';
import { ProfessorScheduleCard } from './ProfessorScheduleCard';

interface Props {
  readonly schedule: readonly ProfessorSchedule[];
  readonly onEnterCourse?: (courseId: string) => void;
}

const DAYS_MAP = [
  { key: 'Lundi', short: 'LUN' },
  { key: 'Mardi', short: 'MAR' },
  { key: 'Mercredi', short: 'MER' },
  { key: 'Jeudi', short: 'JEU' },
  { key: 'Vendredi', short: 'VEN' },
] as const;

export function ProfessorWeeklySchedule({ schedule, onEnterCourse }: Props) {
  const [selectedDay, setSelectedDay] = useState<string>('Lundi');

  // Find courses for selected day
  const sessionsForSelectedDay = schedule.filter(s => s.day === selectedDay && s.status !== 'annule');

  return (
    <section className="bg-white/90 backdrop-blur-md border border-neutral-gray-200 rounded-3xl p-6 shadow-sm overflow-hidden flex flex-col min-h-[300px] justify-between">
      {/* 1. Header */}
      <div className="flex justify-between items-center mb-5 shrink-0">
        <h3 className="font-headline-sm text-sm font-black flex items-center gap-2 text-[#291715]">
          <span translate="no" className="material-symbols-outlined text-brand-red-deep">calendar_month</span>
          Mon Emploi du Temps
        </h3>
        <span className="font-extrabold text-[10px] bg-brand-red-light text-brand-red-deep px-2.5 py-1 rounded-lg">
          Planification Hebdomadaire
        </span>
      </div>

      {/* 2. Day Selector */}
      <div className="w-full space-y-4">
        <div className="grid grid-cols-5 gap-1.5 shrink-0">
          {DAYS_MAP.map((day) => (
            <button
              key={day.key}
              onClick={() => setSelectedDay(day.key)}
              className={`py-2 px-1 text-center font-black text-xs rounded-xl transition-all duration-250 cursor-pointer border-0 ${
                selectedDay === day.key
                  ? 'bg-brand-red-deep text-white shadow-md'
                  : 'bg-neutral-gray-50 border border-neutral-gray-150 text-secondary hover:bg-neutral-100'
              }`}
            >
              {day.short}
            </button>
          ))}
        </div>

        {/* 3. Daily Content */}
        <div className="min-h-[140px] flex flex-col justify-center">
          {sessionsForSelectedDay.length === 0 ? (
            <div className="text-center py-6 text-neutral-400 space-y-1">
              <span className="material-symbols-outlined text-xl text-neutral-300">event_busy</span>
              <p className="text-xs font-bold">Aucune séance prévue ce jour</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {sessionsForSelectedDay.map((session) => (
                <ProfessorScheduleCard
                  key={session.id}
                  session={session}
                  onEnterCourse={onEnterCourse}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
