import React from 'react';
import "@fontsource/poppins";

export default function Features() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-semibold text-slate-700 mb-6">
                        Nos Services Web
                    </h2>
                    <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                        Découvrez nos solutions complètes pour tous vos besoins en développement web
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {/* Création de sites sur mesure */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-slate-800 text-center mb-4">
                            Sites sur Mesure
                        </h3>
                        <p className="text-slate-600 text-center leading-relaxed">
                            Développement de sites web personnalisés selon vos besoins spécifiques, 
                            avec une interface moderne et des fonctionnalités avancées.
                        </p>
                        <ul className="mt-6 space-y-2">
                            <li className="flex items-center text-sm text-slate-600">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                Design personnalisé
                            </li>
                            <li className="flex items-center text-sm text-slate-600">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                Fonctionnalités sur mesure
                            </li>
                            <li className="flex items-center text-sm text-slate-600">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                Optimisation SEO
                            </li>
                        </ul>
                    </div>

                    {/* Location de sites web */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 7V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M3 7V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8 11H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8 15H12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-slate-800 text-center mb-4">
                            Location de Sites
                        </h3>
                        <p className="text-slate-600 text-center leading-relaxed">
                            Hébergement et maintenance de vos sites web avec support technique 
                            et mises à jour régulières incluses.
                        </p>
                        <ul className="mt-6 space-y-2">
                            <li className="flex items-center text-sm text-slate-600">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                Hébergement sécurisé
                            </li>
                            <li className="flex items-center text-sm text-slate-600">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                Maintenance continue
                            </li>
                            <li className="flex items-center text-sm text-slate-600">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                Support 24/7
                            </li>
                        </ul>
                    </div>

                    {/* Achat de sites web */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M19 3L19.5 4.5L21 5L19.5 5.5L19 7L18.5 5.5L17 5L18.5 4.5L19 3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M5 19L5.5 20.5L7 21L5.5 21.5L5 23L4.5 21.5L3 21L4.5 20.5L5 19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-slate-800 text-center mb-4">
                            Achat de Sites
                        </h3>
                        <p className="text-slate-600 text-center leading-relaxed">
                            Sites web prêts à l'emploi, optimisés et performants pour 
                            démarrer rapidement votre présence en ligne.
                        </p>
                        <ul className="mt-6 space-y-2">
                            <li className="flex items-center text-sm text-slate-600">
                                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                                Sites prêts à l'emploi
                            </li>
                            <li className="flex items-center text-sm text-slate-600">
                                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                                Optimisation complète
                            </li>
                            <li className="flex items-center text-sm text-slate-600">
                                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                                Livraison immédiate
                            </li>
                        </ul>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center mt-16">
                    <button className="bg-slate-800 hover:bg-black text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                        Démarrer Votre Projet
                    </button>
                </div>
            </div>
        </section>
    );
}