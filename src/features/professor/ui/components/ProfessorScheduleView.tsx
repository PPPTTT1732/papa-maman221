import type { ProfessorSchedule } from '../../domain/ProfessorModels';
import { Calendar, RefreshCw } from 'lucide-react';

interface Props {
  readonly schedule: readonly ProfessorSchedule[];
  readonly handleCancelCourse: (sessionId: string, reason: string) => Promise<void>;
  readonly handleRescheduleCourse: (sessionId: string, day: string, time: string, room: string) => Promise<void>;
  readonly onEnterCourse: (courseId: string) => void;
}

export function ProfessorScheduleView({
  schedule,
  handleCancelCourse,
  handleRescheduleCourse,
  onEnterCourse,
}: Props) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm border border-neutral-gray-200">
        <div className="flex items-center gap-3 text-brand-red-deep text-xs uppercase tracking-[0.22em] font-black">
          <Calendar className="w-4 h-4" />
          Gestion de l'emploi du temps
        </div>
        <p className="mt-3 text-sm text-secondary">Consultez les séances planifiées et réagissez rapidement aux aléas de planning.</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {schedule.map((session) => (
          <div key={session.id} className="rounded-3xl border border-neutral-gray-200 bg-neutral-gray-50 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-secondary font-black">{session.type}</p>
                <h3 className="mt-2 text-sm font-black text-on-surface">{session.courseTitle}</h3>
              </div>
              <span className="rounded-full bg-brand-red-deep/10 px-3 py-1 text-[10px] font-black text-brand-red-deep">
                {session.room}
              </span>
            </div>
            <div className="mt-4 space-y-2 text-[11px] text-secondary">
              <div className="flex justify-between">
                <span>Jour</span>
                <strong className="text-on-surface">{session.day}</strong>
              </div>
              <div className="flex justify-between">
                <span>Heure</span>
                <strong className="text-on-surface">{session.time}</strong>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => handleCancelCourse(session.id, 'Empêchement pédagogique')}
                className="flex-1 rounded-2xl bg-brand-red-light px-4 py-3 text-[10px] font-black text-brand-red-deep hover:bg-brand-red-deep/10"
              >
                Annuler
              </button>
              {session.courseId ? (
                <button
                  type="button"
                  onClick={() => onEnterCourse(session.courseId!)}
                  className="flex-1 rounded-2xl bg-brand-red-deep px-4 py-3 text-[10px] font-black text-white hover:bg-[#6B0E10]"
                >
                  Entrer dans le cours
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleRescheduleCourse(session.id, session.day, session.time, session.room)}
                  className="flex-1 rounded-2xl bg-white border border-neutral-gray-200 px-4 py-3 text-[10px] font-black text-secondary hover:bg-neutral-gray-100"
                >
                  <RefreshCw className="mr-2 inline-block w-3.5 h-3.5" /> Reprogrammer
                </button>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
