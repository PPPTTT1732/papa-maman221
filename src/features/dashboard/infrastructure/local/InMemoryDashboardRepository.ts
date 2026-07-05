import { DashboardRepository } from '../../domain/DashboardRepository';
import { DashboardData, Attendance, LiveSession } from '../../domain/Dashboard';

export class InMemoryDashboardRepository implements DashboardRepository {
  private attendances: Attendance[] = [];
  private liveSessions: LiveSession[] = [
    {
      id: "live-1",
      courseName: "Architecture Microservices",
      teacherName: "Dr. Aly Diatta",
      title: "Introduction aux patterns CQRS",
      status: "En cours",
      attendeesCount: 42,
      reactions: { '👍': 12, '💡': 5 },
      chatMessages: [
        { id: "1", user: "Dr. Aly Diatta", text: "Bienvenue à tous dans cette session.", timestamp: "14:00", isTeacher: true }
      ]
    }
  ];

  async getDashboardData(): Promise<DashboardData> {
    await new Promise(r => setTimeout(r, 400));
    return {
      profile: {
        id: "usr-1",
        name: "Abdoulaye Diallo",
        matricule: "SN-2026-8492",
        promotion: "M1 Architecture Logicielle",
        gpa: "3.8/4.0"
      },
      attendances: this.attendances,
      liveSessions: this.liveSessions
    };
  }

  async registerClockIn(type: string, method: string): Promise<Attendance> {
    await new Promise(r => setTimeout(r, 300));
    const newAtt: Attendance = {
      id: "att-" + Date.now(),
      timestamp: new Date().toISOString(),
      type,
      method,
      status: "Validé",
      salle: "Amphi A (École 221)",
      location: "Campus Dakar Plateau"
    };
    this.attendances = [newAtt, ...this.attendances];
    return newAtt;
  }

  async sendLiveReaction(sessionId: string, type: string): Promise<Record<string, number>> {
    const session = this.liveSessions.find(s => s.id === sessionId);
    if (!session) throw new Error("Session not found");
    const newReactions = { ...session.reactions, [type]: (session.reactions[type] || 0) + 1 };
    this.liveSessions = this.liveSessions.map((item) =>
      item.id === sessionId ? { ...item, reactions: newReactions } : item
    );
    return newReactions;
  }

  async sendLiveChat(sessionId: string, user: string, text: string): Promise<LiveSession> {
    const session = this.liveSessions.find(s => s.id === sessionId);
    if (!session) throw new Error("Session not found");
    const newMsg = {
      id: "msg-" + Date.now(),
      user,
      text,
      timestamp: new Date().toLocaleTimeString().substring(0, 5),
      isTeacher: false
    };
    const updatedSession = { ...session, chatMessages: [...session.chatMessages, newMsg] };
    this.liveSessions = this.liveSessions.map((item) =>
      item.id === sessionId ? updatedSession : item
    );
    return updatedSession;
  }
}
