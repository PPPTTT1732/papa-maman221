import type { ProfessorCourse, StudentGrade } from '../../domain/ProfessorModels';
import { ProfessorGradeRow } from './grades/ProfessorGradeRow';

interface Props {
  readonly selectedCourse?: ProfessorCourse | null;
  readonly grades: readonly StudentGrade[];
  readonly editingGradeStudentId: string | null;
  readonly editCC: number;
  readonly editExam: number;
  readonly setEditCC: (value: number) => void;
  readonly setEditExam: (value: number) => void;
  readonly handleGradeEditStart: (studentId: string, currentCC: number, currentExam: number) => void;
  readonly handleGradeSave: (studentId: string) => Promise<void>;
}

export function ProfessorGradesView(props: Props) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm border border-neutral-gray-200">
        <h2 className="text-base font-black text-on-surface">Carnet de notes</h2>
        <p className="mt-2 text-xs text-secondary">
          Modifiez les notes CC et Examen en temps réel pour {props.selectedCourse?.titre ?? 'la classe sélectionnée'}.
        </p>
      </section>
      <section className="overflow-hidden rounded-3xl border border-neutral-gray-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-[12px]">
          <thead className="bg-neutral-gray-50 text-[10px] uppercase tracking-[0.24em] text-secondary">
            <tr>
              <th className="px-4 py-3">Étudiant</th>
              <th className="px-4 py-3 text-center">CC</th>
              <th className="px-4 py-3 text-center">Examen</th>
              <th className="px-4 py-3 text-center">Finale</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-gray-200">
            {props.grades.map((grade) => (
              <ProfessorGradeRow
                key={grade.studentId}
                grade={grade}
                isEditing={props.editingGradeStudentId === grade.studentId}
                editCC={props.editCC}
                editExam={props.editExam}
                setEditCC={props.setEditCC}
                setEditExam={props.setEditExam}
                onEditStart={props.handleGradeEditStart}
                onSave={props.handleGradeSave}
              />
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
