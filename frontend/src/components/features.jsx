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
                        <strong>Location mensuelle</strong> (flexible), <strong>Achat unique</strong> (possession), ou <strong>Sur mesure</strong> (personnalisé). 
                        Choisissez la formule qui correspond à vos besoins et votre budget.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                                         {/* Création de sites sur mesure */}
                     

                    {/* Location */}
                     <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100">
                         <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                             <span className="text-3xl">💳</span>
                         </div>
                         <h3 className="text-2xl font-semibold text-slate-800 text-center mb-4">
                             Location Mensuelle
                         </h3>
                         <p className="text-slate-600 text-center leading-relaxed">
                             <strong>Solution flexible :</strong> Payez mensuellement pour votre site professionnel. Maintenance, hébergement et mises à jour inclus.
                         </p>
                         <ul className="mt-6 space-y-2 mb-6">
                             <li className="flex items-center text-sm text-slate-600">
                                 <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                 Pas d'investissement initial important
                             </li>
                             <li className="flex items-center text-sm text-slate-600">
                                 <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                 Maintenance et support inclus
                             </li>
                             <li className="flex items-center text-sm text-slate-600">
                                 <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                 Mises à jour automatiques
                             </li>
                         </ul>
                     </div>

                    {/* Achat */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                            <span className="text-3xl">💰</span>
                        </div>
                        <h3 className="text-2xl font-semibold text-slate-800 text-center mb-4">
                            Achat Unique
                        </h3>
                        <p className="text-slate-600 text-center leading-relaxed">
                            <strong>Possession complète :</strong> Achetez votre site une fois et possédez-le à vie. Idéal pour ceux qui préfèrent un investissement unique.
                        </p>
                        <ul className="mt-6 space-y-2">
                            <li className="flex items-center text-sm text-slate-600">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                Paiement unique, site à vie
                            </li>
                            <li className="flex items-center text-sm text-slate-600">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                Contrôle total de votre site
                            </li>
                            <li className="flex items-center text-sm text-slate-600">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                Formation complète incluse
                            </li>
                        </ul>
                    </div>

                    {/* Sur Mesure */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                            <span className="text-3xl">🎨</span>
                        </div>
                        <h3 className="text-2xl font-semibold text-slate-800 text-center mb-4">
                            Création Sur Mesure
                        </h3>
                        <p className="text-slate-600 text-center leading-relaxed">
                            <strong>Solution personnalisée :</strong> Site entièrement conçu selon vos besoins spécifiques. Design unique et fonctionnalités sur mesure.
                        </p>
                        <ul className="mt-6 space-y-2">
                            <li className="flex items-center text-sm text-slate-600">
                                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                                Design 100% personnalisé
                            </li>
                            <li className="flex items-center text-sm text-slate-600">
                                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                                Fonctionnalités spécifiques
                            </li>
                            <li className="flex items-center text-sm text-slate-600">
                                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                                Accompagnement dédié
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}