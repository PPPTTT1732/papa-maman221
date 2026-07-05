import type { StudentGrade } from '../../../domain/ProfessorModels';
import { Edit3, Save } from 'lucide-react';

interface Props {
  readonly grade: StudentGrade;
  readonly isEditing: boolean;
  readonly editCC: number;
  readonly editExam: number;
  readonly setEditCC: (value: number) => void;
  readonly setEditExam: (value: number) => void;
  readonly onEditStart: (studentId: string, currentCC: number, currentExam: number) => void;
  readonly onSave: (studentId: string) => Promise<void>;
}

export function ProfessorGradeRow({ grade, isEditing, editCC, editExam, setEditCC, setEditExam, onEditStart, onSave }: Props) {
  return (
    <tr className="hover:bg-neutral-gray-50">
      <td className="px-4 py-3">
        <div className="font-black text-[11px]">{grade.studentNom}</div>
        <div className="text-[10px] text-secondary">#{grade.studentId}</div>
      </td>
      <GradeCell isEditing={isEditing} value={isEditing ? editCC : grade.cc} onChange={setEditCC} />
      <GradeCell isEditing={isEditing} value={isEditing ? editExam : grade.examen} onChange={setEditExam} />
      <td className="px-4 py-3 text-center font-black text-brand-red-deep">{grade.finalGrade}</td>
      <td className="px-4 py-3 text-center">
        {isEditing ? (
          <button onClick={() => onSave(grade.studentId)} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-3 py-2 text-[10px] font-black text-white">
            <Save className="w-3.5 h-3.5" /> Sauvegarder
          </button>
        ) : (
          <button onClick={() => onEditStart(grade.studentId, grade.cc, grade.examen)} className="inline-flex items-center gap-2 rounded-2xl bg-neutral-gray-100 px-3 py-2 text-[10px] font-black text-secondary hover:bg-neutral-gray-200">
            <Edit3 className="w-3.5 h-3.5" /> Modifier
          </button>
        )}
      </td>
    </tr>
  );
}

function GradeCell({ isEditing, value, onChange }: { readonly isEditing: boolean; readonly value: number; readonly onChange: (value: number) => void }) {
  return (
    <td className="px-4 py-3 text-center">
      {isEditing ? (
        <input
          type="number"
          min={0}
          max={20}
          step={0.5}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="mx-auto w-16 rounded-xl border border-neutral-gray-300 px-2 py-1 text-center text-xs"
        />
      ) : value}
    </td>
  );
}
