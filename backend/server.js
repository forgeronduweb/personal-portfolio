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
// CORS: autoriser frontend client + frontend admin
app.use(cors({
    origin: function (origin, callback) {
        const allowed = [config.CORS_ORIGIN, config.ADMIN_CORS_ORIGIN].filter(Boolean);
        // Autoriser localhost et 127.0.0.1 pour les ports Vite (5173/5174)
        const isDevHostAllowed = (o) => {
            try {
                const u = new URL(o);
                const hostOk = ['localhost', '127.0.0.1'].includes(u.hostname);
                const portOk = ['5173', '5174'].includes(u.port);
                return hostOk && portOk;
            } catch (_) { return false; }
        };

        if (!origin || allowed.includes(origin) || isDevHostAllowed(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
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
