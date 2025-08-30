import "@fontsource/poppins";
import profileImage from "../assets/id.jpg";

export default function About() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-16">
            <div className="text-base text-slate-600 max-w-2xl h-full flex flex-col">
              <h1 className="text-3xl md:text-4xl font-semibold text-slate-700 mb-3">
                Salut ! c'est Evrard 🫡
              </h1>
              <div className="w-24 h-[3px] rounded-full bg-gradient-to-r from-indigo-600 to-[#DDD9FF] mb-3"></div>

              <p className="mt-3 leading-relaxed">
                En tant que freelance créatif, vous savez à quel point il est crucial d'avoir une présence en ligne qui reflète votre talent. Mais créer un portfolio professionnel peut être <strong>coûteux</strong>, <strong>chronophage</strong> et <strong>technique</strong>.
              </p>
              <p className="mt-3 leading-relaxed">
                Trop de designers UI, community managers, infographistes et autres créatifs perdent des opportunités faute d'un portfolio en ligne percutant. Pendant ce temps, gérer ses projets, ses clients et sa comptabilité devient un véritable casse-tête.
              </p>
              <p className="mt-3 leading-relaxed">
                C'est pourquoi <strong>Forgeron du Web</strong> existe : une plateforme tout-en-un conçue spécialement pour les freelances créatifs. Créez votre portfolio en quelques clics, gérez vos projets, suivez vos revenus et développez votre activité.
              </p>
              <p className="mt-3 leading-relaxed">
                Besoin d'un site unique ? Notre équipe crée des portfolios sur mesure qui mettent en valeur votre créativité et attirent vos clients idéaux.
              </p>
              <p className="mt-4 font-semibold leading-relaxed">
                Ma mission : <em>donner aux freelances créatifs les outils pour réussir en ligne et gérer efficacement leur activité.</em>
              </p>
            </div>

            <div className="relative shadow-2xl shadow-indigo-600/40 rounded-2xl overflow-hidden shrink-0">
              <img
                className="max-w-md w-full object-cover rounded-2xl"
                src={profileImage}
                alt="Photo de profil d'Evrard"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
