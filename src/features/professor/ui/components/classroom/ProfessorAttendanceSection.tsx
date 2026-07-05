import type { StudentEnrolled } from '../../../domain/ProfessorModels';
import type { AttendanceByStudent, AttendanceStatus } from '../../../domain/ProfessorAttendance';
import { BookOpen } from 'lucide-react';

interface Props {
  readonly students: readonly StudentEnrolled[];
  readonly attendance: AttendanceByStudent;
  readonly onMarkAttendance: (studentId: string, status: AttendanceStatus) => void;
}

function statusClass(status: AttendanceStatus): string {
  if (status === 'present') return 'bg-emerald-100 text-emerald-700';
  if (status === 'retard') return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
}

function statusLabel(status: AttendanceStatus): string {
  if (status === 'present') return 'Présent';
  if (status === 'retard') return 'Retard';
  return 'Absent';
}

export function ProfessorAttendanceSection({ students, attendance, onMarkAttendance }: Props) {
  return (
    <section className="rounded-3xl bg-neutral-gray-50 p-6 shadow-sm border border-neutral-gray-200">
      <div className="flex items-center gap-2 text-brand-red-deep text-xs font-black uppercase tracking-[0.22em]">
        <BookOpen className="w-4 h-4" />
        Présence en classe
      </div>
      <div className="mt-5 space-y-4">
        {students.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-gray-300 bg-white p-6 text-center text-xs font-bold text-secondary">
            Aucun étudiant inscrit pour ce cours.
          </div>
        ) : (
          students.map((student) => {
            const status = attendance[student.id] ?? 'absent';
            return (
              <div key={student.id} className="rounded-3xl border border-neutral-gray-200 bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h4 className="text-sm font-black text-on-surface">{student.prenom} {student.nom}</h4>
                    <p className="mt-1 text-[10px] text-secondary">Matricule : {student.matricule}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-black ${statusClass(status)}`}>
                    {statusLabel(status)}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(['present', 'retard', 'absent'] as const).map((nextStatus) => (
                    <button
                      key={nextStatus}
                      type="button"
                      onClick={() => onMarkAttendance(student.id, nextStatus)}
                      className={`rounded-2xl px-3 py-2 text-[10px] font-black ${statusClass(nextStatus)}`}
                    >
                      {statusLabel(nextStatus)}
                    </button>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
