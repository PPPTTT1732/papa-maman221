import type { CourseModule } from '../../../domain/ProfessorModels';
import { BookOpen } from 'lucide-react';

interface Props {
  readonly modules: readonly CourseModule[];
}

export function ProfessorModuleList({ modules }: Props) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm border border-neutral-gray-200">
      <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-secondary">
        <BookOpen className="w-4 h-4" />
        Modules de cours
      </div>
      <div className="mt-5 space-y-4">
        {modules.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-gray-300 bg-neutral-gray-50 p-6 text-center text-xs font-bold text-secondary">
            Aucun module créé pour ce cours.
          </div>
        ) : (
          modules.map((module) => (
            <div key={module.id} className="rounded-3xl border border-neutral-gray-200 bg-neutral-gray-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-black text-on-surface">{module.title}</h3>
                  <p className="mt-2 text-xs text-secondary">{module.description}</p>
                </div>
                <span className="rounded-full bg-brand-red-deep/10 px-3 py-1 text-[10px] font-black text-brand-red-deep">
                  Module
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
