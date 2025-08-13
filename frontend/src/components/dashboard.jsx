import { useState } from "react";
import DashboardSidebar from "./dashboard-sidebar";
import "@fontsource/poppins";

export default function Dashboard({ user, onLogout }) {
  const [section, setSection] = useState("overview");

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <DashboardSidebar activeSection={section} onSectionChange={setSection} user={user} onLogout={onLogout} />
      {/* Main content */}
      <main className="flex-1 min-h-screen md:ml-64 pt-4 md:pt-0 transition-all duration-300">
        {/* Header mobile */}
        <div className="md:hidden h-16"></div>
        {/* Section content */}
        {section === "overview" && (
          <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Vue d’ensemble</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-2xl">📁</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Projets</p>
                    <p className="text-2xl font-bold text-slate-900">3</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-2xl">👁️</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Vues</p>
                    <p className="text-2xl font-bold text-slate-900">120</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Interactions</p>
                    <p className="text-2xl font-bold text-slate-900">15</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Résumé</h3>
              <p className="text-slate-600">Bienvenue sur votre dashboard ! Ici, vous pouvez gérer vos projets, médias, statistiques, profil et support.</p>
            </div>
          </div>
        )}
        {section === "projects" && (
          <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Mes Projets</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-slate-500">(Section à compléter : CRUD projets)</div>
          </div>
        )}
        {section === "media" && (
          <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Médias</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-slate-500">(Section à compléter : bibliothèque d’images/vidéos, upload, organisation)</div>
          </div>
        )}
        {section === "stats" && (
          <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Statistiques</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-slate-500">(Section à compléter : vues par projet, engagement, rapports)</div>
          </div>
        )}
        {section === "profile" && (
          <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Profil / Paramètres</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-slate-500">(Section à compléter : modifier profil, mot de passe, réseaux sociaux)</div>
          </div>
        )}
        {section === "support" && (
          <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Support / Aide</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-slate-500">(Section à compléter : FAQ, tutoriels, contact support)</div>
          </div>
        )}
      </main>
    </div>
  );
}
