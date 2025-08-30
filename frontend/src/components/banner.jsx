import "@fontsource/poppins";
import { useState } from "react";
import NewsletterModal from "./NewsletterModal";

export default function Banner() {
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  return (
    <section className="bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gridBackground.png')] w-full bg-no-repeat bg-cover bg-center text-sm pb-20 md:pb-44 pt-16 md:pt-32 px-4 sm:px-6 md:px-12 lg:px-20 min-h-screen flex flex-col justify-center">
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-indigo-200 hover:border-indigo-300 rounded-full w-fit max-w-[90%] mx-auto px-4 sm:px-5 py-3 mt-8 md:mt-12 shadow-md">
        <span className="text-sm xs:text-base sm:text-lg md:text-xl text-slate-700 font-medium">Dernières nouveautés? </span>
        <button 
          onClick={() => setIsNewsletterOpen(true)}
          className="flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          <span className="text-sm xs:text-base sm:text-lg md:text-xl">En savoir plus</span>
          <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.959 9.5h11.083m0 0L9.501 3.958M15.042 9.5l-5.541 5.54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <h5 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold max-w-[95%] sm:max-w-[500px] md:max-w-[800px] lg:max-w-[1000px] xl:max-w-[1200px] text-center mx-auto mt-6 xs:mt-8 leading-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent px-2">
        Obtenez un site web qui attire<br />vos clients dès aujourd'hui
      </h5>

      <p className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl mx-auto max-w-[95%] xs:max-w-[90%] sm:max-w-2xl md:max-w-3xl text-center mt-6 xs:mt-8 sm:mt-10 text-slate-700 leading-relaxed px-2">
        <span className="font-bold text-slate-900">Forgeron du Web</span> analyse vos besoins et vous propose le site web le plus adapté pour votre activité afin de maximiser vos clients, que vous choisissiez la <strong>location</strong>, l'<strong>achat</strong> ou la <strong>création sur mesure</strong>.
      </p>

      <div className="mx-auto w-full flex items-center justify-center mt-12 xs:mt-16 sm:mt-20 px-4">
        <button 
          onClick={() => {
            const event = new CustomEvent('navigate', { detail: 'custom-site-form' });
            window.dispatchEvent(event);
          }}
          className="bg-slate-800 hover:bg-black text-white px-6 xs:px-8 sm:px-10 py-3 xs:py-4 sm:py-5 rounded-full font-medium transition text-base xs:text-lg sm:text-xl md:text-2xl"
        >
          Obtenir mon devis gratuit
        </button>
      </div>

      {/* Modal Newsletter */}
      <NewsletterModal 
        isOpen={isNewsletterOpen} 
        onClose={() => setIsNewsletterOpen(false)} 
      />
    </section>
  );
}