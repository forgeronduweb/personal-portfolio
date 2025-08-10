import "@fontsource/poppins";
import { 
    SiReact, 
    SiTailwindcss, 
    SiNodedotjs, 
    SiVuedotjs, 
    SiGithub, 
    SiSass, 
    SiNextdotjs, 
    SiTypescript, 
    SiMongodb 
} from "react-icons/si";

const portfolioItems = [
    {
        image: "/img_1.jpg",
        title: "Site E-commerce Moderne",
        category: "Boutique en ligne",
        alt: "Site e-commerce avec design moderne",
        technologies: [
            { name: "React", icon: SiReact, color: "text-blue-500" },
            { name: "Tailwind", icon: SiTailwindcss, color: "text-cyan-500" },
            { name: "Node.js", icon: SiNodedotjs, color: "text-green-600" }
        ]
    },
    {
        image: "/img_2.jpg",
        title: "Portfolio Créatif",
        category: "Site vitrine",
        alt: "Portfolio avec animations créatives",
        technologies: [
            { name: "Vue.js", icon: SiVuedotjs, color: "text-emerald-500" },
            { name: "GSAP", icon: SiGithub, color: "text-purple-600" },
            { name: "SCSS", icon: SiSass, color: "text-pink-500" }
        ]
    },
    {
        image: "/img_3.jpg",
        title: "Application Web Responsive",
        category: "Application métier",
        alt: "Application web responsive moderne",
        technologies: [
            { name: "Next.js", icon: SiNextdotjs, color: "text-gray-800" },
            { name: "TS", icon: SiTypescript, color: "text-blue-600" },
            { name: "MongoDB", icon: SiMongodb, color: "text-green-500" }
        ]
    }
];

export default function Portfolio() {
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
                        <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                            Voir plus →
                        </a>
                    </div>
                </div>
                
                {/* Content */}
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8">
                        {portfolioItems.map((item, index) => (
                            <div key={index} className="w-full md:max-w-96 group cursor-pointer">
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
                                        <div className="flex items-center gap-2">
                                            {item.technologies.slice(0, 3).map((tech, techIndex) => {
                                                const IconComponent = tech.icon;
                                                return (
                                                    <span key={techIndex} className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-md font-medium hover:bg-gray-100 transition-colors">
                                                        <IconComponent className={`w-4 h-4 ${tech.color}`} />
                                                        <span className="text-gray-700 whitespace-nowrap">{tech.name}</span>
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
