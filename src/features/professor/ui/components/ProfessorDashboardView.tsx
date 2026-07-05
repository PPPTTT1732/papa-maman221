import React, { useState } from 'react';
import type { ProfessorCourse, ProfessorSchedule, StudentEnrolled } from '../../domain/ProfessorModels';
import type { AttendanceStatus } from '../../domain/ProfessorAttendance';
import { Award, CheckCircle2, Users } from 'lucide-react';
import { ProfessorHeaderBanner } from './ProfessorHeaderBanner';
import { ProfessorWeeklySchedule } from './ProfessorWeeklySchedule';
import { ProfessorPresenceModal } from './ProfessorPresenceModal';

interface Props {
  readonly profName: string;
  readonly courses: readonly ProfessorCourse[];
  readonly homeworksCount: number;
  readonly validatedGrades: number;
  readonly classAvg: number;
  readonly schedule: readonly ProfessorSchedule[];
  readonly students: readonly StudentEnrolled[];
  readonly onMarkAttendance: (studentId: string, status: AttendanceStatus) => void;
  readonly onEnterCourse?: (courseId: string) => void;
}

export function ProfessorDashboardView({
  profName,
  courses,
  homeworksCount,
  validatedGrades,
  classAvg,
  schedule,
  students,
  onMarkAttendance,
  onEnterCourse,
}: Props) {
  const [showPresence, setShowPresence] = useState(false);

  return (
    <div className="space-y-6">
      <ProfessorHeaderBanner
        profName={profName}
        coursesCount={courses.length}
        onOpenPresence={() => setShowPresence(true)}
      />

      <ProfessorWeeklySchedule schedule={schedule} onEnterCourse={onEnterCourse} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-3xl bg-white p-5 shadow-sm border border-neutral-gray-200">
          <div className="flex items-center gap-3 text-brand-red-deep">
            <Award className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-wider">Performance moyenne</span>
          </div>
          <p className="mt-4 text-3xl font-black">{classAvg} / 20</p>
          <p className="mt-2 text-xs text-secondary">Moyenne de la classe actuelle</p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm border border-neutral-gray-200">
          <div className="flex items-center gap-3 text-sky-600">
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-wider">Activité évaluations</span>
          </div>
          <p className="mt-4 text-3xl font-black">{validatedGrades}</p>
          <p className="mt-2 text-xs text-secondary">Évaluations validées</p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm border border-neutral-gray-200">
          <div className="flex items-center gap-3 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-wider">Workflow</span>
          </div>
          <p className="mt-4 text-3xl font-black">{courses.length * 3}</p>
          <p className="mt-2 text-xs text-secondary">Actions pédagogiques potentielles</p>
        </div>
      </div>

      {showPresence && (
        <ProfessorPresenceModal
          profName={profName}
          students={students}
          onClose={() => setShowPresence(false)}
          onMarkAttendance={onMarkAttendance}
        />
      )}
    </div>
  );
}
