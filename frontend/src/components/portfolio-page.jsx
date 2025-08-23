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

// Icon mapping for technology badges
const iconMapping = {
  'React': { icon: SiReact, color: '#3B82F6' },
  'Vue.js': { icon: SiVuedotjs, color: '#10B981' },
  'Angular': { icon: SiAngular, color: '#DD0031' },
  'Next.js': { icon: SiNextdotjs, color: '#000000' },
  'Node.js': { icon: SiNodedotjs, color: '#059669' },
  'Express': { icon: SiNodedotjs, color: '#000000' },
  'MongoDB': { icon: SiMongodb, color: '#10B981' },
  'MySQL': { icon: SiMysql, color: '#2563EB' },
  'PostgreSQL': { icon: SiMysql, color: '#336791' },
  'Tailwind': { icon: SiTailwindcss, color: '#06B6D4' },
  'SCSS': { icon: SiSass, color: '#EC4899' },
  'TypeScript': { icon: SiTypescript, color: '#2563EB' },
  'JavaScript': { icon: SiJavascript, color: '#EAB308' },
  'HTML': { icon: SiHtml5, color: '#F97316' },
  'CSS': { icon: SiCss3, color: '#3B82F6' },
  'PHP': { icon: SiPhp, color: '#777BB4' },
  'Laravel': { icon: SiLaravel, color: '#FF2D20' },
  'WordPress': { icon: SiWordpress, color: '#21759B' },
  'Firebase': { icon: SiFirebase, color: '#F97316' },
  'Docker': { icon: SiDocker, color: '#2496ED' },
  'Git': { icon: SiGit, color: '#F05032' },
  'Figma': { icon: SiFigma, color: '#F24E1E' },
  'Adobe XD': { icon: SiAdobexd, color: '#FF61F6' }
};


export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState("free");
  const [user, setUser] = useState(null);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuSticky, setIsMenuSticky] = useState(false);

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      console.log('Fetching from URL:', `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/projects`);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/projects`);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      if (data.success && data.data) {
        // Transform API data to match component structure
        const transformedProjects = data.data.map(project => ({
          image: project.image,
          title: project.title,
          category: project.category,
          type: project.category, // Use category field which contains free/premium
          alt: project.alt || `Image du projet ${project.title}`,
          technologies: project.technologies.map(tech => {
            const mapping = iconMapping[tech.name] || { icon: SiGithub, color: '#6B7280' };
            return {
              name: tech.name,
              shortName: tech.shortName || tech.name,
              icon: mapping.icon,
              color: `text-[${mapping.color}]`
            };
          })
        }));
        console.log('Transformed projects:', transformedProjects); // Debug log
        console.log('Project types:', transformedProjects.map(p => p.type));
        console.log('Raw project types from DB:', data.data.map(p => p.type));
        console.log('Setting portfolioItems to:', transformedProjects);
        setPortfolioItems(transformedProjects);
      } else {
        console.log('No data or unsuccessful response'); // Debug log
        setPortfolioItems([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setPortfolioItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Fetch projects initially
    fetchProjects();

    // Écouter les mises à jour depuis l'admin
    const handleProjectsUpdate = () => {
      fetchProjects();
    };
    
    window.addEventListener('projectsUpdated', handleProjectsUpdate);

    // Set up polling for real-time updates (réduit à 30s)
    const interval = setInterval(fetchProjects, 30000);

    // Scroll handler for sticky menu
    const handleScroll = () => {
      const menuElement = document.getElementById('portfolio-menu');
      if (menuElement) {
        const rect = menuElement.getBoundingClientRect();
        setIsMenuSticky(rect.top <= 20);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Écouter l'événement de déconnexion
    const handleLogout = () => setUser(null);
    window.addEventListener('logout', handleLogout);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('projectsUpdated', handleProjectsUpdate);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

  // Filter projects based on their type
  const filteredItems = portfolioItems.filter(item => item.type === activeTab);
  console.log('portfolioItems:', portfolioItems);
  console.log('activeTab:', activeTab);
  console.log('filteredItems:', filteredItems);
  console.log('Premium projects count:', portfolioItems.filter(p => p.type === "premium").length);
  console.log('Free projects count:', portfolioItems.filter(p => p.type === "free").length);

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
      <div id="portfolio-menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-8 relative z-20">
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

      {/* Menu vertical sticky - Hidden on mobile */}
      {isMenuSticky && (
        <div className="hidden lg:block fixed left-6 top-1/2 transform -translate-y-1/2 z-[9999] animate-in slide-in-from-left duration-300">
          <div className="flex flex-col bg-gray-100 rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab("free")}
              className={`px-3 py-8 rounded-md text-sm font-medium transition-all duration-200 mb-1 ${
                activeTab === "free"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Free
            </button>
            <button
              onClick={() => setActiveTab("premium")}
              className={`px-3 py-8 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === "premium"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Premium
            </button>
          </div>
        </div>
      )}

      {/* Grille des projets */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
        <div className="max-w-6xl mx-auto min-h-[800px]">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : activeTab === "free" ? (
            filteredItems.length === 0 ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <p className="text-gray-500 text-lg">Aucun projet trouvé</p>
                  <p className="text-gray-400 text-sm mt-2">Projets chargés: {portfolioItems.length}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item, index) => (
                <div key={index} className="w-full group cursor-pointer bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300">
                  <div className="overflow-hidden rounded-xl aspect-video bg-gray-100 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <img 
                      className="w-full h-full object-cover transform transition duration-300 group-hover:scale-105" 
                      src={item.image.startsWith('/uploads') ? `http://localhost:5000${item.image}` : item.image} 
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
                          const color = tech.color.includes('#') ? tech.color.replace('text-[', '').replace(']', '') : 
                            tech.color.replace('text-', '') === 'blue-500' ? '#3B82F6' : 
                            tech.color.replace('text-', '') === 'cyan-500' ? '#06B6D4' : 
                            tech.color.replace('text-', '') === 'green-600' ? '#059669' : 
                            tech.color.replace('text-', '') === 'emerald-500' ? '#10B981' : 
                            tech.color.replace('text-', '') === 'purple-600' ? '#9333EA' : 
                            tech.color.replace('text-', '') === 'pink-500' ? '#EC4899' : 
                            tech.color.replace('text-', '') === 'gray-800' ? '#1F2937' : 
                            tech.color.replace('text-', '') === 'blue-600' ? '#2563EB' : 
                            tech.color.replace('text-', '') === 'green-500' ? '#10B981' : 
                            tech.color.replace('text-', '') === 'orange-500' ? '#F97316' : 
                            tech.color.replace('text-', '') === 'yellow-500' ? '#EAB308' : '#6B7280';
                          return (
                            <span key={techIndex} className="flex items-center gap-1.5 px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md font-medium hover:bg-slate-100 transition-colors duration-200 min-w-[60px] justify-center">
                              <IconComponent className="w-4 h-4 flex-shrink-0" style={{ color }} />
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
            )
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
                            src={item.image.startsWith('/uploads') ? `http://localhost:5000${item.image}` : item.image} 
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
                              const color = tech.color.includes('#') ? tech.color.replace('text-[', '').replace(']', '') : 
                                tech.color.replace('text-', '') === 'blue-500' ? '#3B82F6' : 
                                tech.color.replace('text-', '') === 'cyan-500' ? '#06B6D4' : 
                                tech.color.replace('text-', '') === 'green-600' ? '#059669' : 
                                tech.color.replace('text-', '') === 'emerald-500' ? '#10B981' : 
                                tech.color.replace('text-', '') === 'purple-600' ? '#9333EA' : 
                                tech.color.replace('text-', '') === 'pink-500' ? '#EC4899' : 
                                tech.color.replace('text-', '') === 'gray-800' ? '#1F2937' : 
                                tech.color.replace('text-', '') === 'blue-600' ? '#2563EB' : 
                                tech.color.replace('text-', '') === 'green-500' ? '#10B981' : 
                                tech.color.replace('text-', '') === 'orange-500' ? '#F97316' : 
                                tech.color.replace('text-', '') === 'yellow-500' ? '#EAB308' : '#6B7280';
                              return (
                                <span key={techIndex} className="flex items-center gap-1.5 px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md font-medium hover:bg-slate-100 transition-colors duration-200 min-w-[60px] justify-center">
                                  <IconComponent className="w-4 h-4 flex-shrink-0" style={{ color }} />
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
