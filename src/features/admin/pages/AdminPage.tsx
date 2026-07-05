import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/core/store/authStore';
import { ROUTES } from '@/shared/constants';
import { IconButton } from '@/shared/components';

export function AdminPage() {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const navigate = useNavigate();
  const { deconnexion } = useAuthStore();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-4');
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* TopAppBar */}
      <header className="bg-surface docked full-width top-0 sticky z-40 border-b border-neutral-gray-200 flat no shadows">
        <div className="flex justify-between items-center px-margin-mobile h-16 w-full mx-auto">
          <div className="flex items-center gap-3">
            <img
              alt="Ecole 221 Logo"
              className="h-10 w-10 object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuATOYzVUJC7e-ftTE3lXovvVvRsqHHNIhIP8N0bYAlcl5I9wc4wZieBeLSgkAtekpfHAYpMhxIa--gptb4_ZxpWd3ASeAdcpP_qpDrpO4nP2JkJIgosmzLuiGVXktceJxPhEtgMsZR-c_s5iruzviVbSlXDr6TrcW_gGdmUzWynAC6Zq-pdSXA1JAqg8IG_N4D4HAZoaQ82t3xETLWbA7hX9Gnd5mLdfidA4Ba6BeD-xvZSUi-OCy37myHKNc8Qo6GRQkUQgXCirQw"
            />
            <h1 className="font-headline-md text-headline-md font-bold text-primary">Administration</h1>
          </div>
          <div className="flex items-center gap-4">
            <IconButton
              icon="search"
              ariaLabel="Rechercher"
              variant="ghost"
              className="text-secondary"
            />
            <IconButton
              icon="logout"
              ariaLabel="Se déconnecter"
              variant="surface"
              size="sm"
              onClick={() => {
                deconnexion();
                localStorage.removeItem('access_token');
                navigate(ROUTES.login);
              }}
              className="overflow-hidden"
            >
              <img
                className="w-full h-full object-cover rounded-full"
                alt="Profile"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4dt9q-_JwD0ebafQftj81ipJioOU16x6oh9HIEkvBsgDg1ztWmKciopiMA-cHPNZNN0W60yDxucz7ZUE7ZcvQePMrdK07TEfq8JD1gq0aZdmmKYp1N8TAHu91YWPbvRT4YhyAt3DYlo-_PIY5bkn2rPxhPeEEuOMXZkOphzsfoJIlk_kLK7FGUXTG06Wddd4bSW0spzJzL3fztcQE-ANhN9CX7RuVEKZC2kTeIAd_NeklCv2UFF9Cx16UN59yu40ee7S__-pYCCY"
              />
            </IconButton>
          </div>
        </div>
      </header>

      <main className="pb-24 pt-6 px-margin-mobile max-w-max-width mx-auto">
        {/* Welcome Section */}
        <section
          ref={(el) => { sectionsRef.current[0] = el; }}
          className="mb-8 transition-all duration-700 opacity-0 translate-y-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-secondary font-label-md text-label-md uppercase tracking-wider">Dashboard</span>
            <div className="h-px flex-grow bg-outline-variant"></div>
          </div>
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Bonjour, Admin</h2>
          <p className="text-on-surface-variant font-body-md text-body-md mt-1">Aujourd'hui est le lundi 24 Mai 2024. Voici un aperçu global de l'établissement.</p>
        </section>

        {/* Statistics Bento Grid */}
        <section
          ref={(el) => { sectionsRef.current[1] = el; }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 transition-all duration-700 opacity-0 translate-y-4"
        >
          <div className="col-span-2 md:col-span-2 glass-card p-5 rounded-xl border border-neutral-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <span translate="no" className="material-symbols-outlined text-primary mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
                school
              </span>
              <h3 className="font-title-lg text-title-lg text-on-surface">Classes actives</h3>
            </div>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-4xl font-bold text-primary">24</span>
              <span className="text-success-green font-label-md text-label-md flex items-center">
                <span translate="no" className="material-symbols-outlined text-[16px]">trending_up</span> +2
              </span>
            </div>
          </div>

          <div className="col-span-1 md:col-span-1 glass-card p-4 rounded-xl border border-neutral-gray-200 shadow-sm">
            <span translate="no" className="material-symbols-outlined text-primary mb-2">person_check</span>
            <h3 className="font-label-md text-label-md text-secondary uppercase tracking-tight">Professeurs présents</h3>
            <p className="text-2xl font-bold text-on-surface mt-1">18 / 20</p>
          </div>

          <div className="col-span-1 md:col-span-1 glass-card p-4 rounded-xl border border-neutral-gray-200 shadow-sm">
            <span translate="no" className="material-symbols-outlined text-primary mb-2">meeting_room</span>
            <h3 className="font-label-md text-label-md text-secondary uppercase tracking-tight">Salles occupées</h3>
            <p className="text-2xl font-bold text-on-surface mt-1">85%</p>
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section
          ref={(el) => { sectionsRef.current[2] = el; }}
          className="mb-8 transition-all duration-700 opacity-0 translate-y-4"
        >
          <h3 className="font-title-lg text-title-lg mb-4">Actions Rapides</h3>
          <div className="grid grid-cols-3 gap-3">
            <button className="flex flex-col items-center justify-center p-4 bg-white border border-neutral-gray-200 rounded-xl hover:bg-brand-red-light transition-colors active:scale-95">
              <div className="w-12 h-12 rounded-full bg-brand-red-light flex items-center justify-center mb-2">
                <span translate="no" className="material-symbols-outlined text-primary">group</span>
              </div>
              <span className="text-[10px] font-semibold text-center uppercase text-on-surface">Gérer les utilisateurs</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-white border border-neutral-gray-200 rounded-xl hover:bg-brand-red-light transition-colors active:scale-95">
              <div className="w-12 h-12 rounded-full bg-brand-red-light flex items-center justify-center mb-2">
                <span translate="no" className="material-symbols-outlined text-primary">calendar_month</span>
              </div>
              <span className="text-[10px] font-semibold text-center uppercase text-on-surface">Éditer Planning</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-white border border-neutral-gray-200 rounded-xl hover:bg-brand-red-light transition-colors active:scale-95">
              <div className="w-12 h-12 rounded-full bg-brand-red-light flex items-center justify-center mb-2">
                <span translate="no" className="material-symbols-outlined text-primary">campaign</span>
              </div>
              <span className="text-[10px] font-semibold text-center uppercase text-on-surface">Alertes Globales</span>
            </button>
          </div>
        </section>

        {/* Recent Activities */}
        <section
          ref={(el) => { sectionsRef.current[3] = el; }}
          className="mb-8 transition-all duration-700 opacity-0 translate-y-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-title-lg text-title-lg">Activités récentes</h3>
            <button className="text-primary font-label-md text-label-md hover:underline">[ Voir Plus ]</button>
          </div>
          <div className="space-y-3">
            <div className="flex gap-4 p-4 bg-white rounded-xl border border-neutral-gray-200 items-start">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                <span translate="no" className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'opsz' 20" }}>info</span>
              </div>
              <div>
                <p className="font-body-md text-body-md text-on-surface"><span className="font-semibold">M. Sylla</span> a mis à jour l'emploi du temps de la L3 GTL.</p>
                <p className="text-label-md text-secondary mt-1">Il y a 15 minutes • Système</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-white rounded-xl border border-neutral-gray-200 items-start">
              <div className="w-10 h-10 rounded-lg bg-brand-red-light flex items-center justify-center shrink-0">
                <span translate="no" className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'opsz' 20" }}>person_add</span>
              </div>
              <div>
                <p className="font-body-md text-body-md text-on-surface">5 nouveaux étudiants admis en <span className="font-semibold">Master 1 RI</span>.</p>
                <p className="text-label-md text-secondary mt-1">Il y a 2 heures • Inscriptions</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-white rounded-xl border border-neutral-gray-200 items-start">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                <span translate="no" className="material-symbols-outlined text-orange-600" style={{ fontVariationSettings: "'opsz' 20" }}>warning</span>
              </div>
              <div>
                <p className="font-body-md text-body-md text-on-surface">Alerte : Maintenance serveur prévue à 22:00.</p>
                <p className="text-label-md text-secondary mt-1">Il y a 4 heures • IT Admin</p>
              </div>
            </div>
          </div>
        </section>

        {/* Status Card with Image background effect */}
        <section
          ref={(el) => { sectionsRef.current[4] = el; }}
          className="mb-8 transition-all duration-700 opacity-0 translate-y-4"
        >
          <div className="relative h-40 rounded-xl overflow-hidden border border-outline-variant flex items-center px-6">
            <div className="absolute inset-0 z-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDkA7iYFrOLxy4akOeM5oUu8gfUV28gqtinPVbUC3BqemNLMiuXGAyrBrx2LpAqa92jHMTvzqQz-_NahWM8p9v-JIfnxtpG-TsuXKC1zEzvR3CqL1hCPFpy-tLZS8Ok21KRvdzLbJRkRdzWr-J5bQW2T2Gj7dbQnLIxWGpN1_hvN9qHz2nOOIqorysGs71pQ1ewFwwsUaVNYx0A-zNrnRJ82Kqy5VC_HYhdAJk1KxQklC-loLeQz0kqjIdX_tnr9LWqdceYPsEGShA')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-transparent opacity-5 z-0"></div>
            <div className="relative z-10">
              <h4 className="font-headline-md text-headline-md text-on-surface">Rapport de Mai</h4>
              <p className="text-on-surface-variant font-body-md text-body-md">Téléchargez le rapport de performance mensuel.</p>
              <button className="mt-4 px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-sm active:scale-95 transition-transform">Télécharger PDF</button>
            </div>
          </div>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-surface border-t border-neutral-gray-200 shadow-sm">
        <a className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 active-nav-pill transition-transform active:scale-90" href="#">
          <span translate="no" className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="font-label-md text-label-md">Accueil</span>
        </a>
        <a className="flex flex-col items-center justify-center text-secondary hover:text-primary transition-all active:scale-90" href="#">
          <span translate="no" className="material-symbols-outlined">event_note</span>
          <span className="font-label-md text-label-md">Planning</span>
        </a>
        <a className="flex flex-col items-center justify-center text-secondary hover:text-primary transition-all active:scale-90" href="#">
          <span translate="no" className="material-symbols-outlined">person</span>
          <span className="font-label-md text-label-md">Membres</span>
        </a>
        <a className="flex flex-col items-center justify-center text-secondary hover:text-primary transition-all active:scale-90 relative" href="#">
          <span translate="no" className="material-symbols-outlined">notifications_active</span>
          <span className="absolute top-0 right-1 w-2 h-2 bg-primary rounded-full border-2 border-surface"></span>
          <span className="font-label-md text-label-md">Alertes</span>
        </a>
      </nav>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-6 z-50">
        <button className="w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform float-animation">
          <span translate="no" className="material-symbols-outlined text-[28px]">add</span>
        </button>
      </div>
    </>
  );
}
