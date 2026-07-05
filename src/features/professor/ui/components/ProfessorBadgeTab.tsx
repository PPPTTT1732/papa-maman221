import React from 'react';

interface Props {
  readonly profName: string;
}

export function ProfessorBadgeTab({ profName }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-[10.5px] text-neutral-500 leading-relaxed font-semibold">
        Présentez ce QR Code pour valider votre présence en salle de classe ou ouvrir la session d'examen.
      </p>
      
      <div className="bg-[#FAF9F7] border border-neutral-200 rounded-2xl p-4 flex flex-col items-center">
        <div className="w-full flex justify-between items-center text-left border-b border-neutral-200 pb-2.5 mb-3">
          <div>
            <h5 className="text-[8px] font-black text-brand-red-deep uppercase tracking-wider">ÉCOLE 221 - ENSEIGNANT</h5>
            <p className="text-[11px] font-black text-neutral-800 mt-0.5">{profName}</p>
          </div>
          <span className="text-[8px] bg-red-100 text-brand-red-deep px-1.5 py-0.5 rounded font-black tracking-wide uppercase">
            PROFESSEUR
          </span>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-neutral-200/60 shadow-3xs relative overflow-hidden group">
          <div className="w-24 h-24 relative flex items-center justify-center bg-white rounded-lg">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=221-PROF-${profName.replace(/\s+/g, '-')}&color=1b1c1e&margin=4`} 
              alt="QR Code Enseignant"
              className="w-20 h-20 object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="absolute left-0 right-0 h-0.5 bg-brand-red-deep opacity-80 shadow-xs top-1/2 -translate-y-1/2"></div>
            <div className="absolute inset-x-0 h-0.5 bg-brand-red-deep/30 top-1 animate-[bounce_3s_infinite]"></div>
          </div>
        </div>

        <p className="mt-3 font-mono text-[8px] text-neutral-500 font-black tracking-wider uppercase bg-white/70 px-2 py-0.5 rounded border border-neutral-200/20 shadow-3xs">
          ID ENSEIGNANT : E221-PROF-981
        </p>
      </div>
    </div>
  );
}
