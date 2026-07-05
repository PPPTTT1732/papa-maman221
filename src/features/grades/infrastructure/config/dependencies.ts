import { InMemoryGradeRepository } from '../local/InMemoryGradeRepository';
import { ApiGradeRepository } from '../api/ApiGradeRepository';
import { createGetStudentGradesUseCase } from '../../usecases/GetStudentGradesUseCase';

// On force le Mock en dev (comme pour Auth) pour l'instant
const isMock = import.meta.env.VITE_USE_MOCK === 'true' || true;

export const gradeRepository = isMock 
  ? new InMemoryGradeRepository() 
  : new ApiGradeRepository();

export const getStudentGradesUseCase = createGetStudentGradesUseCase(gradeRepository);
