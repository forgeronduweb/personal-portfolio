import "@fontsource/poppins";

export default function CustomSiteSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
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
           <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8">
                         {/* Success Icon */}
             <div className="text-center mb-6">
               <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                 <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
               </div>
                              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                  Demande envoyée !
                </h1>
               <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                 Merci pour votre confiance. Nous avons bien reçu votre demande de site sur mesure.
               </p>
             </div>

                         {/* Next Steps */}
             <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border border-blue-100">
               <h2 className="text-xl font-semibold text-blue-900 mb-4 text-center">
                 Prochaines étapes
               </h2>
               <div className="grid md:grid-cols-3 gap-4">
                                 <div className="text-center">
                   <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                     <span className="text-xl font-bold text-blue-600">1</span>
                   </div>
                   <h3 className="font-semibold text-blue-900 mb-1 text-sm">Analyse du projet</h3>
                   <p className="text-blue-700 text-xs">Nous étudions votre demande en détail</p>
                 </div>
                 <div className="text-center">
                   <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                     <span className="text-xl font-bold text-blue-600">2</span>
                   </div>
                   <h3 className="font-semibold text-blue-900 mb-1 text-sm">Devis personnalisé</h3>
                   <p className="text-blue-700 text-xs">Vous recevrez un devis sous 24-48h</p>
                 </div>
                 <div className="text-center">
                   <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                     <span className="text-xl font-bold text-blue-600">3</span>
                   </div>
                   <h3 className="font-semibold text-blue-900 mb-1 text-sm">Consultation</h3>
                   <p className="text-blue-700 text-xs">Appel pour discuter de votre projet</p>
                 </div>
              </div>
            </div>

                         {/* Action Cards */}
             <div className="grid md:grid-cols-2 gap-4 mb-0">
                             {/* Portfolio Card */}
               <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200">
                 <div className="flex items-center mb-3">
                   <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center mr-3">
                     <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                     </svg>
                   </div>
                   <h3 className="text-lg font-semibold text-slate-900">Découvrir nos réalisations</h3>
                 </div>
                 <p className="text-slate-600 mb-3 text-sm">
                   Explorez notre portfolio pour voir des projets similaires et vous inspirer pour votre site.
                 </p>
                                 <button
                   onClick={() => {
                     const event = new CustomEvent('navigate', { detail: 'portfolio' });
                     window.dispatchEvent(event);
                   }}
                   className="w-full bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                 >
                   Voir le portfolio
                 </button>
              </div>

                             {/* Home Card */}
               <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
                 <div className="flex items-center mb-3">
                   <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                     <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                     </svg>
                   </div>
                   <h3 className="text-lg font-semibold text-blue-900">Retour à l'accueil</h3>
                 </div>
                 <p className="text-blue-700 mb-3 text-sm">
                   Découvrez nos autres services et en savoir plus sur notre expertise.
                 </p>
                                 <button
                   onClick={() => {
                     const event = new CustomEvent('navigate', { detail: 'home' });
                     window.dispatchEvent(event);
                   }}
                   className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                 >
                   Retour à l'accueil
                 </button>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
}
