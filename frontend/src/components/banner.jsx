import { useState } from "react";
import "@fontsource/poppins";

export default function Banner() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section className="bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gridBackground.png')] w-full bg-no-repeat bg-cover bg-center text-sm pb-44">
      <nav className="flex items-center justify-between p-4 md:px-16 lg:px-24 xl:px-32 md:py-6 w-full ">
        <a href="#" className="text-2xl font-bold">
          FDW
        </a>

        <div
          className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:transition-all max-md:duration-300 max-md:overflow-hidden max-md:h-full max-md:bg-white/50 max-md:backdrop-blur max-md:flex-col max-md:justify-center flex items-center gap-8 font-medium ${menuOpen ? "max-md:w-full" : "max-md:w-0"
            }`}
        >
          <a href="#" className="hover:text-gray-600">
            Services
          </a>
          <a href="#" className="hover:text-gray-600">
            À propos
          </a>
          <a href="#" className="hover:text-gray-600">
            Blog
          </a>
          <button
            onClick={() => setMenuOpen(false)}
            className="md:hidden bg-gray-800 hover:bg-black text-white p-2 rounded-md aspect-square font-medium transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <button className="hidden md:block bg-gray-800 hover:bg-black text-white px-6 py-3 rounded-full font-medium transition">
          Me contacter
        </button>

        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden bg-gray-800 hover:bg-black text-white p-2 rounded-md aspect-square font-medium transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12h16" />
            <path d="M4 18h16" />
            <path d="M4 6h16" />
          </svg>
        </button>
      </nav>

      <div className="flex items-center gap-2 border border-slate-300 hover:border-slate-400/70 rounded-full w-max mx-auto px-4 py-2 mt-40 md:mt-32">
        <span>Dernières nouveautés? </span>
        <button className="flex items-center gap-1 font-medium">
          <span>En savoir plus</span>
          <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.959 9.5h11.083m0 0L9.501 3.958M15.042 9.5l-5.541 5.54" stroke="#050040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <h5 className="text-4xl md:text-7xl font-medium max-w-[850px] text-center mx-auto mt-8">
        Votre présence digitale, réinventée avec audace et précision.
      </h5>

      <p className="text-sm md:text-base mx-auto max-w-2xl text-center mt-10 max-md:px-2">
        Alliant design soigné et technologie performante, nous créons des sites qui reflètent votre identité et captivent votre audience.
      </p>

      <div className="mx-auto w-full flex items-center justify-center gap-3 mt-20">
        <button className="bg-slate-800 hover:bg-black text-white px-6 py-3 rounded-full font-medium transition">
          Commencer
        </button>
        <button className="flex items-center gap-2 border border-slate-300 hover:bg-slate-200/30 rounded-full px-6 py-3">
          <span>Découvrir</span>
          <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.25.5 4.75 4l-3.5 3.5" stroke="#050040" strokeOpacity=".4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}