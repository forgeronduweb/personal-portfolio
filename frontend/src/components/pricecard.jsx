import { useState } from 'react';

export default function Pricecard() {
    const [isYearly, setIsYearly] = useState(false);

    const toggleBilling = () => {
        setIsYearly(!isYearly);
        console.log('Toggle billing:', !isYearly); // Debug log
    };

    const plans = [
        {
            name: "Starter",
            description: "Parfait pour les freelances et petits projets",
            monthlyPrice: 0,
            yearlyPrice: 0,
            features: [
                "Template responsive prêt à l'emploi",
                "Hébergement inclus (1 an)",
                "Nom de domaine inclus (1 an)",
                "Support par email",
                "Formation à l'administration",
                "Optimisation SEO de base",
                "Mise en ligne sous 1 semaine"
            ],
            popular: false,
            color: "border-gray-200",
            bestFor: "Freelances, artisans, petites entreprises"
        },
        {
            name: "Professional",
            description: "Idéal pour les entreprises en croissance",
            monthlyPrice: 0,
            yearlyPrice: 0,
            features: [
                "Site sur mesure personnalisé",
                "Hébergement premium inclus (1 an)",
                "Nom de domaine inclus (1 an)",
                "Support prioritaire 24/7",
                "Interface d'administration avancée",
                "Optimisation SEO complète",
                "Intégration réseaux sociaux",
                "Analytics Google inclus",
                "Mise en ligne sous 2-3 semaines",
                "1 mois de support gratuit"
            ],
            popular: true,
            color: "border-gray-200",
            bestFor: "PME, startups, professionnels libéraux"
        },
        {
            name: "Enterprise",
            description: "Pour les grandes organisations",
            monthlyPrice: 0,
            yearlyPrice: 0,
            features: [
                "Site e-commerce complet",
                "Hébergement haute performance",
                "Nom de domaine + certificat SSL",
                "Support dédié avec gestionnaire de compte",
                "Formation équipe complète",
                "Optimisation SEO avancée",
                "Intégrations API personnalisées",
                "Sauvegardes automatiques",
                "Maintenance préventive incluse",
                "Mise en ligne sous 1-2 mois",
                "3 mois de support gratuit"
            ],
            popular: false,
            color: "border-gray-200",
            bestFor: "Grandes entreprises, e-commerce"
        }
    ];

    // Conversion en francs CFA (1 EUR ≈ 655 XOF)
    const formatPrice = (price) => {
        return price.toLocaleString('fr-FR');
    };

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                        Nos offres de création web
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Des solutions web professionnelles adaptées à tous les budgets. 
                        Basculez entre facturation mensuelle et annuelle pour des économies importantes.
                    </p>
                    
                    {/* Toggle Billing */}
                    <div className="flex items-center justify-center space-x-4 mb-8 ml-5">
                        <span className={`text-lg ${!isYearly ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                            Mensuel
                        </span>
                        <button 
                            type="button"
                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 ${
                                isYearly ? 'bg-black' : 'bg-gray-300'
                            }`}
                            onClick={toggleBilling}
                        >
                            <span 
                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-all duration-300 shadow-lg ${
                                    isYearly ? 'translate-x-7' : 'translate-x-1'
                                }`}
                            ></span>
                        </button>
                        <span className={`text-lg ${isYearly ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                            Annuel
                        </span>
                        <div className="w-48 h-8 hidden md:flex items-center justify-start ml-2">
                            {isYearly && (
                                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                                    Économisez jusqu'à 20%
                                </span>
                            )}
                        </div>
                    </div>
                    
                    {/* Badge en bas du toggle sur mobile */}
                    <div className="text-center mb-8 md:hidden">
                        {isYearly ? (
                            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-2 rounded-full">
                                Économisez jusqu'à 20%
                            </span>
                        ) : (
                            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-2 rounded-full">
                                Facturation mensuelle
                            </span>
                        )}
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <div 
                            key={index}
                            className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col ${
                                plan.popular ? 'ring-2 ring-black ring-opacity-50' : ''
                            } ${plan.color}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-black text-white px-4 py-2 rounded-full text-sm font-semibold">
                                        Plus populaire
                                    </span>
                                </div>
                            )}
                            
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        {plan.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3">
                                        {plan.description}
                                    </p>
                                    <p className="text-xs text-indigo-600 font-medium">
                                        Idéal pour : {plan.bestFor}
                                    </p>
                                </div>

                                <div className="text-center mb-8">
                                    <div className="flex items-baseline justify-center">
                                        <span className="text-5xl font-bold text-gray-900">
                                            {formatPrice(isYearly ? plan.yearlyPrice : plan.monthlyPrice)}
                                        </span>
                                        <span className="text-gray-500 ml-2">
                                            FCFA
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {isYearly ? '/mois, facturé annuellement' : '/mois'}
                                    </p>
                                    {isYearly && (
                                        <p className="text-xs text-green-600 mt-1 font-medium">
                                            Économie de {formatPrice(plan.monthlyPrice - plan.yearlyPrice)} FCFA/mois
                                        </p>
                                    )}
                                </div>

                                <ul className="space-y-4 mb-8 text-left flex-1">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-start gap-3">
                                            <svg 
                                                className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                fill="none" 
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    strokeWidth="2" 
                                                    d="M5 13l4 4L19 7" 
                                                />
                                            </svg>
                                            <span className="text-gray-700 text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-auto flex flex-col items-center">
                                    <button 
                                        className={`w-full md:w-auto px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
                                            plan.popular 
                                                ? 'bg-black hover:bg-gray-800 shadow-lg hover:shadow-xl' 
                                                : 'bg-gray-900 hover:bg-black'
                                        }`}
                                    >
                                        Commencer maintenant
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}