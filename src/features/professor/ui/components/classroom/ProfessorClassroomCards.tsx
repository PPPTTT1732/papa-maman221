import React from 'react';
import { BookOpen, MapPin, Calendar, Shield, CheckCircle2 } from 'lucide-react';
import type { ProfessorCourse } from '../../../domain/ProfessorModels';

interface Props {
  readonly courses: readonly ProfessorCourse[];
  readonly selectedCourseId: string;
  readonly onSelectCourse: (id: string) => void;
}

export function ProfessorClassroomCards({ courses, selectedCourseId, onSelectCourse }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-black text-neutral-800 tracking-tight">Mes Salles de Classe</h3>
          <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
            Sélectionnez la salle de classe active pour en voir les ressources et l&apos;appel
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => {
          const isSelected = selectedCourseId === course.id;
          return (
            <div
              key={course.id}
              onClick={() => onSelectCourse(course.id)}
              className={`p-5 rounded-3xl border transition-all duration-300 cursor-pointer select-none relative overflow-hidden group shadow-sm flex flex-col justify-between min-h-[160px] ${
                isSelected
                  ? 'bg-gradient-to-br from-white to-red-50/10 border-brand-red-deep ring-2 ring-brand-red-deep/10 scale-100 shadow-md'
                  : 'bg-white border-neutral-gray-200 hover:border-neutral-gray-350 hover:-translate-y-1 hover:shadow-md'
              } active:scale-[0.98]`}
            >
              {/* Highlight badge for selected class */}
              {isSelected && (
                <div className="absolute top-3 right-3 bg-brand-red-deep text-white p-1 rounded-full shadow-sm animate-fade-in z-10">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`h-9 w-9 flex items-center justify-center rounded-xl transition-all ${
                      isSelected
                        ? 'bg-brand-red-deep/10 text-brand-red-deep'
                        : 'bg-neutral-100 text-neutral-500 group-hover:bg-brand-red-deep/5 group-hover:text-brand-red-deep'
                    }`}
                  >
                    {course.id.includes('4') ? <Shield className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                  </div>
                  <span
                    className={`text-[9.5px] font-black px-2.5 py-1 rounded-lg uppercase ${
                      isSelected ? 'bg-brand-red-deep/10 text-brand-red-deep' : 'bg-neutral-50 text-neutral-500'
                    }`}
                  >
                    Coef. {course.coefficient}
                  </span>
                </div>

                <h4
                  className={`text-sm font-black tracking-tight leading-snug group-hover:text-brand-red-deep transition-colors line-clamp-2 pr-6 ${
                    isSelected ? 'text-brand-red-deep' : 'text-neutral-800'
                  }`}
                >
                  {course.titre}
                </h4>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100/80 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-bold">
                  <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate">Salle: {course.salle}</span>
                </div>

                <div className="flex items-center gap-2 text-[10.5px] text-neutral-400 font-semibold">
                  <Calendar className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate">Suivant: {course.prochainCours}</span>
                </div>

                {/* Progress bar */}
                <div className="pt-1">
                  <div className="flex items-center justify-between text-[9px] text-neutral-400 font-extrabold uppercase mb-1 tracking-wider">
                    <span>Progression du cours</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isSelected ? 'bg-brand-red-deep' : 'bg-neutral-400'
                      }`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
