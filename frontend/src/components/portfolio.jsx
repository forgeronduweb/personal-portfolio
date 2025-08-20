import "@fontsource/poppins";
import { useState, useEffect } from "react";
import { 
    SiReact, 
    SiTailwindcss, 
    SiNodedotjs, 
    SiVuedotjs, 
    SiGithub, 
    SiSass, 
    SiNextdotjs, 
    SiTypescript, 
    SiMongodb,
    SiJavascript
} from "react-icons/si";

// Mapping des icônes pour les technologies
const iconMap = {
    'SiReact': SiReact,
    'SiTailwindcss': SiTailwindcss,
    'SiNodedotjs': SiNodedotjs,
    'SiVuedotjs': SiVuedotjs,
    'SiGithub': SiGithub,
    'SiSass': SiSass,
    'SiNextdotjs': SiNextdotjs,
    'SiTypescript': SiTypescript,
    'SiMongodb': SiMongodb,
    'SiJavascript': SiJavascript
};

// Mapping des couleurs Tailwind vers les couleurs CSS
const colorMap = {
    'text-blue-500': '#3B82F6',
    'text-cyan-500': '#06B6D4',
    'text-green-600': '#059669',
    'text-emerald-500': '#10B981',
    'text-purple-600': '#9333EA',
    'text-pink-500': '#EC4899',
    'text-gray-800': '#1F2937',
    'text-blue-600': '#2563EB',
    'text-green-500': '#10B981',
    'text-yellow-500': '#EAB308',
    'text-black': '#000000'
};

const fallbackPortfolioItems = [
    {
        image: "/img_1.jpg",
        title: "Site E-commerce Moderne",
        category: "Boutique en ligne",
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
        alt: "Application web responsive moderne",
        technologies: [
            { name: "Next.js", shortName: "Next", icon: SiNextdotjs, color: "text-gray-800" },
            { name: "TypeScript", shortName: "TS", icon: SiTypescript, color: "text-blue-600" },
            { name: "MongoDB", shortName: "Mongo", icon: SiMongodb, color: "text-green-500" }
        ]
    }
];

export default function Portfolio() {
    const [portfolioItems, setPortfolioItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
        
        // Polling pour vérifier les nouveaux projets toutes les 10 secondes
        const interval = setInterval(() => {
            fetchProjects();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/projects');
            const data = await response.json();
            if (data.success) {
                setPortfolioItems(data.data);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des projets:', error);
            // Fallback vers les données statiques en cas d'erreur
            if (portfolioItems.length === 0) {
                setPortfolioItems(fallbackPortfolioItems);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="text-lg text-gray-500">Chargement des projets...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-semibold text-center mx-auto">
                        Mes dernières créations web
                    </h1>
                    <p className="text-sm text-slate-500 text-center mt-2 max-w-3xl mx-auto">
                        Découvrez mes derniers sites sur mesure et templates prêts à l'emploi,
                        conçus pour offrir performance, style et impact à vos projets en ligne.
                    </p>
                    <div className="text-right mt-4">
                        <button 
                          onClick={() => {
                            const event = new CustomEvent('navigate', { detail: 'portfolio' });
                            window.dispatchEvent(event);
                          }}
                          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            Voir plus →
                        </button>
                    </div>
                </div>
                
                {/* Content */}
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8">
                        {portfolioItems.slice(0, 3).map((item, index) => (
                            <div key={item._id || index} className="w-full md:max-w-96 group cursor-pointer">
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
                                        <p className="text-sm text-indigo-600 font-medium">{item.category} {item.type && `• ${item.type}`}</p>
                                        <div className="flex items-center gap-1.5">
                                            {item.technologies && item.technologies.slice(0, 3).map((tech, techIndex) => {
                                                const IconComponent = iconMap[tech.icon] || SiGithub;
                                                const color = colorMap[tech.color] || '#6B7280';
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
                </div>
            </div>
        </div>
    );
}
