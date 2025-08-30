import "@fontsource/poppins";

export default function CustomSiteSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
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

             <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
         <div className="max-w-4xl mx-auto">
           {/* Success Card */}
           <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8 relative overflow-hidden">
             {/* Decorative elements */}
             <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full -translate-y-10 translate-x-10 opacity-40"></div>
             <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-gray-100 to-gray-200 rounded-full translate-y-8 -translate-x-8 opacity-25"></div>
                         {/* Success Icon */}
             <div className="text-center mb-8 relative z-10">
               <div className="relative inline-block mb-6">
                 <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-black rounded-full flex items-center justify-center mx-auto shadow-lg transform hover:scale-105 transition-transform duration-300">
                   <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                   </svg>
                 </div>
                 <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full blur opacity-15 animate-pulse"></div>
               </div>
               <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-black mb-4 tracking-tight">
                 Demande reçue avec succès
               </h1>
               <div className="w-16 h-0.5 bg-gradient-to-r from-gray-400 to-gray-600 mx-auto mb-4 rounded-full"></div>
               <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                 Merci de nous faire confiance pour votre projet. Votre demande de site sur mesure a été transmise à notre équipe d'experts.
               </p>
             </div>

                         {/* Next Steps */}
             <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 mb-6 border border-gray-200 shadow-inner relative z-10">
               <div className="text-center">
                 <h2 className="text-lg font-bold text-gray-900 mb-6">
                   Ce qui va se passer maintenant
                 </h2>
                 <div className="grid md:grid-cols-3 gap-4">
                   <div className="group">
                     <div className="relative">
                       <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
                         1
                       </div>
                       <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                     </div>
                     <h3 className="font-semibold text-gray-900 mb-1 text-sm">Analyse approfondie</h3>
                     <p className="text-gray-600 text-xs">Nous étudions votre demande en détail</p>
                   </div>
                   <div className="group">
                     <div className="relative">
                       <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
                         2
                       </div>
                       <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                     </div>
                     <h3 className="font-semibold text-gray-900 mb-1 text-sm">Devis personnalisé</h3>
                     <p className="text-gray-600 text-xs">Réponse sous 24-48h par email</p>
                   </div>
                   <div className="group">
                     <div className="relative">
                       <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
                         3
                       </div>
                       <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                     </div>
                     <h3 className="font-semibold text-gray-900 mb-1 text-sm">Consultation</h3>
                     <p className="text-gray-600 text-xs">Échange téléphonique gratuit</p>
                   </div>
                 </div>
               </div>
             </div>

                         {/* Action Cards */}
             <div className="text-center relative z-10">
               <button
                 onClick={() => {
                   const event = new CustomEvent('navigate', { detail: 'home' });
                   window.dispatchEvent(event);
                 }}
                 className="group relative inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-gradient-to-r from-gray-900 to-black rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
               >
                 <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"></span>
                 <span className="relative flex items-center space-x-2">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                   </svg>
                   <span>Retour à l'accueil</span>
                 </span>
               </button>
               <p className="text-gray-500 text-xs mt-3">
                 Découvrez nos autres services et notre expertise
               </p>
             </div>

            
          </div>
        </div>
      </div>
    </div>
  );
}
