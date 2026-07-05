import { useState, useCallback } from 'react';
import { useProfessor } from './useProfessor';
import { useProfessorGradeForm } from './useProfessorGradeForm';
import { useProfessorHomeworkFormState } from './useProfessorHomeworkFormState';
import { useProfessorClassroomFormState } from './useProfessorClassroomFormState';
import { useProfessorQuizFormState } from './useProfessorQuizFormState';
import { useProfessorScheduleState } from './useProfessorScheduleState';

export function useProfessorDashboardPage() {
  const professor = useProfessor();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => setToastMessage(null), 4000);
  }, []);

  const gradeForm = useProfessorGradeForm(professor, triggerToast);
  const homeworkForm = useProfessorHomeworkFormState(professor, triggerToast);
  const classroomForm = useProfessorClassroomFormState(professor, triggerToast);
  const quizForm = useProfessorQuizFormState(professor, triggerToast);
  const scheduleState = useProfessorScheduleState();

  const handleEnterCourse = useCallback((courseId: string) => {
    professor.selectCourse(courseId);
    setActiveTab('classroom');
    triggerToast('Ouverture du cours en classe');
  }, [professor, triggerToast]);

  return {
    ...professor,
    activeTab,
    setActiveTab,
    toastMessage,
    ...gradeForm,
    ...homeworkForm,
    ...classroomForm,
    ...quizForm,
    ...scheduleState,
    triggerToast,
    handleEnterCourse,
    handleCreateModule: classroomForm.handleModuleSubmit,
  };
}
