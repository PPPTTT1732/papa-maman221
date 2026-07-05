import React, { useState } from 'react';
import { ArrowLeft, BookOpen, PenTool, Award, Users, Bell, GraduationCap } from 'lucide-react';
import { ProfessorAttendanceSection } from './classroom/ProfessorAttendanceSection';
import { ProfessorClassroomHeader } from './classroom/ProfessorClassroomHeader';
import { ProfessorLessonReminderForms } from './classroom/ProfessorLessonReminderForms';
import { ProfessorModuleForm } from './classroom/ProfessorModuleForm';
import { ProfessorModuleList } from './classroom/ProfessorModuleList';
import { ProfessorPublishedLists } from './classroom/ProfessorPublishedLists';
import { ProfessorClassroomCards } from './classroom/ProfessorClassroomCards';
import { ProfessorHomeworkView } from './ProfessorHomeworkView';
import { ProfessorGradesView } from './ProfessorGradesView';
import type { ClassroomProps } from './classroom/ClassroomProps';

const EMPTY_ATTENDANCE = {};

export function ProfessorClassroomView(props: ClassroomProps) {
  const [subTab, setSubTab] = useState<'modules' | 'homework' | 'grades' | 'attendance' | 'announcements'>('modules');

  if (!props.selectedCourse) {
    return (
      <div className="space-y-6">
        <section className="relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 bg-[#f1f5f9] p-6 sm:p-8 rounded-3xl border border-neutral-200/50 shadow-3xs">
          {/* Decorative shapes to match Student's premium aesthetic */}
          <div className="absolute right-0 top-0 -mt-12 -mr-12 w-48 h-48 rounded-full bg-[#B3181C]/5 pointer-events-none" />
          <div className="absolute left-0 bottom-0 -mb-12 -ml-12 w-36 h-36 rounded-full bg-[#B3181C]/3 pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left relative z-10 max-w-2xl">
            <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-[#B3181C] shadow-sm border border-neutral-250/30 shrink-0">
              <GraduationCap className="h-7 w-7 stroke-[2.2]" />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 bg-[#B3181C]/10 px-2.5 py-0.5 rounded-full mb-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B3181C] animate-pulse" />
                <span className="font-mono text-[9px] text-[#B3181C] font-black uppercase tracking-wider">
                  Accès Requis
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-800 tracking-tight leading-none">
                Veuillez entrer dans une Salle de Classe
              </h2>
              <p className="text-xs sm:text-[13px] leading-relaxed text-neutral-500 font-bold max-w-xl">
                Choisissez l&apos;un de vos cours ci-dessous pour faire l&apos;appel des étudiants, organiser les modules de cours, assigner des devoirs ou enregistrer les notes d&apos;évaluation.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center gap-1 bg-white p-3.5 rounded-2xl border border-neutral-200/50 shadow-3xs max-w-[160px] text-center select-none relative group transition-all hover:border-brand-red-deep/30 z-10">
            <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Salles Disponibles</span>
            <span className="text-2xl font-black text-[#B3181C] font-mono">{props.courses.length}</span>
            <span className="text-[9px] text-neutral-400 font-bold leading-tight">Classes prêtes pour la session</span>
          </div>
        </section>
        <ProfessorClassroomCards courses={props.courses} selectedCourseId="" onSelectCourse={props.onSelectCourse} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-150 shadow-sm">
        <button
          onClick={() => props.onSelectCourse('')}
          className="flex items-center gap-2 text-xs font-black text-[#B3181C] hover:text-[#6B0E10] transition-colors cursor-pointer bg-[#FFF5F5] px-3.5 py-2 rounded-xl border border-[#B3181C]/10 hover:border-[#B3181C]/30"
        >
          <ArrowLeft className="h-4 w-4" /> Changer de classe
        </button>
        <div className="text-right sm:text-left">
          <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest bg-neutral-100 px-2 py-0.5 rounded-md">Classe Active</span>
          <h3 className="text-sm font-black text-neutral-800 mt-1 flex items-center gap-1.5 justify-end sm:justify-start">
            <span className="h-2 w-2 rounded-full bg-brand-red-deep animate-pulse shrink-0" />
            {props.selectedCourse.titre} <span className="text-neutral-400 font-bold">({props.selectedCourse.salle})</span>
          </h3>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto no-scrollbar bg-neutral-100 p-1 rounded-2xl border border-neutral-150 shrink-0">
        {[
          { id: 'modules', label: 'Chapitres', icon: BookOpen },
          { id: 'homework', label: 'Devoirs', icon: PenTool },
          { id: 'grades', label: 'Notes', icon: Award },
          { id: 'attendance', label: 'Appel', icon: Users },
          { id: 'announcements', label: 'Rappels', icon: Bell },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                isActive
                  ? 'bg-white text-brand-red-deep shadow-sm border border-neutral-200/50 scale-100'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-white/50'
              }`}
            >
              <IconComp className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="animate-fade-in">
        {subTab === 'modules' && (
          <div className="space-y-6">
            <ProfessorClassroomHeader {...props} />
            <ProfessorModuleForm {...props} />
            <ProfessorModuleList modules={props.modules} />
          </div>
        )}
        {subTab === 'homework' && <ProfessorHomeworkView {...props} />}
        {subTab === 'grades' && <ProfessorGradesView {...props} />}
        {subTab === 'attendance' && (
          <ProfessorAttendanceSection
            students={props.students}
            attendance={props.attendance ?? EMPTY_ATTENDANCE}
            onMarkAttendance={props.onMarkAttendance}
          />
        )}
        {subTab === 'announcements' && (
          <div className="space-y-6">
            <ProfessorLessonReminderForms {...props} />
            <ProfessorPublishedLists reminders={props.reminders} lessons={props.lessons} />
          </div>
        )}
      </div>
    </div>
  );
}
