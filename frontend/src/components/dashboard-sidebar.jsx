import { useState } from "react";

const sections = [
  { id: "overview", label: "Accueil", icon: "🏠" },
  { id: "projects", label: "Mes Projets", icon: "📁" },
  { id: "media", label: "Médias", icon: "🖼️" },
  { id: "stats", label: "Statistiques", icon: "📊" },
  { id: "profile", label: "Profil", icon: "👤" },
  { id: "support", label: "Support", icon: "❓" },
];

export default function DashboardSidebar({ activeSection, onSectionChange, user, onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setOpen(false)}></div>
      )}
      <aside className={`fixed z-50 top-0 left-0 h-full w-64 bg-white border-r border-slate-200 shadow-lg transform transition-transform duration-300 md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} md:static md:block`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <span className="text-xl font-bold text-slate-900">Dashboard</span>
            <button className="md:hidden p-2" onClick={() => setOpen(false)}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          {/* User */}
          {user && (
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-lg font-bold text-slate-700">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <div className="font-semibold text-slate-800 text-sm">{user.name}</div>
                <div className="text-xs text-slate-500">{user.email}</div>
              </div>
            </div>
          )}
          {/* Navigation */}
          <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => { onSectionChange(section.id); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left font-medium transition-colors duration-200 ${
                  activeSection === section.id
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </nav>
          {/* Footer */}
          <div className="mt-auto px-6 py-4 border-t border-slate-100">
            <button
              onClick={onLogout}
              className="w-full bg-slate-800 hover:bg-black text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Déconnexion
            </button>
            <div className="mt-3 text-xs text-slate-400 text-center">
              &copy; {new Date().getFullYear()} Forgeron du Web
            </div>
          </div>
        </div>
      </aside>
      {/* Bouton burger mobile */}
      <button
        className="fixed z-50 top-4 left-4 md:hidden bg-slate-800 text-white p-2 rounded-lg shadow-lg"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le menu dashboard"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16"/><path d="M4 18h16"/><path d="M4 6h16"/></svg>
      </button>
    </>
  );
}
