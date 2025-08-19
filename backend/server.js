const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');

// Routes
const authRoutes = require('./routes/auth');

// Initialisation de l'application Express
const app = express();

// Middleware
app.use(express.json());
// Configuration CORS
app.use(cors({
    origin: true, // Autoriser toutes les origines en développement
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Log des requêtes
app.use((req, res, next) => {
    if (config.NODE_ENV === 'development') {
        const { authorization, ...restHeaders } = req.headers || {};
        console.log(`${req.method} ${req.url}`, {
            body: req.body,
            headers: restHeaders
        });
    }
    next();
});

// Routes
app.use('/api/auth', authRoutes);

// Routes admin
app.use('/api/admin', require('./routes/admin'));

// Routes demandes de sites
app.use('/api/site-requests', require('./routes/siteRequests'));

// Routes projets publiques
app.use('/api/projects', require('./routes/projects'));

// Servir les fichiers statiques uploadés
app.use('/uploads', express.static('uploads'));

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
    console.error('Erreur détaillée:', err);
    console.error('Stack trace:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Une erreur est survenue sur le serveur',
        error: err.message
    });
});

// Connexion à MongoDB
mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Démarrage du serveur
app.listen(config.PORT, () => {
    console.log(`Serveur démarré sur le port ${config.PORT}`);
});
