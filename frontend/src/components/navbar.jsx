import { useState, useEffect } from "react";
import "@fontsource/poppins";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    if (!menuOpen) {
      // Remettre la page en haut quand le menu s'ouvre
      window.scrollTo(0, 0);
    }
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  return (
    <nav className={`fixed top-0 left-0 right-0 flex items-center justify-between p-4 md:px-16 lg:px-24 xl:px-32 md:py-6 w-full transition-all duration-300 z-50 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <a href="#" className={`text-2xl font-bold transition-colors ${scrolled ? 'text-black' : 'text-black'}`}>
        forgeron du web
      </a>

      <div
        className={`max-md:fixed max-md:top-0 max-md:left-0 max-md:w-screen max-md:h-screen max-md:transition-all max-md:duration-700 max-md:ease-out max-md:overflow-hidden max-md:bg-white/95 max-md:backdrop-blur max-md:flex-col max-md:justify-start max-md:items-start max-md:pt-32 max-md:pl-12 max-md:gap-12 flex items-center gap-24 font-medium ${menuOpen ? "max-md:translate-x-0 max-md:opacity-100" : "max-md:-translate-x-full max-md:opacity-0"
          }`}
      >
        <a href="#" className={`max-md:text-2xl max-md:font-semibold hover:text-indigo-400 transition-all max-md:duration-300 max-md:hover:scale-105 ${scrolled ? 'text-black hover:text-indigo-600' : 'text-black hover:text-white'}`}>
          Services
        </a>
        <a href="#" className={`max-md:text-2xl max-md:font-semibold hover:text-indigo-400 transition-all max-md:duration-300 max-md:delay-100 max-md:hover:scale-105 ${scrolled ? 'text-black hover:text-indigo-600' : 'text-black hover:text-white'}`}>
          À propos
        </a>
        <a href="#" className={`max-md:text-2xl max-md:font-semibold hover:text-indigo-400 transition-all max-md:duration-300 max-md:delay-200 max-md:hover:scale-105 ${scrolled ? 'text-black hover:text-indigo-600' : 'text-black hover:text-white'}`}>
          Blog
        </a>
        
        <button
          onClick={() => setMenuOpen(false)}
          className="md:hidden absolute top-4 right-4 bg-slate-800 hover:bg-black text-white p-2 rounded-md aspect-square font-medium transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <button className="hidden md:block bg-slate-800 hover:bg-black text-white px-6 py-3 rounded-full font-medium transition">
        Me contacter
      </button>

      <button
        onClick={toggleMenu}
        className="md:hidden bg-slate-800 hover:bg-black text-white p-2 rounded-md aspect-square font-medium transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12h16" />
          <path d="M4 18h16" />
          <path d="M4 6h16" />
        </svg>
      </button>
    </nav>
  );
}
