import { useState, useEffect } from "react";
import { 
  SiReact, 
  SiNextdotjs, 
  SiNodedotjs, 
  SiMongodb, 
  SiTailwindcss, 
  SiTypescript, 
  SiJavascript, 
  SiHtml5, 
  SiCss3, 
  SiPhp, 
  SiMysql,
  SiWordpress,
  SiFigma,
  SiAdobexd,
  SiGit,
  SiDocker,
  SiFirebase,
  SiVuedotjs,
  SiAngular,
  SiLaravel,
  SiGithub,
  SiSass
} from "react-icons/si";

const portfolioItems = [
  {
    image: "/img_1.jpg",
    title: "Site E-commerce Moderne",
    category: "Boutique en ligne",
    type: "premium",
    alt: "Site e-commerce avec design moderne",
    technologies: [
      { name: "React", shortName: "React", icon: SiReact, color: "text-blue-500" },
      { name: "Tailwind", shortName: "CSS", icon: SiTailwindcss, color: "text-cyan-500" },
      { name: "Node.js", shortName: "Node", icon: SiNodedotjs, color: "text-green-600" }
    ]
  },
  {
    image: "/img_2.jpg",
    title: "Portfolio Créatif",
    category: "Site vitrine",
    type: "free",
    alt: "Portfolio avec animations créatives",
    technologies: [
      { name: "Vue.js", shortName: "Vue", icon: SiVuedotjs, color: "text-emerald-500" },
      { name: "GSAP", shortName: "GSAP", icon: SiGithub, color: "text-purple-600" },
      { name: "SCSS", shortName: "SCSS", icon: SiSass, color: "text-pink-500" }
    ]
  },
  {
    image: "/img_3.jpg",
    title: "Application Web Responsive",
    category: "Application métier",
    type: "premium",
    alt: "Application web responsive moderne",
    technologies: [
      { name: "Next.js", shortName: "Next", icon: SiNextdotjs, color: "text-gray-800" },
      { name: "TypeScript", shortName: "TS", icon: SiTypescript, color: "text-blue-600" },
      { name: "MongoDB", shortName: "Mongo", icon: SiMongodb, color: "text-green-500" }
    ]
  },
  {
    image: "/img_1.jpg",
    title: "Blog Technologique",
    category: "Blog",
    type: "free",
    alt: "Blog avec système de gestion de contenu",
    technologies: [
      { name: "React", shortName: "React", icon: SiReact, color: "text-blue-500" },
      { name: "Node.js", shortName: "Node", icon: SiNodedotjs, color: "text-green-600" },
      { name: "MySQL", shortName: "MySQL", icon: SiMysql, color: "text-blue-600" }
    ]
  },
  {
    image: "/img_2.jpg",
    title: "Dashboard Analytics",
    category: "Dashboard",
    type: "premium",
    alt: "Tableau de bord interactif",
    technologies: [
      { name: "Vue.js", shortName: "Vue", icon: SiVuedotjs, color: "text-green-500" },
      { name: "Firebase", shortName: "Fire", icon: SiFirebase, color: "text-orange-500" },
      { name: "Chart.js", shortName: "Chart", icon: SiJavascript, color: "text-yellow-500" }
    ]
  },
  {
    image: "/img_3.jpg",
    title: "Application Mobile Web",
    category: "Mobile",
    type: "free",
    alt: "Application web progressive",
    technologies: [
      { name: "React", shortName: "React", icon: SiReact, color: "text-blue-500" },
      { name: "PWA", shortName: "PWA", icon: SiJavascript, color: "text-yellow-500" },
      { name: "Firebase", shortName: "Fire", icon: SiFirebase, color: "text-orange-500" }
    ]
  },
  {
    image: "/img_1.jpg",
    title: "Site Vitrine Entreprise",
    category: "Site vitrine",
    type: "free",
    alt: "Site vitrine professionnel pour entreprise",
    technologies: [
      { name: "HTML5", shortName: "HTML", icon: SiHtml5, color: "text-orange-500" },
      { name: "CSS3", shortName: "CSS", icon: SiCss3, color: "text-blue-500" },
      { name: "JavaScript", shortName: "JS", icon: SiJavascript, color: "text-yellow-500" }
    ]
  },
  {
    image: "/img_2.jpg",
    title: "Landing Page Marketing",
    category: "Marketing",
    type: "free",
    alt: "Page d'atterrissage optimisée conversion",
    technologies: [
      { name: "React", shortName: "React", icon: SiReact, color: "text-blue-500" },
      { name: "Tailwind", shortName: "CSS", icon: SiTailwindcss, color: "text-cyan-500" },
      { name: "Framer Motion", shortName: "Motion", icon: SiGithub, color: "text-purple-600" }
    ]
  },
  {
    image: "/img_3.jpg",
    title: "Site Portfolio Artiste",
    category: "Portfolio",
    type: "free",
    alt: "Portfolio artistique avec galerie",
    technologies: [
      { name: "Vue.js", shortName: "Vue", icon: SiVuedotjs, color: "text-emerald-500" },
      { name: "SCSS", shortName: "SCSS", icon: SiSass, color: "text-pink-500" },
      { name: "GSAP", shortName: "GSAP", icon: SiGithub, color: "text-purple-600" }
    ]
  }
];

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState("free");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Écouter l'événement de déconnexion
    const handleLogout = () => setUser(null);
    window.addEventListener('logout', handleLogout);
    return () => window.removeEventListener('logout', handleLogout);
  }, []);

  const filteredItems = portfolioItems.filter(item => item.type === activeTab);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Mes Réalisations
            </h1>
            <p className="text-lg text-slate-600 mb-0">
              Découvrez une sélection de mes projets web, du design à la mise en production
            </p>
            {user && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  🎉 Bienvenue {user.name} ! Vous avez accès au contenu premium.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Onglets Free et Premium */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-8 relative z-20">
        <div className="flex justify-center">
          <div className="flex bg-gray-100 rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab("free")}
              className={`px-8 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === "free"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Free
            </button>
            <button
              onClick={() => setActiveTab("premium")}
              className={`px-8 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === "premium"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Premium
            </button>
          </div>
        </div>
      </div>

      {/* Grille des projets */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
        <div className="max-w-6xl mx-auto min-h-[800px]">
          {activeTab === "free" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item, index) => (
                <div key={index} className="w-full group cursor-pointer bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300">
                  <div className="overflow-hidden rounded-xl aspect-video bg-gray-100 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <img 
                      className="w-full h-full object-cover transform transition duration-300 group-hover:scale-105" 
                      src={item.image} 
                      alt={item.alt}
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg text-slate-900 font-medium group-hover:text-indigo-600 transition">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-sm text-indigo-600 font-medium">{item.category}</p>
                      <div className="flex items-center gap-1.5">
                        {item.technologies.slice(0, 3).map((tech, techIndex) => {
                          const IconComponent = tech.icon;
                          return (
                            <span key={techIndex} className="flex items-center gap-1.5 px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md font-medium hover:bg-slate-100 transition-colors duration-200 min-w-[60px] justify-center">
                              <IconComponent className="w-4 h-4 flex-shrink-0" style={{ color: tech.color.replace('text-', '') === 'blue-500' ? '#3B82F6' : tech.color.replace('text-', '') === 'cyan-500' ? '#06B6D4' : tech.color.replace('text-', '') === 'green-600' ? '#059669' : tech.color.replace('text-', '') === 'emerald-500' ? '#10B981' : tech.color.replace('text-', '') === 'purple-600' ? '#9333EA' : tech.color.replace('text-', '') === 'pink-500' ? '#EC4899' : tech.color.replace('text-', '') === 'gray-800' ? '#1F2937' : tech.color.replace('text-', '') === 'blue-600' ? '#2563EB' : tech.color.replace('text-', '') === 'green-500' ? '#10B981' : tech.color.replace('text-', '') === 'orange-500' ? '#F97316' : tech.color.replace('text-', '') === 'yellow-500' ? '#EAB308' : '#6B7280' }} />
                              <span className="text-slate-700 font-medium">{tech.shortName}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative min-h-[800px]">
              {!user ? (
                // Message Premium pour utilisateurs non connectés
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center -mt-16">
                  <div className="text-center bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
                    <div className="w-20 h-20 mx-auto mb-4 bg-slate-900 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Contenu Premium
                    </h3>
                    <p className="text-slate-900 mb-4 text-sm font-medium">
                      Accessible gratuitement après inscription
                    </p>
                    <button 
                      onClick={() => {
                        const event = new CustomEvent('navigate', { detail: 'auth' });
                        window.dispatchEvent(event);
                      }}
                      className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
                    >
                      S'inscrire gratuitement
                    </button>
                  </div>
                </div>
              ) : (
                // Contenu Premium déverrouillé pour utilisateurs connectés
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {portfolioItems.filter(item => item.type === "premium").map((item, index) => (
                    <div key={index} className="w-full group cursor-pointer bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300">
                      <div className="relative">
                        <div className="overflow-hidden rounded-xl aspect-video bg-gray-100 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                          <img 
                            className="w-full h-full object-cover transform transition duration-300 group-hover:scale-105" 
                            src={item.image} 
                            alt={item.alt}
                            loading="lazy"
                          />
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded-full">
                            Premium
                          </span>
                        </div>
                      </div>
                      <div className="mt-6">
                        <h3 className="text-lg text-slate-900 font-medium group-hover:text-indigo-600 transition">
                          {item.title}
                        </h3>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-sm text-indigo-600 font-medium">{item.category}</p>
                          <div className="flex items-center gap-1.5">
                            {item.technologies.slice(0, 3).map((tech, techIndex) => {
                              const IconComponent = tech.icon;
                              return (
                                <span key={techIndex} className="flex items-center gap-1.5 px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md font-medium hover:bg-slate-100 transition-colors duration-200 min-w-[60px] justify-center">
                                  <IconComponent className="w-4 h-4 flex-shrink-0" style={{ color: tech.color.replace('text-', '') === 'blue-500' ? '#3B82F6' : tech.color.replace('text-', '') === 'cyan-500' ? '#06B6D4' : tech.color.replace('text-', '') === 'green-600' ? '#059669' : tech.color.replace('text-', '') === 'emerald-500' ? '#10B981' : tech.color.replace('text-', '') === 'purple-600' ? '#9333EA' : tech.color.replace('text-', '') === 'pink-500' ? '#EC4899' : tech.color.replace('text-', '') === 'gray-800' ? '#1F2937' : tech.color.replace('text-', '') === 'blue-600' ? '#2563EB' : tech.color.replace('text-', '') === 'green-500' ? '#10B981' : tech.color.replace('text-', '') === 'orange-500' ? '#F97316' : tech.color.replace('text-', '') === 'yellow-500' ? '#EAB308' : '#6B7280' }} />
                                  <span className="text-slate-700 font-medium">{tech.shortName}</span>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        <div className="mt-4">
                          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 text-sm">
                            Télécharger le projet
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
