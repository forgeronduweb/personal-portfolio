import profileImageJpg from "../assets/id.jpg";

export default function About() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-center gap-16 max-md:px-4 py-16 mx-[5px]">

      <div className="text-base text-slate-600 max-w-lg">
        <h1 className="text-2xl font-semibold text-slate-700">Salut ! c'est Evrard 🫡</h1>
        <div className="w-24 h-[3px] rounded-full bg-gradient-to-r from-indigo-600 to-[#DDD9FF]"></div>

        <p className="mt-8 leading-relaxed">
          On part tous du même constat : avoir un site web professionnel est aujourd’hui indispensable pour exister en ligne… mais ça peut vite devenir <strong>cher</strong>, <strong>long</strong> et <strong>compliqué</strong>.
        </p>
        <p className="mt-4 leading-relaxed">
          Beaucoup d’entreprises repoussent leur projet faute de temps ou de budget. Pendant ce temps, designers UI, community managers, infographistes et autres freelances se font recaler par des clients ou recruteurs car ils n’ont pas de portfolio en ligne.
        </p>
        <p className="mt-4 leading-relaxed">
          C’est pour changer ça que <strong>Forgeron du Web</strong> existe : une plateforme pensée pour vous permettre de lancer votre site en un rien de temps grâce à des templates prêts à l’emploi, optimisés pour vos besoins spécifiques.
        </p>
        <p className="mt-4 leading-relaxed">
          Vous préférez un site unique ? Pas de problème, vous pouvez aussi demander une création sur mesure, personnalisée à votre image.
        </p>
        <p className="mt-6 font-semibold leading-relaxed">
          Ma mission est simple : <em>rendre le web professionnel accessible à tous, sans compromis sur la qualité, la performance ou le design.</em>
        </p>
      </div>

      <div className="relative shadow-2xl shadow-indigo-600/40 rounded-2xl overflow-hidden shrink-0">
        <picture>
          <source srcSet={new URL('../assets/id-1024.webp', import.meta.url).href} type="image/webp" media="(min-width: 1024px)" />
          <source srcSet={new URL('../assets/id-768.webp', import.meta.url).href} type="image/webp" media="(min-width: 768px)" />
          <source srcSet={new URL('../assets/id-480.webp', import.meta.url).href} type="image/webp" />
          <img
            className="max-w-md w-full object-cover rounded-2xl"
            src={profileImageJpg}
            alt="Photo de profil d'Evrard"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
          />
        </picture>
      </div>
    </section>
  );
}
