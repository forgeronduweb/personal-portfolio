import { useState } from "react";
import "@fontsource/poppins";

export default function ProjectForm({ onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    objective: "",
    technologies: "",
    pages: "",
    features: "",
    budget: "",
    timeline: "",
    mockup: null,
    additionalNotes: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const steps = [
    {
      title: "Adresse e-mail",
      description: "Permet de vous recontacter rapidement et sans détour.",
      field: "email",
      type: "email",
      placeholder: "votre@email.com",
      required: true
    },
    {
      title: "Objectif du site",
      description: "Quel est le but principal du site ? (Ex. : vendre en ligne, présenter vos services, créer un catalogue, partager du contenu)",
      field: "objective",
      type: "textarea",
      placeholder: "Décrivez l'objectif principal de votre site...",
      required: true
    },
    {
      title: "Technologies ou plateformes souhaitées",
      description: "Par exemple : WordPress, Shopify, développement sur mesure, etc.",
      field: "technologies",
      type: "textarea",
      placeholder: "WordPress, Shopify, développement sur mesure...",
      required: false
    },
    {
      title: "Pages souhaitées",
      description: "Décrivez les pages clés (ex. : Accueil, À propos, Services, Contact…)",
      field: "pages",
      type: "textarea",
      placeholder: "Accueil, À propos, Services, Contact...",
      required: true
    },
    {
      title: "Fonctionnalités attendues",
      description: "Exemples : paiement en ligne, formulaire de contact, blog, espace membre, newsletter, etc.",
      field: "features",
      type: "textarea",
      placeholder: "Paiement en ligne, formulaire de contact, blog...",
      required: true
    },
    {
      title: "Budget estimé",
      description: "Une fourchette ou un ordre d'idée pour filtrer les propositions pertinentes",
      field: "budget",
      type: "select",
      options: [
        { value: "", label: "Sélectionnez une fourchette" },
        { value: "1000-3000", label: "1 000€ - 3 000€" },
        { value: "3000-5000", label: "3 000€ - 5 000€" },
        { value: "5000-10000", label: "5 000€ - 10 000€" },
        { value: "10000+", label: "10 000€ et plus" },
        { value: "a-discuter", label: "À discuter" }
      ],
      required: true
    },
    {
      title: "Délais / planning souhaités",
      description: "Quelle est votre échéance ou date de mise en ligne souhaitée ?",
      field: "timeline",
      type: "select",
      options: [
        { value: "", label: "Sélectionnez un délai" },
        { value: "urgent", label: "Urgent (1-2 semaines)" },
        { value: "normal", label: "Normal (1-2 mois)" },
        { value: "flexible", label: "Flexible (3-6 mois)" },
        { value: "a-discuter", label: "À discuter" }
      ],
      required: true
    },
    {
      title: "Upload maquette",
      description: "Permet de joindre un fichier (image ou PDF) décrivant votre design ou vos envies visuelles.",
      field: "mockup",
      type: "file",
      accept: "image/*,.pdf",
      required: false
    },
    {
      title: "Message libre / remarques complémentaires",
      description: "Pour ajouter des précisions, inspirations, contraintes, références de sites, etc.",
      field: "additionalNotes",
      type: "textarea",
      placeholder: "Ajoutez vos remarques, inspirations, références...",
      required: false
    }
  ];

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleNext = () => {
    const currentField = steps[currentStep].field;
    const currentValue = formData[currentField];
    
    if (steps[currentStep].required && !currentValue) {
      setError("Ce champ est obligatoire");
      return;
    }
    
    setError("");
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Ici vous pouvez ajouter l'envoi des données vers votre API
      console.log("Données du formulaire:", formData);
      
      // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Succès - rediriger vers la page de validation
      const event = new CustomEvent('navigate', { detail: 'project-success' });
      window.dispatchEvent(event);
    } catch (error) {
      setError("Une erreur s'est produite lors de l'envoi. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-white">
      {/* Header avec nom du site */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <button 
            onClick={() => {
              const event = new CustomEvent('navigate', { detail: 'home' });
              window.dispatchEvent(event);
            }}
            className="text-2xl font-bold text-slate-900 hover:text-slate-700 transition-colors"
          >
            forgeron du web
          </button>
        </div>
      </div>

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Formulaire de projet sur mesure
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Décrivez votre projet en quelques étapes simples pour que nous puissions vous proposer la meilleure solution
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Étape {currentStep + 1} sur {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">
                {currentStepData.title}
              </h2>
              <p className="text-slate-600 mb-6">
                {currentStepData.description}
              </p>

              {currentStepData.type === "email" && (
                <input
                  type="email"
                  name={currentStepData.field}
                  value={formData[currentStepData.field]}
                  onChange={handleInputChange}
                  placeholder={currentStepData.placeholder}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={currentStepData.required}
                />
              )}

              {currentStepData.type === "textarea" && (
                <textarea
                  name={currentStepData.field}
                  value={formData[currentStepData.field]}
                  onChange={handleInputChange}
                  placeholder={currentStepData.placeholder}
                  rows={6}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required={currentStepData.required}
                />
              )}

              {currentStepData.type === "select" && (
                <select
                  name={currentStepData.field}
                  value={formData[currentStepData.field]}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={currentStepData.required}
                >
                  {currentStepData.options.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {currentStepData.type === "file" && (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    name={currentStepData.field}
                    onChange={handleInputChange}
                    accept={currentStepData.accept}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <svg className="mx-auto h-16 w-16 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-4 text-lg text-slate-600">
                      Cliquez pour sélectionner un fichier
                    </p>
                    <p className="text-sm text-slate-500 mt-2">
                      PNG, JPG, PDF jusqu'à 10MB
                    </p>
                  </label>
                  {formData[currentStepData.field] && (
                    <p className="mt-4 text-sm text-green-600">
                      Fichier sélectionné : {formData[currentStepData.field].name}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="px-8 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                ← Précédent
              </button>

              {currentStep === steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </span>
                  ) : (
                    "Envoyer ma demande"
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Suivant →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
