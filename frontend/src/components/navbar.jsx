import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur">
      <div className="flex items-center justify-between p-4 md:px-16 lg:px-24 xl:px-32 md:py-6">
        <a href="#" className="text-2xl font-bold">
          FDW
        </a>
        
        <div className={`max-md:fixed max-md:top-0 max-md:left-0 max-md:h-screen max-md:w-full max-md:bg-white/95 max-md:backdrop-blur flex items-center gap-8 font-medium transition-all duration-300 ${
          menuOpen ? "max-md:translate-x-0" : "max-md:translate-x-full"
        }`}>
          <div className="flex md:items-center max-md:flex-col max-md:h-full max-md:justify-center gap-8">
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
        </div>

        <div className="flex items-center gap-4">
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
        </div>
      </div>
    </nav>
  );
}
