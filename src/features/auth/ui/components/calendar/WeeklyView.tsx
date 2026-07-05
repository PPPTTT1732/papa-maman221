import React from 'react';
import { MapPin, Clock, User, Play } from 'lucide-react';
import { DAYS_ORDER } from './CalendarData';

export function WeeklyView({ state }: { state: any }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 h-full items-start">
      {DAYS_ORDER.map((dayObj) => {
        const session = state.displayedSessions.find((s: any) => s.jour === dayObj.key);
        const isToday = dayObj.key === 'MER'; // Simulation of current day
        const isDirect = session?.enCours;

        return (
          <div
            key={dayObj.key}
            onClick={() => session && state.handleSelectCourse(session)}
            className={`p-4 rounded-2xl border flex flex-col justify-between transition-all duration-300 select-none group min-h-[140px] lg:min-h-[190px] shadow-sm ${
              isDirect
                ? 'bg-gradient-to-br from-[#FFF5F5] to-red-50/40 border-[#B3181C] ring-2 ring-[#B3181C]/10 cursor-pointer hover:-translate-y-1 hover:shadow-md'
                : isToday
                ? 'bg-gradient-to-br from-neutral-50/80 to-white border-[#B3181C]/40 hover:-translate-y-1 hover:shadow-md cursor-pointer'
                : session
                ? 'bg-white border-neutral-200/80 hover:border-neutral-300 hover:-translate-y-1 hover:shadow-md cursor-pointer'
                : 'bg-neutral-50/50 border-neutral-200/50 cursor-default'
            } active:scale-[0.98]`}
          >
            <div className="flex flex-col flex-grow justify-between">
              {/* Card Header (Day & Live badge) */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-100/80">
                <span
                  className={`text-[10px] font-black uppercase tracking-widest ${
                    isDirect || isToday ? 'text-[#B3181C]' : 'text-[#8E7977]'
                  }`}
                >
                  {dayObj.name}
                  {isToday && <span className="ml-1 text-[8px] font-bold lowercase text-neutral-400 font-sans">(Aujourd&apos;hui)</span>}
                </span>
                {isDirect && (
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B3181C] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B3181C]"></span>
                  </span>
                )}
              </div>

              {/* Card Content */}
              {session ? (
                <div className="flex flex-col flex-grow justify-between min-h-[90px] lg:min-h-[105px]">
                  {/* Heure */}
                  <div className="flex items-center gap-1 mb-1">
                    <Clock className="h-3 w-3 text-neutral-400" />
                    <span className={`text-[10px] font-bold ${isDirect ? 'text-[#B3181C] font-black' : 'text-neutral-500'}`}>
                      {session.heure}
                    </span>
                  </div>

                  {/* Course Title */}
                  <div className="mb-2.5">
                    <h4 className="text-xs md:text-[13px] font-black text-neutral-800 group-hover:text-[#B3181C] transition-colors leading-snug">
                      {session.nom}
                    </h4>
                  </div>

                  {/* Metadata (Salle & Professor) */}
                  <div className="space-y-1 mt-auto">
                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-bold">
                      <MapPin className="h-3 w-3 text-neutral-400" />
                      <span>{session.salle}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9.5px] text-neutral-400 font-semibold truncate">
                      <User className="h-3 w-3 text-neutral-400 shrink-0" />
                      <span className="truncate">{session.professeur}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-neutral-400/70">
                  <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md">
                    Pas de cours
                  </span>
                </div>
              )}
            </div>

            {/* Card Footer */}
            {session && (
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-neutral-100/60">
                <span
                  className={`text-[8.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    session.type === 'CM'
                      ? 'bg-blue-50 text-blue-600 border border-blue-100/50'
                      : session.type === 'TP'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50'
                      : 'bg-amber-50 text-amber-600 border border-amber-100/50'
                  }`}
                >
                  {session.type}
                </span>
                {isDirect && (
                  <span className="text-[8.5px] font-black text-[#B3181C] uppercase tracking-wider flex items-center gap-0.5 animate-pulse">
                    <Play className="h-2 w-2 fill-current" /> En direct
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

