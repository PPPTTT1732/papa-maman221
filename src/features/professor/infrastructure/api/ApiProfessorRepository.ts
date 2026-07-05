import { apiClient } from '@/shared/lib/apiClient';
import type { ProfessorRepository } from '../../domain/ProfessorRepository';
import type {
  ProfessorCourse,
  StudentEnrolled,
  StudentGrade,
  ProfessorHomework,
  ProfessorSchedule,
  VigilCheckIn,
  ClassroomReminder,
  ProfessorLesson,
  CourseModule,
  CourseQuiz,
  QuizQuestion
} from '../../domain/ProfessorModels';

export class ApiProfessorRepository implements ProfessorRepository {
  async getCourses(profId: string): Promise<ProfessorCourse[]> {
    const response = await apiClient.get('/professor/courses', { params: { profId } });
    return response.data;
  }

  async getStudents(courseId: string): Promise<StudentEnrolled[]> {
    const response = await apiClient.get(`/professor/courses/${courseId}/students`);
    return response.data;
  }

  async getGrades(courseId: string): Promise<StudentGrade[]> {
    const response = await apiClient.get(`/professor/courses/${courseId}/grades`);
    return response.data;
  }

  async updateGrade(courseId: string, studentId: string, cc: number, examen: number): Promise<StudentGrade> {
    const response = await apiClient.post(`/professor/courses/${courseId}/grades/${studentId}`, { cc, examen });
    return response.data;
  }

  async getHomeworks(courseId: string): Promise<ProfessorHomework[]> {
    const response = await apiClient.get(`/professor/courses/${courseId}/homeworks`);
    return response.data;
  }

  async createHomework(courseId: string, titre: string, desc: string, prio: 'haute' | 'normale', deadlineStr: string): Promise<ProfessorHomework> {
    const response = await apiClient.post(`/professor/courses/${courseId}/homeworks`, { titre, desc, prio, deadlineStr });
    return response.data;
  }

  async getSchedule(profId: string): Promise<ProfessorSchedule[]> {
    const response = await apiClient.get('/professor/schedule', { params: { profId } });
    return response.data;
  }

  async cancelCourse(sessionId: string, reason: string): Promise<void> {
    await apiClient.post(`/professor/schedule/${sessionId}/cancel`, { reason });
  }

  async rescheduleCourse(sessionId: string, day: string, time: string, room: string): Promise<void> {
    await apiClient.post(`/professor/schedule/${sessionId}/reschedule`, { day, time, room });
  }

  async getVigilCheckIns(): Promise<VigilCheckIn[]> {
    const response = await apiClient.get('/vigil/check-ins');
    return response.data;
  }

  async getReminders(courseId: string): Promise<ClassroomReminder[]> {
    const response = await apiClient.get(`/professor/courses/${courseId}/reminders`);
    return response.data;
  }

  async createReminder(courseId: string, content: string, isUrgent: boolean): Promise<ClassroomReminder> {
    const response = await apiClient.post(`/professor/courses/${courseId}/reminders`, { content, isUrgent });
    return response.data;
  }

  async getLessons(courseId: string): Promise<ProfessorLesson[]> {
    const response = await apiClient.get(`/professor/courses/${courseId}/lessons`);
    return response.data;
  }

  async createLesson(courseId: string, title: string, description: string, attachmentName?: string, attachmentUrl?: string, moduleId?: string): Promise<ProfessorLesson> {
    const response = await apiClient.post(`/professor/courses/${courseId}/lessons`, { title, description, attachmentName, attachmentUrl, moduleId });
    return response.data;
  }

  async getModules(courseId: string): Promise<CourseModule[]> {
    const response = await apiClient.get(`/professor/courses/${courseId}/modules`);
    return response.data;
  }

  async createModule(courseId: string, title: string, description: string): Promise<CourseModule> {
    const response = await apiClient.post(`/professor/courses/${courseId}/modules`, { title, description });
    return response.data;
  }

  async getQuizzes(courseId: string): Promise<CourseQuiz[]> {
    const response = await apiClient.get(`/professor/courses/${courseId}/quizzes`);
    return response.data;
  }

  async createQuiz(moduleId: string, title: string, description: string, questions: QuizQuestion[]): Promise<CourseQuiz> {
    const response = await apiClient.post(`/professor/modules/${moduleId}/quizzes`, { title, description, questions });
    return response.data;
  }
}
