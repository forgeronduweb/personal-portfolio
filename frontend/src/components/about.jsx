import "@fontsource/poppins";
import profileImage from "../assets/id.jpg";

export default function About() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-center gap-10 max-md:px-4 py-16">
      <div className="text-base text-slate-600 max-w-lg">
        <h1 className="text-2xl font-semibold text-slate-700">Salut ! c'est Evrard 🫡</h1>
        <div className="w-24 h-[3px] rounded-full bg-gradient-to-r from-indigo-600 to-[#DDD9FF]"></div>

        <p className="mt-8 leading-relaxed">
          On part tous du même constat : avoir un site web professionnel est aujourd’hui indispensable pour exister en ligne… mais c’est souvent <strong>cher</strong>, <strong>long</strong> et <strong>compliqué</strong>.
        </p>
        <p className="mt-4">
          Beaucoup d’entrepreneurs, de créateurs et même de petites entreprises repoussent leur projet faute de budget ou de temps. Résultat ? Ils perdent des clients potentiels et de la crédibilité.
        </p>
        <p className="mt-4">
          C’est pour changer ça que nous avons créé <strong>FDW</strong>. Une plateforme où vous pouvez :
        </p>
        <ul className="list-disc list-inside text-slate-600 mt-4 mb-4 space-y-1">
          <li><strong>Lancer votre site en quelques clics</strong> grâce à des templates prêts à l’emploi, optimisés pour vos besoins.</li>
          <li><strong>Demander une création sur mesure</strong> si vous voulez un design unique et personnalisé.</li>
        </ul>
        <p className="mt-4 font-semibold">
          Notre mission : <em>rendre le web professionnel accessible à tous</em>, sans compromis sur la qualité, la performance ou le design.
        </p>
      </div>

      <div className="relative shadow-2xl shadow-indigo-600/40 rounded-2xl overflow-hidden shrink-0">
        <img
          className="max-w-md w-full object-cover rounded-2xl"
          src={profileImage}
          alt="Photo de profil d'Evrard"
        />
      </div>
    </section>
  );
}
