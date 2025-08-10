import "@fontsource/poppins";

const portfolioItems = [
    {
        image: "/src/assets/img (1).webp",
        title: "Site E-commerce Moderne",
        category: "Boutique en ligne",
        alt: "Site e-commerce avec design moderne",
        technologies: ["React", "Tailwind CSS", "Node.js"]
    },
    {
        image: "/src/assets/img (2).webp",
        title: "Portfolio Créatif",
        category: "Site vitrine",
        alt: "Portfolio avec animations créatives",
        technologies: ["Vue.js", "GSAP", "SCSS"]
    },
    {
        image: "/src/assets/img (3).webp",
        title: "Application Web Responsive",
        category: "Application métier",
        alt: "Application web responsive moderne",
        technologies: ["Next.js", "TypeScript", "MongoDB"]
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
                                            {item.technologies.slice(0, 3).map((tech, techIndex) => (
                                                <span key={techIndex} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md font-medium">
                                                    {tech}
                                                </span>
                                            ))}
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
