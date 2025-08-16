import "@fontsource/poppins";

export default function ProjectSuccess() {
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
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Projet envoyé avec succès !
            </h1>
            <p className="text-lg text-slate-600 mb-6">
              Merci pour votre confiance. Nous avons bien reçu votre demande de projet sur mesure.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                Prochaines étapes
              </h2>
              <ul className="text-left space-y-2 text-blue-800">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span>Nous analysons votre projet en détail</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span>Vous recevrez un devis personnalisé par email sous 24-48h</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span>Nous planifierons un appel pour discuter de votre projet</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                En attendant votre devis...
              </h3>
              <p className="text-slate-600 mb-4">
                Découvrez nos réalisations et inspirez-vous de nos projets précédents pour affiner vos idées.
              </p>
              <button
                onClick={() => {
                  const event = new CustomEvent('navigate', { detail: 'portfolio' });
                  window.dispatchEvent(event);
                }}
                className="w-full bg-slate-800 hover:bg-black text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Voir le portfolio
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  const event = new CustomEvent('navigate', { detail: 'home' });
                  window.dispatchEvent(event);
                }}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Retour à l'accueil
              </button>
              <button
                onClick={() => {
                  const event = new CustomEvent('navigate', { detail: 'project-form' });
                  window.dispatchEvent(event);
                }}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Nouveau projet
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <p className="text-slate-600 mb-2">
              Des questions ? Contactez-nous directement :
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-slate-600">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                contact@forgeronduweb.com
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +33 1 23 45 67 89
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
