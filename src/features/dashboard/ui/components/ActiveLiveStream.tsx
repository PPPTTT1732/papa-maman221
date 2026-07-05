import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { LiveSession } from '@/features/student/types';
import { ActiveLiveChat } from './ActiveLiveChat';
import { LiveSlideViewer } from './LiveSlideViewer';
import { RealTimeMeetRoom } from './RealTimeMeetRoom';

interface ActiveLiveStreamProps {
  selectedLive: LiveSession;
  onQuit: () => void;
  sendLiveReaction: (type: string) => void;
  chatInput: string;
  setChatInput: (val: string) => void;
  onSendChat: (e: React.FormEvent) => void;
  triggerToast: (msg: string) => void;
}

export function ActiveLiveStream({
  selectedLive,
  onQuit,
  sendLiveReaction,
  chatInput,
  setChatInput,
  onSendChat,
  triggerToast
}: ActiveLiveStreamProps) {
  // Toggle between 'slides' (diapositives) and 'meet' (visioconférence)
  const [mode, setMode] = useState<'slides' | 'meet'>('slides');

  return (
    <div className="bg-white border border-neutral-gray-200 rounded-3xl overflow-hidden shadow-xl mb-8 flex flex-col md:grid md:grid-cols-12 max-h-[85vh] md:max-h-[640px] animate-scale-up">
      {/* Column 1: Core Stream Player and interactions */}
      <div className="md:col-span-8 bg-neutral-950 flex flex-col justify-between text-white relative">
        
        {mode === 'meet' ? (
          <RealTimeMeetRoom 
            selectedLive={selectedLive}
            onLeave={() => setMode('slides')}
            triggerToast={triggerToast}
          />
        ) : (
          <>
            <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent p-4 z-10 flex justify-between items-start">
              <div>
                <span className="bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-widest w-fit animate-pulse shadow-sm shadow-red-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  EN DIRECT • AMPHI A
                </span>
                <h4 className="text-sm font-black text-white leading-tight mt-1 truncate max-w-[340px]">{selectedLive.title}</h4>
                <p className="text-[10px] text-white/70 font-heavy">{selectedLive.courseName} • Enseigné par {selectedLive.teacherName}</p>
              </div>
              <button 
                onClick={onQuit}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-xl text-white font-bold transition-colors cursor-pointer flex items-center gap-1 text-xs"
              >
                <Icon icon="lucide:arrow-left" className="h-4 w-4" /> Quitter
              </button>
            </div>

            {/* Presentation Board */}
            <div className="flex-grow flex items-center justify-center p-8 min-h-[250px] relative overflow-hidden bg-gradient-to-br from-neutral-900 to-[#1e1010]">
              <LiveSlideViewer />

              <div className="absolute bottom-4 right-4 w-28 sm:w-36 h-20 sm:h-24 rounded-xl bg-neutral-900 border border-white/20 shadow-2xl overflow-hidden z-25 flex flex-col">
                <img referrerPolicy="no-referrer" src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop" className="w-full h-2/3 object-cover opacity-85" alt="Vidéo du Professeur" />
                <div className="p-1 bg-neutral-900 text-[8px] font-black text-white border-t border-white/10 flex justify-between items-center px-1.5">
                  <span className="truncate">Dr. Cheikh Bamba</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                </div>
              </div>
            </div>

            {/* Stream Controls Reactions */}
            <div className="bg-neutral-950 p-4 border-t border-white/10 flex items-center justify-between z-10">
              <div className="flex items-center gap-1.5">
                {(['heart', 'clap', 'like', 'mindblown'] as const).map((rx) => {
                  const icons: Record<string, string> = { heart: '❤️', clap: '👏', like: '👍', mindblown: '🧠' };
                  return (
                    <button 
                      key={rx} 
                      onClick={() => sendLiveReaction(rx)}
                      className="bg-white/5 hover:bg-white/15 px-2.5 py-1.5 rounded-xl cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
                    >
                      <span className="text-sm">{icons[rx]}</span>
                      <span className="font-mono text-[9px] font-bold text-neutral-300">{selectedLive.reactions?.[rx] || 0}</span>
                    </button>
                  );
                })}
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setMode('meet');
                    triggerToast("Rejoindre la salle de réunion...");
                  }}
                  className="bg-brand-red-deep hover:bg-[#961215] text-white text-[11px] font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-brand-red-deep/20 cursor-pointer hover:scale-102 active:scale-98 transition-all animate-pulse"
                >
                  <Icon icon="lucide:video" className="h-4 w-4" />
                  <span>Rejoindre le Meet</span>
                </button>

                <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1.5 rounded-xl">
                  <Icon icon="lucide:users" className="h-3.5 w-3.5 text-emerald-450" />
                  <span className="font-mono text-[9px] font-heavy whitespace-nowrap text-secondary">{selectedLive.attendeesCount + 11} Connectés</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <ActiveLiveChat 
        selectedLive={selectedLive}
        chatInput={chatInput}
        setChatInput={setChatInput}
        onSendChat={onSendChat}
      />
    </div>
  );
}
export default ActiveLiveStream;
