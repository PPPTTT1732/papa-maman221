import React from 'react';

interface ClassesProps {
  readonly courses: any[];
  readonly selectedCourseId: string;
  readonly activeTab: string;
  readonly onSelectCourse: (id: string) => void;
  readonly onSelectTab: (tab: string) => void;
  readonly triggerToast: (msg: string) => void;
}

export function ProfessorSidebarClasses({
  courses,
  selectedCourseId,
  activeTab,
  onSelectCourse,
  onSelectTab,
  triggerToast
}: ClassesProps) {
  return (
    <div className="my-2 border-t border-neutral-gray-250 pt-3 select-none">
      <span className="px-3 text-[10px] font-black uppercase text-[#64748B] tracking-wider block mb-2">Mes Classes</span>
      <div className="space-y-1">
        {courses.map((course) => {
          const isSelected = selectedCourseId === course.id && activeTab === 'classroom';
          return (
            <button
              key={course.id}
              onClick={() => {
                onSelectCourse(course.id);
                onSelectTab('classroom');
                triggerToast(`Classe : ${course.titre}`);
              }}
              className={`w-full flex flex-row items-center gap-2 px-3 py-1.5 font-semibold text-xs rounded-lg transition-all text-left cursor-pointer ${
                isSelected
                  ? 'bg-brand-red-deep/10 text-brand-red-deep font-black border-l-2 border-brand-red-deep'
                  : 'text-secondary hover:bg-secondary-container/50 hover:translate-x-1'
              }`}
            >
              <span translate="no" className="material-symbols-outlined text-[16px]">
                {isSelected ? 'co_present' : 'class'}
              </span>
              <span className="truncate leading-tight flex-grow">{course.titre}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
