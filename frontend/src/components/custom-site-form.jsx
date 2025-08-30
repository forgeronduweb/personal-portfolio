import { useState } from "react";
import "@fontsource/poppins";

export default function CustomSiteForm({ onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    purpose: "",
    pages: "",
    inspiration: "",
    designFiles: [],
    timeline: "",
    budget: ""
  });

  const steps = [
    {
      title: "Votre e-mail pour vous recontacter",
      field: {
        name: "email",
        label: "Saisissez votre adresse e-mail pour que nous puissions vous recontacter avec votre devis personnalisé",
        type: "email",
        placeholder: "votre@email.com",
        required: true
      }
    },
    {
      title: "À quoi servira principalement votre site ?",
      field: {
        name: "purpose",
        label: "Décrivez l'objectif principal de votre site web (présentation, vente, génération de leads, etc.)",
        type: "text",
        placeholder: "Ex: Présenter mon activité, vendre en ligne, gagner des clients...",
        required: true
      }
    },
    {
      title: "Pages ou sections souhaitées",
      field: {
        name: "pages",
        label: "Listez les pages et sections que vous souhaitez absolument avoir sur votre site",
        type: "textarea",
        placeholder: "(ex. : Accueil, À propos, Services/Produits, Contact…)",
        required: true
      }
    },
    {
      title: "Style et inspiration",
      field: {
        name: "inspiration",
        label: "Partagez vos idées de style, couleurs préférées ou des exemples de sites qui vous inspirent",
        type: "textarea",
        placeholder: "Décrivez le style souhaité ou donnez des exemples de sites que vous aimez...",
        required: false
      }
    },
    {
      title: "Design ou maquette",
      field: {
        name: "designFiles",
        label: "Uploadez une archive contenant vos maquettes, designs ou références visuelles si vous en avez",
        type: "file",
        accept: ".zip,.rar",
        multiple: false,
        required: false,
        help: "Formats acceptés : Archives ZIP ou RAR contenant vos designs, maquettes ou références visuelles. Maximum 1 fichier de 50MB."
      }
    },
    {
      title: "Délai souhaité",
      field: {
        name: "timeline",
        label: "Indiquez dans quel délai vous aimeriez que votre site soit prêt et en ligne",
        type: "select",
        options: [
          { value: "", label: "Sélectionnez votre délai préféré" },
          { value: "asap", label: "Le plus tôt possible (1-2 semaines)" },
          { value: "urgent", label: "Urgent (3-4 semaines)" },
          { value: "normal", label: "Normal (1-2 mois)" },
          { value: "relaxed", label: "Pas pressé (2-3 mois)" },
          { value: "flexible", label: "Flexible selon vos disponibilités" }
        ],
        required: true
      }
    },
    {
      title: "Budget prévu",
      field: {
        name: "budget",
        label: "Sélectionnez la fourchette de budget que vous avez prévue pour ce projet",
        type: "select",
        options: [
          { value: "", label: "Sélectionnez votre budget" },
          { value: "under-200k", label: "Moins de 200 000 FCFA" },
          { value: "200k-400k", label: "200 000 - 400 000 FCFA" },
          { value: "400k-600k", label: "400 000 - 600 000 FCFA" },
          { value: "600k-1m", label: "600 000 - 1 000 000 FCFA" },
          { value: "1m-1.5m", label: "1 000 000 - 1 500 000 FCFA" },
          { value: "over-1.5m", label: "Plus de 1 500 000 FCFA" },
          { value: "discuss", label: "À discuter selon les fonctionnalités" }
        ],
        required: true
      }
    },
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
        if (key !== 'designFiles') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Ajouter les fichiers
      if (formData.designFiles && formData.designFiles.length > 0) {
        formData.designFiles.forEach(file => {
          formDataToSend.append('designFiles', file);
        });
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/site-requests`, {
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
    
    // Pour les fichiers, toujours valide car optionnel
    if (currentField.type === "file") {
      return true;
    }
    
    // Pour les champs requis, vérifier qu'ils ne sont pas vides
    if (currentField.required) {
      if (currentField.type === "select") {
        return fieldValue && fieldValue !== "";
      }
      return fieldValue && fieldValue.trim() !== "";
    }
    
    return true;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center">
      <div className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          {/* Barre de progression */}
          <div className="w-full">
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

          {/* Formulaire adaptatif */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 sm:p-10 w-full">
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 text-center leading-tight">
                {currentStepData.title}
              </h2>

              <div className="space-y-4">
                <label className="block text-base font-medium text-slate-700">
                  {currentField.label}
                  {currentField.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                   {currentField.type === "select" ? (
                     <div className="relative">
                       <select
                         name={currentField.name}
                         value={formData[currentField.name]}
                         onChange={handleInputChange}
                         required={currentField.required}
                         className="w-full px-6 py-4 pr-12 border-2 border-slate-200 rounded-2xl focus:border-blue-400 focus:outline-none transition-all duration-300 text-base bg-gradient-to-r from-white to-slate-50 hover:from-slate-50 hover:to-white appearance-none cursor-pointer shadow-sm hover:shadow-md"
                         style={{
                           backgroundImage: 'none'
                         }}
                       >
                         {currentField.options.map((option, optionIndex) => (
                           <option 
                             key={optionIndex} 
                             value={option.value} 
                             className="bg-white py-4 px-4 text-slate-700 hover:bg-blue-50 hover:text-blue-700 border-b border-slate-100 last:border-b-0"
                             style={{
                               padding: '12px 16px',
                               backgroundColor: option.value === '' ? '#f8fafc' : '#ffffff',
                               color: option.value === '' ? '#64748b' : '#334155',
                               fontWeight: option.value === '' ? '500' : '400'
                             }}
                           >
                             {option.label}
                           </option>
                         ))}
                       </select>
                       <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                         <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                           <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                           </svg>
                         </div>
                       </div>
                     </div>
                   ) : currentField.type === "textarea" ? (
                     <textarea
                       name={currentField.name}
                       value={formData[currentField.name]}
                       onChange={handleInputChange}
                       required={currentField.required}
                       placeholder={currentField.placeholder}
                       rows={4}
                       className="w-full px-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none text-base bg-slate-50 focus:bg-white"
                     />
                   ) : currentField.type === "file" ? (
                    <div>
                      <input
                        type="file"
                        name={currentField.name}
                        onChange={handleInputChange}
                        accept={currentField.accept}
                        multiple={currentField.multiple}
                        className="w-full px-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
                      className="w-full px-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base bg-slate-50 focus:bg-white"
                    />
                  )}

                   {currentField.help && (
                     <p className="mt-2 text-sm text-slate-500">{currentField.help}</p>
                   )}
              </div>

              {/* Messages d'erreur */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-base">{error}</p>
                </div>
              )}

              {/* Boutons de navigation */}
              <div className="flex justify-between items-center pt-8 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="px-8 py-4 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-base"
                >
                  Précédent
                </button>

                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isCurrentFieldValid()}
                    className="px-8 py-4 bg-slate-800 text-white rounded-xl hover:bg-black transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-800 text-base"
                  >
                    Suivant
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading || !isCurrentFieldValid()}
                    className="px-10 py-4 bg-slate-800 text-white rounded-xl hover:bg-black transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-base"
                  >
                    {isLoading ? "Envoi..." : "Envoyer ma demande"}
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
