export interface DbSchema {
  studentProfile?: {
    name?: string;
    matricule?: string;
    promotion?: string;
    filiere?: string;
    faculte?: string;
    average?: number;
    gpa?: number;
    mood?: string;
  };
  attendances?: Array<{
    id: string;
    timestamp: string;
    type: string;
    method: string;
    status: string;
    salle: string;
    location: string;
  }>;
  homeworks?: Array<{
    id: string;
    titre: string;
    cours: string;
    coursLabel: string;
    desc: string;
    prio: string;
    statut: string;
    deadlineStr: string;
    submittedFiles?: string[];
    comments?: string;
    note?: string;
    progress?: number;
  }>;
  liveSessions?: Array<{
    id: string;
    courseName: string;
    teacherName: string;
    title: string;
    startTime: string;
    endTime: string;
    status: string;
    attendeesCount: number;
    thumbnail: string;
    hlsUrl: string;
    reactions?: Record<string, number>;
    chatMessages?: Array<{
      id: string;
      user: string;
      text: string;
      timestamp: string;
      isTeacher: boolean;
    }>;
  }>;
  courses?: Array<{
    id: string;
    titre: string;
    coefficient: number;
    progress: number;
    unites: string[];
    professeur: string;
    prochain_cours: string;
  }>;
}
