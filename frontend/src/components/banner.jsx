import "@fontsource/poppins";
import { useState } from "react";
import NewsletterModal from "./NewsletterModal";

export default function Banner() {
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  return (
    <section className="bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gridBackground.png')] w-full bg-no-repeat bg-cover bg-center text-sm pb-44 pt-32">
      <div className="flex items-center gap-2 border border-slate-300 hover:border-slate-400/70 rounded-full w-max mx-auto px-4 py-2 mt-20 md:mt-12">
        <span>Dernières nouveautés? </span>
        <button 
          onClick={() => setIsNewsletterOpen(true)}
          className="flex items-center gap-1 font-medium hover:text-indigo-600 transition-colors"
        >
          <span>En savoir plus</span>
          <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.959 9.5h11.083m0 0L9.501 3.958M15.042 9.5l-5.541 5.54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <h5 className="text-4xl md:text-7xl font-medium max-w-[850px] text-center mx-auto mt-8">
        Votre présence digitale, réinventée avec audace et précision.
      </h5>

      <p className="text-sm md:text-base mx-auto max-w-2xl text-center mt-10 max-md:px-2">
        Alliant design soigné et technologie performante, nous créons des sites qui reflètent votre identité et captivent votre audience.
      </p>

      <div className="mx-auto w-full flex items-center justify-center mt-20">
        <button 
          onClick={() => {
            const event = new CustomEvent('navigate', { detail: 'custom-site-form' });
            window.dispatchEvent(event);
          }}
          className="bg-slate-800 hover:bg-black text-white px-6 py-3 rounded-full font-medium transition"
        >
          Commencer
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