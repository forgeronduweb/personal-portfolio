# Interface d'Administration

Cette interface d'administration permet de gérer votre application portfolio depuis un panneau de contrôle moderne et intuitif.

## 🚀 Fonctionnalités

### 🔐 Authentification
- Connexion sécurisée pour les administrateurs uniquement
- Gestion des sessions avec tokens JWT
- Protection des routes d'administration

### 📊 Tableau de bord
- Statistiques en temps réel (utilisateurs totaux, premium, admins)
- Vue d'ensemble de l'activité de l'application
- Actions rapides pour la gestion

### 👥 Gestion des utilisateurs
- Liste complète de tous les utilisateurs
- Modification des informations utilisateur
- Gestion des statuts premium
- Attribution des rôles (utilisateur/admin)

## 🛠️ Installation et démarrage

### Prérequis
- Node.js (version 16 ou supérieure)
- Backend MongoDB en cours d'exécution sur le port 5000

### Installation des dépendances
```bash
npm install
```

### Démarrage en mode développement
```bash
npm run dev
```

L'interface sera accessible sur `http://localhost:5173`

## 🔧 Configuration

### Variables d'environnement
L'interface se connecte par défaut à `http://localhost:5000/api`. Pour modifier cette URL :

1. Éditez `src/services/api.js`
2. Modifiez la constante `API_BASE_URL`

### Backend requis
Assurez-vous que votre backend expose les endpoints suivants :

- `POST /api/auth/login` - Connexion administrateur
- `GET /api/admin/stats` - Statistiques de l'application
- `GET /api/admin/users` - Liste des utilisateurs
- `PUT /api/admin/users/:id` - Mise à jour d'un utilisateur
- `PATCH /api/admin/users/:id/premium` - Basculement du statut premium

## 🎨 Technologies utilisées

- **React 19** - Interface utilisateur moderne
- **Vite** - Build tool rapide
- **Tailwind CSS** - Framework CSS utilitaire
- **React Router** - Navigation entre les pages
- **Axios** - Client HTTP pour les appels API
- **Heroicons** - Icônes SVG de haute qualité

## 📱 Responsive Design

L'interface s'adapte automatiquement à tous les écrans :
- Desktop : Navigation latérale complète
- Tablette : Interface adaptée aux écrans moyens
- Mobile : Navigation optimisée pour les petits écrans

## 🔒 Sécurité

- Authentification JWT obligatoire
- Vérification du rôle administrateur
- Protection des routes sensibles
- Gestion automatique de la déconnexion

## 🚀 Déploiement

### Build de production
```bash
npm run build
```

### Prévisualisation du build
```bash
npm run preview
```

## 📝 Structure des composants

```
src/
├── components/
│   ├── Login.jsx          # Page de connexion
│   ├── Dashboard.jsx      # Tableau de bord principal
│   ├── Users.jsx          # Gestion des utilisateurs
│   └── Sidebar.jsx        # Navigation latérale
├── services/
│   └── api.js            # Service API centralisé
└── App.jsx               # Composant principal avec routage
```

## 🐛 Dépannage

### Problèmes de connexion
1. Vérifiez que le backend est en cours d'exécution
2. Confirmez que l'URL de l'API est correcte
3. Vérifiez que l'utilisateur a le rôle 'admin'

### Erreurs CORS
Assurez-vous que votre backend autorise les requêtes depuis `http://localhost:5173`

### Problèmes de build
1. Vérifiez que toutes les dépendances sont installées
2. Nettoyez le cache : `npm run build --force`

## 🤝 Contribution

Pour contribuer à l'amélioration de cette interface :

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.
