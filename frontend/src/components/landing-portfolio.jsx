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

export default function LandingPortfolio() {
    const [portfolioItems, setPortfolioItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
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
            setPortfolioItems([
                {
                    image: "/img_1.jpg",
                    title: "Site E-commerce Moderne",
                    category: "Boutique en ligne",
                    type: "Web App",
                    alt: "Site e-commerce avec design moderne",
                    technologies: [
                        { name: "React", shortName: "React", icon: "SiReact", color: "text-blue-500" },
                        { name: "Tailwind", shortName: "CSS", icon: "SiTailwindcss", color: "text-cyan-500" },
                        { name: "Node.js", shortName: "Node", icon: "SiNodedotjs", color: "text-green-600" }
                    ]
                },
                {
                    image: "/img_2.jpg",
                    title: "Portfolio Créatif",
                    category: "Site vitrine",
                    type: "Portfolio",
                    alt: "Portfolio avec animations créatives",
                    technologies: [
                        { name: "Vue.js", shortName: "Vue", icon: "SiVuedotjs", color: "text-emerald-500" },
                        { name: "GSAP", shortName: "GSAP", icon: "SiGithub", color: "text-purple-600" },
                        { name: "SCSS", shortName: "SCSS", icon: "SiSass", color: "text-pink-500" }
                    ]
                },
                {
                    image: "/img_3.jpg",
                    title: "Application Web Responsive",
                    category: "Application métier",
                    type: "Dashboard",
                    alt: "Application web responsive moderne",
                    technologies: [
                        { name: "Next.js", shortName: "Next", icon: "SiNextdotjs", color: "text-gray-800" },
                        { name: "TypeScript", shortName: "TS", icon: "SiTypescript", color: "text-blue-600" },
                        { name: "MongoDB", shortName: "Mongo", icon: "SiMongodb", color: "text-green-500" }
                    ]
                }
            ]);
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
        <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                        Nos Réalisations
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Découvrez quelques-unes de nos créations récentes, alliant design moderne et performance technique
                    </p>
                </div>
                
                {/* Portfolio Cards - Exact same design as portfolio.jsx */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                    {portfolioItems.slice(0, 3).map((item, index) => (
                        <div key={item._id || index} className="p-4 bg-white rounded-lg shadow text-sm max-w-80 hover:-translate-y-0.5 transition duration-300 group">
                            <img 
                                className="rounded-md max-h-40 w-full object-cover" 
                                src={item.image.startsWith('/uploads') ? `http://localhost:5000${item.image}` : item.image} 
                                alt={item.alt}
                                loading="lazy"
                            />
                            <p className="text-gray-900 text-xl font-semibold ml-2 mt-2">
                                {item.title}
                            </p>
                            <p className="text-gray-500 mt-3 ml-2">
                                {item.category} {item.type && `• ${item.type}`}
                            </p>
                            
                            {item.technologies && item.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2 ml-2">
                                    {item.technologies.slice(0, 3).map((tech, techIndex) => (
                                        <span key={techIndex} className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                            {tech.name}
                                        </span>
                                    ))}
                                    {item.technologies.length > 3 && (
                                        <span className="text-xs text-slate-500">+{item.technologies.length - 3}</span>
                                    )}
                                </div>
                            )}
                            
                            <div className="flex gap-2 mt-4 mb-3 ml-2">
                                <button
                                    onClick={() => {
                                        const event = new CustomEvent('navigate', { detail: 'portfolio' });
                                        window.dispatchEvent(event);
                                    }}
                                    className="bg-indigo-600 px-4 py-2 font-medium rounded text-white text-xs hover:bg-indigo-700 transition-colors"
                                >
                                    Voir le projet
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="text-center mt-12">
                    <button 
                        onClick={() => {
                            const event = new CustomEvent('navigate', { detail: 'portfolio' });
                            window.dispatchEvent(event);
                        }}
                        className="bg-slate-800 hover:bg-slate-800 text-white px-8 py-3 rounded-full font-medium transition"
                    >
                        Voir tous nos projets
                    </button>
                </div>
            </div>
        </div>
    );
}
