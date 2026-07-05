import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { PresenceModal } from '../components/PresenceModal';
import { ActiveLiveStream } from '../components/ActiveLiveStream';
import { WeeklySchedule } from '../components/WeeklySchedule';
import { RecentAcademicPerformance } from '../components/RecentAcademicPerformance';
import { RegisteredCourses } from '../components/RegisteredCourses';
import { AITutorPanel } from '../components/AITutorPanel';
import { StudentNotificationToast } from '../components/StudentNotificationToast';
import { StudentHeaderBanner } from '../components/StudentHeaderBanner';

export function StudentDashboardPage() {
  const navigate = useNavigate();
  const {
    selectedDay, setSelectedDay, attendances,
    liveSessions, setSelectedLiveId, selectedLive, showToast, triggerToast, showPointage, setShowPointage,
    pointageType, setPointageType, pointageMethod, setPointageMethod, cameraStream, chatInput, setChatInput,
    videoRef, startCamera, stopCamera, registerClockIn, sendLiveReaction, sendLiveChat
  } = useDashboard();

  return (
    <div className="p-4 md:p-8 max-w-[1280px] mx-auto w-full flex-grow animate-fade-in relative min-h-screen pb-24">
      {showToast && <StudentNotificationToast message={showToast} />}

      <StudentHeaderBanner 
        attendancesCount={attendances.length} 
        onPointer={(type) => {
          setPointageType(type);
          setShowPointage(true);
          startCamera();
        }}
      />

      {showPointage && (
        <PresenceModal 
          pointageType={pointageType}
          pointageMethod={pointageMethod}
          setPointageMethod={setPointageMethod}
          onClose={() => { stopCamera(); setShowPointage(false); }}
          cameraStream={cameraStream}
          videoRef={videoRef}
          onRegisterClockIn={registerClockIn}
          onStartCamera={startCamera}
          onStopCamera={stopCamera}
        />
      )}

      {selectedLive && (
        <ActiveLiveStream 
          selectedLive={selectedLive}
          onQuit={() => setSelectedLiveId(null)}
          sendLiveReaction={sendLiveReaction}
          chatInput={chatInput}
          setChatInput={setChatInput}
          onSendChat={sendLiveChat}
          triggerToast={triggerToast}
        />
      )}

      <div className="grid grid-cols-12 gap-6">
        <WeeklySchedule 
          selectedDay={selectedDay} 
          setSelectedDay={setSelectedDay} 
          onSelectCourse={(course) => navigate('/etudiant/cours/' + course.id)} 
        />
        <RecentAcademicPerformance />
        <AITutorPanel />
        <RegisteredCourses 
          liveSessions={liveSessions} 
          onSelectLive={(id) => {
            setSelectedLiveId(id);
            triggerToast("Redirection vers la classe virtuelle !");
          }} 
        />
      </div>
    </div>
  );
}
export default StudentDashboardPage;
