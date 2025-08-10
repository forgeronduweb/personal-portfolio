import { useState } from "react";
import { 
  SiReact, 
  SiNextdotjs, 
  SiNodedotjs, 
  SiMongodb, 
  SiTailwindcss, 
  SiTypescript, 
  SiJavascript, 
  SiHtml5, 
  SiCss3, 
  SiPhp, 
  SiMysql,
  SiWordpress,
  SiFigma,
  SiAdobexd,
  SiGit,
  SiDocker,
  SiFirebase,
  SiVuedotjs,
  SiAngular,
  SiLaravel,
  SiGithub,
  SiSass
} from "react-icons/si";

const portfolioItems = [
  {
    image: "/img_1.jpg",
    title: "Site E-commerce Moderne",
    category: "Boutique en ligne",
    alt: "Site e-commerce avec design moderne",
    technologies: [
      { name: "React", icon: SiReact, color: "text-blue-500" },
      { name: "Tailwind", icon: SiTailwindcss, color: "text-cyan-500" },
      { name: "Node.js", icon: SiNodedotjs, color: "text-green-600" }
    ]
  },
  {
    image: "/img_2.jpg",
    title: "Portfolio Créatif",
    category: "Site vitrine",
    alt: "Portfolio avec animations créatives",
    technologies: [
      { name: "Vue.js", icon: SiVuedotjs, color: "text-emerald-500" },
      { name: "GSAP", icon: SiGithub, color: "text-purple-600" },
      { name: "SCSS", icon: SiSass, color: "text-pink-500" }
    ]
  },
  {
    image: "/img_3.jpg",
    title: "Application Web Responsive",
    category: "Application métier",
    alt: "Application web responsive moderne",
    technologies: [
      { name: "Next.js", icon: SiNextdotjs, color: "text-gray-800" },
      { name: "TS", icon: SiTypescript, color: "text-blue-600" },
      { name: "MongoDB", icon: SiMongodb, color: "text-green-500" }
    ]
  },
  {
    image: "/img_1.jpg",
    title: "Blog Technologique",
    category: "Blog",
    alt: "Blog avec système de gestion de contenu",
    technologies: [
      { name: "React", icon: SiReact, color: "text-blue-500" },
      { name: "Node.js", icon: SiNodedotjs, color: "text-green-600" },
      { name: "MySQL", icon: SiMysql, color: "text-blue-600" }
    ]
  },
  {
    image: "/img_2.jpg",
    title: "Dashboard Analytics",
    category: "Dashboard",
    alt: "Tableau de bord interactif",
    technologies: [
      { name: "Vue.js", icon: SiVuedotjs, color: "text-green-500" },
      { name: "Firebase", icon: SiFirebase, color: "text-orange-500" },
      { name: "Chart.js", icon: SiJavascript, color: "text-yellow-500" }
    ]
  },
  {
    image: "/img_3.jpg",
    title: "Application Mobile Web",
    category: "Mobile",
    alt: "Application web progressive",
    technologies: [
      { name: "React", icon: SiReact, color: "text-blue-500" },
      { name: "PWA", icon: SiJavascript, color: "text-yellow-500" },
      { name: "Firebase", icon: SiFirebase, color: "text-orange-500" }
    ]
  }
];



export default function PortfolioPage() {

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
                                                       <div className="bg-white">
                                                                       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Mes Réalisations
            </h1>
             <p className="text-lg text-slate-600 mb-0">
               Découvrez une sélection de mes projets web, du design à la mise en production
             </p>
          </div>
        </div>
      </div>

                                   {/* Grille des projets */}
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
                  <div className="max-w-6xl mx-auto">
                                                                                                                                                                                                               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 -mt-16">
            {portfolioItems.map((item, index) => (
              <div key={index} className="w-full group cursor-pointer">
                <div className="overflow-hidden rounded-xl aspect-video bg-gray-100 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <img 
                    className="w-full h-full object-cover transform transition duration-300 group-hover:scale-105" 
                    src={item.image} 
                    alt={item.alt}
                    loading="lazy"
                  />
                </div>
                <div className="mt-6">
                  <h3 className="text-lg text-slate-900 font-medium group-hover:text-indigo-600 transition">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-sm text-indigo-600 font-medium">{item.category}</p>
                    <div className="flex items-center gap-2">
                      {item.technologies.slice(0, 3).map((tech, techIndex) => {
                        const IconComponent = tech.icon;
                        return (
                          <span key={techIndex} className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-md font-medium hover:bg-gray-100 transition-colors">
                            <IconComponent className={`w-4 h-4 ${tech.color}`} />
                            <span className="text-gray-700 whitespace-nowrap">{tech.name}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>


        </div>
      </div>


    </div>
  );
}
