import "@fontsource/poppins";

export default function Banner() {
  return (
    <section className="bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gridBackground.png')] w-full bg-no-repeat bg-cover bg-center text-sm pb-44 pt-24">{/* pt-24 pour compenser la navbar fixe */}

      <div className="flex items-center gap-2 border border-slate-300 hover:border-slate-400/70 rounded-full w-max mx-auto px-4 py-2 mt-40 md:mt-32">
        <span>Dernières nouveautés directement chez vous</span>
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