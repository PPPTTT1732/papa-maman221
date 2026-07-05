import type { ProfessorCourse } from '../../../domain/ProfessorModels';
import { Plus } from 'lucide-react';

interface Props {
  readonly selectedCourse?: ProfessorCourse | null;
  readonly isAddingModule: boolean;
  readonly setIsAddingModule: (value: boolean) => void;
}

export function ProfessorClassroomHeader({ selectedCourse, isAddingModule, setIsAddingModule }: Props) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm border border-neutral-gray-200">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] uppercase font-black text-secondary tracking-widest">Espace Classe</p>
          <h2 className="mt-2 text-xl font-black text-on-surface">
            {selectedCourse?.titre ?? 'Sélectionnez une classe'}
          </h2>
          <p className="mt-1 text-xs text-secondary">
            Salle : {selectedCourse?.salle ?? '—'} • Coefficient : {selectedCourse?.coefficient ?? '—'}
          </p>
        </div>
        <button
          onClick={() => setIsAddingModule(!isAddingModule)}
          className="inline-flex items-center gap-2 rounded-2xl bg-brand-red-deep px-4 py-2 text-xs font-black text-white transition hover:bg-[#6B0E10]"
        >
          <Plus className="w-4 h-4" />
          Nouveau module
        </button>
      </div>
    </section>
  );
}
