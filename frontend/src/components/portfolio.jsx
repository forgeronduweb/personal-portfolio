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


export default function Portfolio() {
    // Portfolio temporairement désactivé
    return (
        <div className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-semibold text-center mx-auto">
                        Portfolio temporairement indisponible
                    </h1>
                    <p className="text-sm text-slate-500 text-center mt-2 max-w-3xl mx-auto">
                        Cette section est actuellement en cours de mise à jour. 
                        De nouveaux projets seront bientôt disponibles.
                    </p>
                </div>
                
                {/* Message d'indisponibilité */}
                <div className="max-w-2xl mx-auto text-center">
                    <div className="bg-black border border-gray-800 rounded-xl p-8">
                        <div className="text-6xl mb-4">🚧</div>
                        <h3 className="text-xl font-medium text-white mb-2">
                            Section en maintenance
                        </h3>
                        <p className="text-gray-300 mb-6">
                            Le portfolio est temporairement fermé pour ajout de nouveaux projets. 
                            Revenez bientôt pour découvrir mes dernières créations ! 
                            Nous vous enverrons un email dès que ce sera disponible.
                        </p>
                        <button 
                          onClick={() => {
                            const event = new CustomEvent('navigate', { detail: 'quote' });
                            window.dispatchEvent(event);
                          }}
                          className="bg-white hover:bg-gray-100 text-black px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Demander un devis en attendant
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
