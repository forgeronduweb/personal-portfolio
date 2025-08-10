import { useState } from "react";
import "@fontsource/poppins";

export default function Faq() {
    const [openIndex, setOpenIndex] = useState(null);
    
    const faqsData = [
        {
            question: "Comment se déroule un projet web avec FDW ?",
            answer: "Notre processus se déroule en 4 étapes : 1) Discussion initiale pour comprendre vos besoins, 2) Proposition détaillée et devis, 3) Développement avec points d'étape réguliers, 4) Tests et mise en ligne. Nous restons disponibles pour le support après-vente."
        },
        {
            question: "Quels sont vos délais de réalisation ?",
            answer: "Les délais varient selon la complexité du projet : 1-2 semaines pour un site vitrine simple, 3-4 semaines pour un site e-commerce basique, 2-3 mois pour une application web complexe. Nous définissons un planning précis au début du projet."
        },
        {
            question: "Proposez-vous un service de maintenance ?",
            answer: "Oui, nous proposons plusieurs formules de maintenance : mise à jour de sécurité, sauvegardes régulières, modifications mineures du contenu, support technique. Nous adaptons nos services selon vos besoins."
        },
        {
            question: "Les sites sont-ils optimisés pour le référencement ?",
            answer: "Absolument. Nous intégrons les bonnes pratiques SEO dès la conception : structure HTML sémantique, temps de chargement optimisé, responsive design, méta-données optimisées. Nous fournissons aussi des conseils pour améliorer votre visibilité."
        },
        {
            question: "Puis-je modifier mon site moi-même ?",
            answer: "Oui, nous développons systématiquement une interface d'administration simple et intuitive. Nous vous formons à son utilisation pour que vous puissiez gérer votre contenu en toute autonomie."
        }
    ];
    
    return (
        <div className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-semibold text-black mb-4">Questions fréquentes</h2>
                    <p className="text-base text-gray-600 max-w-3xl mx-auto">
                        Des réponses claires à vos questions pour vous aider à prendre la meilleure décision pour votre projet web.
                    </p>
                </div>
                
                {/* Content */}
                <div className="max-w-6xl mx-auto">
                    <div className="space-y-4">
                        {faqsData.map((faq, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg">
                                <button 
                                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                >
                                    <h3 className="text-left font-medium text-black">{faq.question}</h3>
                                    <svg 
                                        width="24" 
                                        height="24" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className={`transform transition-transform duration-200 ${openIndex === index ? "rotate-180" : ""}`}
                                    >
                                        <path 
                                            d="M6 9l6 6 6-6" 
                                            stroke="currentColor" 
                                            strokeWidth="2" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                        />
                                    </svg>
                                </button>
                                <div 
                                    className={`overflow-hidden transition-all duration-200 ${
                                        openIndex === index ? "max-h-96" : "max-h-0"
                                    }`}
                                >
                                    <p className="p-4 text-gray-600 text-base leading-relaxed border-t border-gray-100">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}