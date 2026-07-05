import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import type { StudentEnrolled } from '../../domain/ProfessorModels';
import type { AttendanceStatus } from '../../domain/ProfessorAttendance';
import { ProfessorBadgeTab } from './ProfessorBadgeTab';
import { ProfessorScannerTab } from './ProfessorScannerTab';

interface Props {
  readonly profName: string;
  readonly students: readonly StudentEnrolled[];
  readonly onClose: () => void;
  readonly onMarkAttendance: (studentId: string, status: AttendanceStatus) => void;
}

export function ProfessorPresenceModal({ profName, onClose }: Props) {
  const [tab, setTab] = useState<'badge' | 'scanner'>('badge');

  return createPortal(
    <div className="fixed inset-0 z-[250] bg-black/65 flex items-center justify-center p-4 backdrop-blur-sm font-sans">
      <div className="bg-white w-full max-w-[350px] rounded-3xl overflow-hidden shadow-2xl border border-neutral-gray-200 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="bg-gradient-to-br from-[#B3181C] to-[#291715] px-5 py-4 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 text-white/80 hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer border-none bg-transparent"
          >
            <Icon icon="lucide:x" className="h-5 w-5" />
          </button>
          <p className="text-[9px] font-black uppercase tracking-widest text-white/60 mb-0.5">Portail Enseignant</p>
          <h3 className="font-black text-base leading-tight">Authentification & Pointage</h3>
        </div>

        <div className="flex border-b border-neutral-150 bg-neutral-50 p-1 gap-1">
          <button
            onClick={() => setTab('badge')}
            className={`flex-1 py-2 text-center text-[11px] font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border-0 ${
              tab === 'badge' ? 'bg-white text-brand-red-deep shadow-sm' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Icon icon="lucide:qr-code" className="h-4 w-4" />
            Le Vigile me scanne
          </button>
          <button
            onClick={() => setTab('scanner')}
            className={`flex-1 py-2 text-center text-[11px] font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border-0 ${
              tab === 'scanner' ? 'bg-white text-brand-red-deep shadow-sm' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Icon icon="lucide:scan" className="h-4 w-4" />
            Je scanne le Vigile
          </button>
        </div>

        <div className="p-5 text-center space-y-4">
          {tab === 'badge' ? (
            <ProfessorBadgeTab profName={profName} />
          ) : (
            <ProfessorScannerTab profName={profName} />
          )}

          <button 
            onClick={onClose}
            className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-black text-xs rounded-xl transition-all cursor-pointer border-0 mt-2"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
