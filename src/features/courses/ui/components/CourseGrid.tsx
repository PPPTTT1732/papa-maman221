import React from 'react';
import { CoursItem } from './types';

interface CourseGridProps {
  coursFiltrés: CoursItem[];
  setActiveDetailCourse: (cours: CoursItem) => void;
}

export function CourseGrid({ coursFiltrés, setActiveDetailCourse }: CourseGridProps) {
  if (coursFiltrés.length === 0) {
    return (
      <div className="text-center py-12 px-6 bg-white/80 border border-neutral-gray-200 rounded-3xl space-y-3">
        <span translate="no" className="material-symbols-outlined text-neutral-gray-400 text-5xl">folder_off</span>
        <p className="font-bold text-on-surface">Aucun cours ne correspond à vos critères.</p>
        <p className="text-xs text-neutral-gray-500">Essayez de modifier votre recherche ou de réinitialiser les filtres.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {coursFiltrés.map((cours) => (
        <div 
          key={cours.id}
          onClick={() => setActiveDetailCourse(cours)}
          className="bg-white border border-neutral-gray-200 rounded-3xl overflow-hidden group hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(41,23,21,0.06)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
          <div className="relative h-44 overflow-hidden shrink-0 select-none">
            <img 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.05]" 
              src={cours.image} 
              alt={cours.nom} 
            />
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 font-black text-[9px] uppercase tracking-wider rounded-lg text-white shadow-xs ${
                cours.statut === 'en_cours' 
                  ? 'bg-brand-red-deep' 
                  : cours.statut === 'termine' 
                    ? 'bg-success-green' 
                    : 'bg-neutral-gray-600'
              }`}>
                {cours.statut === 'en_cours' ? 'En Cours' : cours.statut === 'termine' ? 'Terminé' : 'Non démarré'}
              </span>
            </div>

            <div className="absolute top-4 right-4 bg-black/45 backdrop-blur-xs text-white px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider">
              {cours.categorie === 'Informatique & Dév' ? '💻 TECH' : cours.categorie === 'Management & Business' ? '📈 BIZ' : '⭐ SOFT'}
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="font-title-lg text-[16px] font-black text-on-surface leading-snug group-hover:text-brand-red-deep transition-colors line-clamp-2">
                  {cours.nom}
                </h3>
                {cours.statut === 'termine' && (
                  <span translate="no" className="material-symbols-outlined text-success-green font-bold text-[18px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                )}
              </div>
              
              <p className="text-xs text-neutral-gray-600 line-clamp-2 font-medium">
                {cours.description}
              </p>
            </div>

            <div className="space-y-3.5 pt-3.5 border-t border-neutral-gray-100">
              
              {cours.progression > 0 && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-neutral-gray-500">Progression</span>
                    <span className="text-on-surface">{cours.progression}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-gray-150 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-red-deep rounded-full group-hover:opacity-90" style={{ width: `${cours.progression}%` }}></div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-2">
                
                {cours.statut === 'termine' ? (
                  <div className="text-[11px] font-black text-success-green flex items-center gap-1">
                    <span translate="no" className="material-symbols-outlined text-[14px]">stars</span>
                    Note: {cours.noteFinale}
                  </div>
                ) : cours.statut === 'non_demarre' && cours.avis ? (
                  <div className="flex items-center gap-1 text-[11px] text-neutral-gray-500 font-bold">
                    <span translate="no" className="material-symbols-outlined text-amber-500 text-[14px] fill-amber-500">star</span>
                    {cours.avis}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-bold truncate">
                    <span translate="no" className="material-symbols-outlined text-[14px] text-brand-red-deep">person</span>
                    {cours.professeur}
                  </div>
                )}

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDetailCourse(cours);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-[11px] font-black transition-all flex items-center gap-1 select-none cursor-pointer ${
                    cours.statut === 'termine' 
                      ? 'bg-success-green/10 text-success-green hover:bg-success-green/20' 
                      : cours.statut === 'non_demarre'
                        ? 'bg-brand-red-deep text-white hover:bg-brand-red-deep/90 shadow-sm shadow-[#B3181C]/10'
                        : 'bg-brand-red-light/70 text-brand-red-deep hover:bg-brand-red-deep hover:text-white'
                  }`}
                >
                  Details
                  <span translate="no" className="material-symbols-outlined text-[12px] font-black">arrow_forward_ios</span>
                </button>

              </div>

            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
