import "@fontsource/poppins";

export default function About() {
    return (
        <section className="flex flex-col md:flex-row items-center justify-center gap-10 max-md:px-4 py-16">
             <div className="text-sm text-slate-600 max-w-lg">
                <h1 className="text-xl uppercase font-semibold text-slate-700">Que faisons-nous ?</h1>
                <div className="w-24 h-[3px] rounded-full bg-gradient-to-r from-indigo-600 to-[#DDD9FF]"></div>
                <p className="mt-8">FDW vous aide à créer une présence digitale remarquable en transformant votre vision en sites web 
                    fonctionnels et performants, prêts pour la production.</p>
                <p className="mt-4">Que vous lanciez une application SaaS, une landing page, ou un tableau de bord, notre expertise 
                    en développement web est conçue pour accélérer votre croissance et améliorer l'expérience utilisateur.</p>
                <p className="mt-4">Des systèmes de design sur mesure aux layouts automatisés, FDW vous permet de construire 
                    élégamment et d'évoluer sans effort.</p>
                <button className="flex items-center gap-2 mt-8 hover:-translate-y-0.5 transition bg-gradient-to-r from-indigo-600 to-[#8A7DFF] py-3 px-8 rounded-full text-white">
                    <span>En savoir plus</span>
                    <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12.53 6.53a.75.75 0 0 0 0-1.06L7.757.697a.75.75 0 1 0-1.06 1.06L10.939 6l-4.242 4.243a.75.75 0 0 0 1.06 1.06zM0 6v.75h12v-1.5H0z"
                            fill="#fff" />
                    </svg>
                </button>
            </div>
            <div className="relative shadow-2xl shadow-indigo-600/40 rounded-2xl overflow-hidden shrink-0">
                <img className="max-w-md w-full object-cover rounded-2xl"
                    src="https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?q=80&w=451&h=451&auto=format&fit=crop"
                    alt="Équipe FDW" />
                <div className="flex items-center gap-1 max-w-72 absolute bottom-8 left-8 bg-white p-4 rounded-xl">
                    <div className="flex -space-x-4 shrink-0">
                        <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="Développeur"
                            className="size-9 rounded-full border-[3px] border-white hover:-translate-y-1 transition z-1" />
                        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" alt="Designer"
                            className="size-9 rounded-full border-[3px] border-white hover:-translate-y-1 transition z-[2]" />
                        <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop"
                            alt="Chef de projet"
                            className="size-9 rounded-full border-[3px] border-white hover:-translate-y-1 transition z-[3]" />
                        <div
                            className="flex items-center justify-center text-xs text-white size-9 rounded-full border-[3px] border-white bg-indigo-600 hover:-translate-y-1 transition z-[4]">
                            100+
                        </div>
                    </div>
                    <p className="text-sm font-medium text-slate-800">Rejoignez notre communauté</p>
                </div>
            </div>
        </section>
    );
}