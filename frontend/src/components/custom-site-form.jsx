import { useState } from "react";
import "@fontsource/poppins";

export default function CustomSiteForm({ onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    companyName: "",
    projectType: "",
    targetAudience: "",
    pages: "",
    features: "",
    designStyle: "",
    attachments: [],
    budget: "",
    timeline: "",
    additionalInfo: ""
  });

  const steps = [
    {
      title: "Adresse e-mail",
      field: {
        name: "email",
        label: "Adresse e-mail",
        type: "email",
        placeholder: "votre@email.com",
        required: true,
        help: "Pour vous recontacter rapidement et vous envoyer le devis"
      }
    },
    {
      title: "Nom de votre entreprise",
      field: {
        name: "companyName",
        label: "Nom de votre entreprise",
        type: "text",
        placeholder: "Votre entreprise ou Aucun si vous en avez pas",
        required: true,
        help: "Pour personnaliser votre projet"
      }
    },
    {
      title: "Type de site souhaité",
      field: {
        name: "projectType",
        label: "Type de site souhaité",
        type: "select",
        options: [
          { value: "", label: "Sélectionnez un type" },
          { value: "ecommerce", label: "Site e-commerce / Boutique en ligne" },
          { value: "corporate", label: "Site vitrine / Corporate" },
          { value: "portfolio", label: "Portfolio / Présentation" },
          { value: "blog", label: "Blog / Magazine" },
          { value: "landing", label: "Landing page" },
          { value: "other", label: "Autre (précisez dans les remarques)" }
        ],
        required: true
      }
    },
    {
      title: "Public cible",
      field: {
        name: "targetAudience",
        label: "Public cible",
        type: "textarea",
        placeholder: "Décrivez votre public cible (ex: professionnels, particuliers, âge, secteur d'activité...)",
        required: true,
        help: "Pour adapter le design et les fonctionnalités"
      }
    },
    {
      title: "Pages souhaitées",
      field: {
        name: "pages",
        label: "Pages souhaitées",
        type: "textarea",
        placeholder: "Ex: Accueil, À propos, Services, Portfolio, Contact, Blog, etc.",
        required: true,
        help: "Listez les pages principales de votre site"
      }
    },
    {
      title: "Fonctionnalités spécifiques",
      field: {
        name: "features",
        label: "Fonctionnalités spécifiques",
        type: "textarea",
        placeholder: "Ex: formulaire de contact, blog, espace membre, paiement en ligne, newsletter, etc.",
        required: true,
        help: "Fonctionnalités particulières dont vous avez besoin"
      }
    },
    {
      title: "Style de design souhaité",
      field: {
        name: "designStyle",
        label: "Style de design souhaité",
        type: "select",
        options: [
          { value: "", label: "Sélectionnez un style" },
          { value: "modern", label: "Moderne et épuré" },
          { value: "classic", label: "Classique et professionnel" },
          { value: "creative", label: "Créatif et original" },
          { value: "minimalist", label: "Minimaliste" },
          { value: "colorful", label: "Coloré et dynamique" },
          { value: "other", label: "Autre (précisez dans les remarques)" }
        ],
        required: true
      }
    },
    {
      title: "Maquette ou références visuelles",
      field: {
        name: "attachments",
        label: "Avez-vous une maquette ou des références visuelles ?",
        type: "file",
        accept: ".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx",
        multiple: true,
        required: false,
        help: "Uploadez votre maquette, wireframes, ou références visuelles (images, PDF, documents). Maximum 5 fichiers de 5MB chacun."
      }
    },
    {
      title: "Budget estimé",
      field: {
        name: "budget",
        label: "Budget estimé",
        type: "select",
        options: [
          { value: "", label: "Sélectionnez une fourchette" },
          { value: "150000-300000", label: "150 000 FCFA - 300 000 FCFA" }, // pour freelances, particuliers
          { value: "300000-600000", label: "300 000 FCFA - 600 000 FCFA" }, // pour petites entreprises
          { value: "600000-1000000", label: "600 000 FCFA - 1 000 000 FCFA" }, // projets plus sérieux
          { value: "1000000-2000000", label: "1 000 000 FCFA - 2 000 000 FCFA" }, // PME avec besoins avancés
          { value: "2000000+", label: "2 000 000 FCFA et plus" }, // cas exceptionnels (gros clients)
          { value: "flexible", label: "Budget flexible selon les besoins" },
        ],
        required: false
      }
    },
    {
      title: "Délai souhaité",
      field: {
        name: "timeline",
        label: "Délai souhaité",
        type: "select",
        options: [
          { value: "", label: "Sélectionnez un délai" },
          { value: "urgent", label: "Urgent (2-3 semaines)" },
          { value: "normal", label: "Normal (1-2 mois)" },
          { value: "flexible", label: "Flexible (selon vos disponibilités)" }
        ],
        required: true
      }
    },
    {
      title: "Informations complémentaires",
      field: {
        name: "additionalInfo",
        label: "Informations complémentaires",
        type: "textarea",
        placeholder: "Précisions, inspirations, contraintes, références de sites que vous aimez, etc.",
        required: false,
        help: "Tout ce qui peut nous aider à mieux comprendre votre projet"
      }
    }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: Array.from(files)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      
      // Ajouter tous les champs texte
      Object.keys(formData).forEach(key => {
        if (key !== 'attachments') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Ajouter les fichiers
      if (formData.attachments && formData.attachments.length > 0) {
        formData.attachments.forEach(file => {
          formDataToSend.append('attachments', file);
        });
      }

      const response = await fetch('http://localhost:5000/api/site-requests', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'envoi');
      }

      console.log("Demande de site enregistrée:", data);
      
      // Succès - rediriger vers la page de validation
      const event = new CustomEvent('navigate', { detail: 'custom-site-success' });
      window.dispatchEvent(event);
    } catch (error) {
      setError(error.message || "Une erreur s'est produite lors de l'envoi. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentStepData = steps[currentStep];
  const currentField = currentStepData.field;
  const progress = ((currentStep + 1) / steps.length) * 100;

  // Vérifier si le champ actuel est valide pour activer le bouton "Suivant"
  const isCurrentFieldValid = () => {
    const fieldValue = formData[currentField.name];
    
    // Pour le dernier champ (additionalInfo), on attend au moins quelque chose même si optionnel
    if (currentField.name === "additionalInfo") {
      return fieldValue && fieldValue.trim() !== "";
    }
    
    // Pour les fichiers, toujours valide car optionnel
    if (currentField.type === "file") {
      return true;
    }
    
    // Si le champ n'est pas requis (budget), il est toujours valide
    if (!currentField.required) {
      return true;
    }
    
    // Pour les champs requis, vérifier qu'ils ne sont pas vides
    if (currentField.type === "select") {
      return fieldValue && fieldValue !== "";
    }
    
    return fieldValue && fieldValue.trim() !== "";
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header du formulaire */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Site sur Mesure
            </h1>
            <p className="text-lg text-slate-600">
              Décrivez votre projet pour recevoir un devis personnalisé
            </p>
          </div>

                     {/* Barre de progression */}
           <div className="mb-8 max-w-2xl mx-auto">
             <div className="flex justify-between text-sm text-slate-600 mb-2">
               <span>Étape {currentStep + 1} sur {steps.length}</span>
               <span>{Math.round(progress)}%</span>
             </div>
             <div className="w-full bg-slate-200 rounded-full h-2">
               <div 
                 className="bg-slate-800 h-2 rounded-full transition-all duration-300"
                 style={{ width: `${progress}%` }}
               ></div>
             </div>
           </div>

           {/* Formulaire avec taille fixe */}
                       <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 w-full max-w-2xl mx-auto">
              <div className="min-h-[300px] flex flex-col">
               <div className="flex-1">
                 <h2 className="text-2xl font-semibold text-slate-900 mb-6">
                   {currentStepData.title}
                 </h2>

                 <div className="mb-6">
                   <label className="block text-sm font-medium text-slate-700 mb-2">
                     {currentField.label}
                     {currentField.required && <span className="text-red-500 ml-1">*</span>}
                   </label>

                   {currentField.type === "select" ? (
                     <select
                       name={currentField.name}
                       value={formData[currentField.name]}
                       onChange={handleInputChange}
                       required={currentField.required}
                       className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                     >
                       {currentField.options.map((option, optionIndex) => (
                         <option key={optionIndex} value={option.value}>
                           {option.label}
                         </option>
                       ))}
                     </select>
                   ) : currentField.type === "textarea" ? (
                     <textarea
                       name={currentField.name}
                       value={formData[currentField.name]}
                       onChange={handleInputChange}
                       required={currentField.required}
                       placeholder={currentField.placeholder}
                       rows={4}
                       className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                     />
                   ) : currentField.type === "file" ? (
                    <div>
                      <input
                        type="file"
                        name={currentField.name}
                        onChange={handleInputChange}
                        accept={currentField.accept}
                        multiple={currentField.multiple}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
                      />
                      {formData[currentField.name] && formData[currentField.name].length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-slate-600 mb-2">Fichiers sélectionnés :</p>
                          <ul className="space-y-1">
                            {formData[currentField.name].map((file, index) => (
                              <li key={index} className="text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded flex justify-between items-center">
                                <span className="truncate">{file.name}</span>
                                <span className="text-slate-500 ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <input
                      type={currentField.type}
                      name={currentField.name}
                      value={formData[currentField.name]}
                      onChange={handleInputChange}
                      required={currentField.required}
                      placeholder={currentField.placeholder}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  )}

                   {currentField.help && (
                     <p className="mt-2 text-sm text-slate-500">{currentField.help}</p>
                   )}
                 </div>

                 {/* Messages d'erreur */}
                 {error && (
                   <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                     <p className="text-red-600">{error}</p>
                   </div>
                 )}
               </div>

               {/* Boutons de navigation fixes en bas */}
               <div className="flex justify-between items-center pt-6 border-t border-slate-200">
                 <button
                   type="button"
                   onClick={handlePrevious}
                   disabled={currentStep === 0}
                   className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   Précédent
                 </button>

                 {currentStep < steps.length - 1 ? (
                   <button
                     type="button"
                     onClick={handleNext}
                     disabled={!isCurrentFieldValid()}
                     className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-black transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-800"
                   >
                     Suivant
                   </button>
                 ) : (
                   <button
                     type="submit"
                     disabled={isLoading || !isCurrentFieldValid()}
                     className="px-8 py-3 bg-slate-800 text-white rounded-lg hover:bg-black transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {isLoading ? "Envoi en cours..." : "Envoyer ma demande"}
                   </button>
                 )}
               </div>
             </div>
           </form>
        </div>
      </div>
    </div>
  );
}
