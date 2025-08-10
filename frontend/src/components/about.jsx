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
                On part tous du même constat : avoir un site web professionnel est aujourd'hui indispensable pour exister en ligne… mais ça peut vite devenir <strong>cher</strong>, <strong>long</strong> et <strong>compliqué</strong>.
              </p>
              <p className="mt-3 leading-relaxed">
                Beaucoup d'entreprises repoussent leur projet faute de temps ou de budget. Pendant ce temps, designers UI, community managers, infographistes et autres freelances se font recaler par des clients ou recruteurs car ils n'ont pas de portfolio en ligne.
              </p>
              <p className="mt-3 leading-relaxed">
                C'est pour changer ça que <strong>Forgeron du Web</strong> existe : une plateforme pensée pour vous permettre de lancer votre site en un rien de temps grâce à des templates prêts à l'emploi, optimisés pour vos besoins spécifiques.
              </p>
              <p className="mt-3 leading-relaxed">
                Vous préférez un site unique ? Pas de problème, vous pouvez aussi demander une création sur mesure, personnalisée à votre image.
              </p>
              <p className="mt-4 font-semibold leading-relaxed">
                Ma mission est simple : <em>rendre le web professionnel accessible à tous, sans compromis sur la qualité, la performance ou le design.</em>
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
