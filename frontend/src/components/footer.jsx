import "@fontsource/poppins";

const navigation = [
    { name: 'Accueil', href: '#' },
    { name: 'À propos', href: '#' },
    { name: 'Services', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'Aide', href: '#' }
];

const socialLinks = [
    {
        name: 'Facebook',
        href: '#',
        icon: (
            <path 
                d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
        )
    },
    {
        name: 'Instagram',
        href: '#',
        icon: (
            <>
                <path 
                    d="M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                />
                <path 
                    d="M16 11.37a4 4 0 1 1-7.914 1.173A4 4 0 0 1 16 11.37m1.5-4.87h.01" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                />
            </>
        )
    },
    {
        name: 'LinkedIn',
        href: '#',
        icon: (
            <path 
                d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6M6 9H2v12h4zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
        )
    },
    {
        name: 'Twitter',
        href: '#',
        icon: (
            <path 
                d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
        )
    },
    {
        name: 'GitHub',
        href: '#',
        icon: (
            <>
                <path 
                    d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                />
                <path 
                    d="M9 18c-4.51 2-5-2-7-2" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                />
            </>
        )
    }
];

export default function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="bg-white border-t border-slate-100 w-full py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Logo et description */}
                <div className="text-center mb-12">
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">
                        Forgeron du Web
                    </h3>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Votre partenaire de confiance pour créer des sites web professionnels, 
                        performants et sur mesure qui vous démarquent de la concurrence.
                    </p>
                </div>

                {/* Navigation */}
                <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12" aria-label="Navigation du pied de page">
                    {navigation.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors duration-200"
                        >
                            {item.name}
                        </a>
                    ))}
                </nav>

                {/* Réseaux sociaux */}
                <div className="flex justify-center space-x-6 mb-12">
                    {socialLinks.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-800 transition-all duration-200 hover:scale-110"
                            aria-label={`Visitez notre page ${item.name}`}
                        >
                            <svg 
                                width="20" 
                                height="20" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                {item.icon}
                            </svg>
                        </a>
                    ))}
                </div>

                {/* Séparateur */}
                <div className="w-full h-px bg-slate-200 mb-8"></div>

                {/* Copyright */}
                <div className="text-center">
                    <p className="text-sm text-slate-500">
                        Copyright © {currentYear}{' '}
                        <span className="font-semibold text-slate-700">
                            Forgeron du Web
                        </span>
                        . Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
}
