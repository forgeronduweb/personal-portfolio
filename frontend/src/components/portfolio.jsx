import "@fontsource/poppins";

const portfolioItems = [
    {
        image: "",
        title: "Template e-commerce moderne",
        category: "Site prêt à l’emploi",
        alt: "UI Design Color Psychology"
    },
    {
        image: "",
        title: "Portfolio créatif animé",
        category: "Template portfolio",
        alt: "Motion Design Example"
    },
    {
        image: "",
        title: "Site vitrine responsive",
        category: "Création sur mesure",
        alt: "Accessible Interface Design"
    }
];

export default function Portfolio() {
    return (
        <section className="py-20 px-4">
            <h1 className="text-3xl font-semibold text-center mx-auto">
                Mes dernières créations web
            </h1>
            <p className="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto">
                Découvrez mes derniers sites sur mesure et templates prêts à l’emploi,
                conçus pour offrir performance, style et impact à vos projets en ligne.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-12 max-w-7xl mx-auto">
                {portfolioItems.map((item, index) => (
                    <div key={index} className="max-w-72 w-full group cursor-pointer">
                        <div className="overflow-hidden rounded-xl aspect-video bg-gray-100">
                            <img 
                                className="w-full h-full object-cover transform transition duration-300 group-hover:scale-105" 
                                src={item.image} 
                                alt={item.alt}
                                loading="lazy"
                            />
                        </div>
                        <h3 className="text-base text-slate-900 font-medium mt-3 group-hover:text-indigo-600 transition">
                            {item.title}
                        </h3>
                        <p className="text-xs text-indigo-600 font-medium mt-1">{item.category}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
