import { useState } from "react";
import "@fontsource/poppins";
import { authService } from "../services/api";

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let response;
      if (isLogin) {
        // Connexion via l'API
        response = await authService.login({
          email: formData.email,
          password: formData.password
        });
      } else {
        // Inscription via l'API
        response = await authService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }

      // Rediriger vers le dashboard avec les données utilisateur
      onLogin(response.user);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message || "Une erreur inattendue s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            {isLogin ? "Connexion" : "Inscription"}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {isLogin 
              ? "Connectez-vous à votre compte" 
              : "Créez votre compte gratuitement"
            }
          </p>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Formulaire */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Nom complet
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={!isLogin}
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre nom complet"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Pour personnaliser tes communications
                </p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="votre@email.com"
              />
              <p className="mt-1 text-xs text-slate-500">
                Indispensable pour envoyer l'accès et relancer plus tard
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Votre mot de passe"
              />
              <p className="mt-1 text-xs text-slate-500">
                Pour que l'utilisateur puisse se reconnecter
              </p>
            </div>
          </div>

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-800 hover:bg-black disabled:bg-slate-400 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isLogin ? "Connexion..." : "Inscription..."}
              </span>
            ) : (
              isLogin ? "Se connecter" : "S'inscrire"
            )}
          </button>

          {/* Lien de basculement */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              disabled={isLoading}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 disabled:opacity-50"
            >
              {isLogin 
                ? "Pas encore de compte ? S'inscrire" 
                : "Déjà un compte ? Se connecter"
              }
            </button>
          </div>
        </form>

        {/* Retour à l'accueil */}
        <div className="text-center">
          <button
            onClick={() => {
              const event = new CustomEvent('navigate', { detail: 'home' });
              window.dispatchEvent(event);
            }}
            disabled={isLoading}
            className="text-sm text-slate-600 hover:text-slate-800 font-medium transition-colors duration-200 disabled:opacity-50"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}
