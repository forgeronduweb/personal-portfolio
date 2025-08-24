const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');

// Routes
const authRoutes = require('./routes/auth');

// Initialisation de l'application Express
const app = express();

// Middleware - Augmenter la limite pour les images base64
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Configuration CORS
const allowedOrigins = [
    'http://localhost:5173', // Frontend local
    'http://localhost:5174', // Admin local
    'https://personal-portfolio-353x.onrender.com', // Frontend production (vraie URL)
    'https://personal-portfolio-admin-1qat.onrender.com', // Admin production (vraie URL)
    process.env.CORS_ORIGIN,
    process.env.ADMIN_CORS_ORIGIN
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Autoriser les requêtes sans origin (comme Postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
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

// Routes marketing
app.use('/api/admin/marketing', require('./routes/marketing'));

// Routes demandes de sites
app.use('/api/site-requests', require('./routes/siteRequests'));

// Routes projets publiques
app.use('/api/projects', require('./routes/projects'));

// Routes newsletter publiques
const newsletterRouter = express.Router();
newsletterRouter.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }

    const Newsletter = require('./models/Newsletter');
    const existingSubscription = await Newsletter.findOne({ email });
    
    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return res.status(400).json({ message: 'Cet email est déjà inscrit à la newsletter' });
      } else {
        await existingSubscription.resubscribe();
        return res.status(200).json({ 
          message: 'Abonnement réactivé avec succès',
          data: existingSubscription 
        });
      }
    }

    const newsletter = new Newsletter({
      email,
      source: 'website'
    });

    await newsletter.save();

    res.status(201).json({
      message: 'Inscription à la newsletter réussie',
      data: newsletter
    });

  } catch (error) {
    console.error('Erreur inscription newsletter:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
  }
});
app.use('/api/newsletter', newsletterRouter);

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
