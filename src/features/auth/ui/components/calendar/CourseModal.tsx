import React from 'react';
import { X, MapPin, User, FileDown, QrCode, CheckCircle, Video, ExternalLink, Notebook, Check } from 'lucide-react';

export function CourseModal({ state }: { state: any }) {
  const { selectedCourse } = state;
  if (!selectedCourse) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-zinc-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-[28px] border border-neutral-200 max-w-2xl w-full flex flex-col justify-start">
        <div className="bg-[#B3181C] text-white p-6 pb-5 relative">
          <button onClick={() => state.setSelectedCourse(null)} className="absolute top-5 right-5"><X className="h-5 w-5" /></button>
          <div className="flex justify-between items-center mb-2.5"><span className="font-extrabold uppercase text-[10.5px]">{selectedCourse.jourNom} · {selectedCourse.heure}</span><span className="bg-white/12 border text-[9px] px-3 py-0.5 rounded-full">{selectedCourse.type}</span></div>
          <h3 className="font-heading font-black text-xl">{selectedCourse.nom}</h3>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-3.5">
                <div className="bg-[#FAF8F6] p-3.5 rounded-xl border flex items-center gap-3"><MapPin className="h-4 w-4" /><span>{selectedCourse.salle}</span></div>
                <div className="bg-[#FAF8F6] p-3.5 rounded-xl border flex items-center gap-3"><User className="h-4 w-4" /><span>{selectedCourse.professeur}</span></div>
              </div>
              <div className="space-y-2"><span className="text-[10px] text-[#8E7977] font-black uppercase">Syllabus</span><p className="text-[12px] bg-[#FAF8F6] p-4 rounded-xl border">{selectedCourse.syllabus}</p></div>
              <div className="grid grid-cols-1 gap-4 pb-2">
                <button onClick={() => state.handleDownloadMaterials(selectedCourse.id)} className="w-full flex items-center justify-between p-3.5 bg-[#FAF8F6] hover:bg-[#FFF5F5] border rounded-xl text-xs font-bold text-neutral-700 hover:text-[#B3181C]">
                  <span className="flex items-center gap-1.5 text-[11.5px]"><FileDown className="h-4 w-4 text-[#B3181C]/70" /> Cours_Supports.pdf</span>
                </button>
                {state.presenceSuccess ? (
                  <div className="flex items-center gap-2 p-3.5 bg-emerald-50 text-emerald-800 rounded-xl border text-xs font-bold"><CheckCircle className="h-4 w-4" /><span>Présence validée !</span></div>
                ) : (
                  <button onClick={() => state.setShowQRModal(true)} className="w-full flex items-center justify-center gap-1.5 p-3.5 bg-[#B3181C] text-white rounded-xl text-xs font-black"><QrCode className="h-4 w-4" /> Flasher Présence</button>
                )}
              </div>
            </div>
            <div className="space-y-5">
              {selectedCourse.enCours && (
                <div className="bg-[#FFF5F5] border border-[#B3181C]/65 p-4.5 rounded-xl space-y-2.5">
                  <div className="flex items-center gap-2"><span className="text-[10.5px] font-black text-[#B3181C] uppercase">CLASSE EN DIRECT EN CE MOMENT !</span></div>
                  <button onClick={() => state.triggerToast("Connexion...")} className="w-full py-2.5 bg-[#B3181C] text-white text-[11.5px] font-black rounded-lg flex items-center justify-center gap-1.5"><Video className="h-4 w-4" /> Rejoindre l'Amphi</button>
                </div>
              )}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5"><Notebook className="h-4 w-4 text-[#B3181C]" /><span className="text-[10.5px] font-black uppercase">Notes</span></div>
                <textarea value={state.sessionNotes} onChange={(e) => { state.setSessionNotes(e.target.value); state.setIsNotesSaved(false); }} className="w-full h-[130px] p-4 text-[12.5px] bg-[#FAF8F6] border rounded-xl outline-none" />
                <div className="flex justify-end gap-2">
                  <button onClick={state.handleSaveNotes} disabled={state.isNotesSaved || !state.sessionNotes.trim()} className="px-5 py-2.5 text-[11px] font-black rounded-xl bg-[#FAF8F6] border">{state.isNotesSaved ? 'Enregistré' : 'Enregistrer'}</button>
                  <button onClick={() => state.setSelectedCourse(null)} className="px-5 py-2.5 bg-neutral-100 text-[11px] font-black rounded-xl">Fermer</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
