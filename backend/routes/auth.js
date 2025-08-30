const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const User = require('../models/User'); // Assuming you have a User model
const jwt = require('jsonwebtoken'); // Assuming you have jwt installed

// Route pour créer un admin (sécurisée par une clé)
router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, password, adminKey } = req.body;

    // Vérifier la clé admin
    if (adminKey !== process.env.ADMIN_SETUP_KEY) {
      return res.status(403).json({
        success: false,
        message: 'Clé admin invalide'
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur existe déjà avec cet email'
      });
    }

    // Créer l'admin
    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin',
      isPremium: true
    });

    res.status(201).json({
      success: true,
      message: 'Admin créé avec succès',
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Erreur création admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de l\'admin'
    });
  }
});

// Route pour setup admin initial avec code de validation
router.post('/setup-admin', async (req, res) => {
  try {
    const { name, email, password, validationCode } = req.body;

    // Vérifier le code de validation
    if (validationCode !== '21998') {
      return res.status(403).json({
        success: false,
        message: 'Code de validation invalide'
      });
    }

    // Vérifier si un admin existe déjà
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Un administrateur existe déjà. Utilisez la fonction de connexion.'
      });
    }

    // Vérifier si l'email est déjà utilisé
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur existe déjà avec cet email'
      });
    }

    // Créer l'admin
    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin',
      isPremium: true
    });

    // Générer le token JWT
    const token = jwt.sign(
      { userId: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Administrateur créé avec succès',
      data: {
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          isPremium: admin.isPremium
        },
        token
      }
    });

  } catch (error) {
    console.error('Erreur setup admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de l\'administrateur'
    });
  }
});

// Route de vérification du token pour l'admin
router.get('/verify', protect, async (req, res) => {
  try {
    // Le middleware protect a déjà vérifié le token et ajouté req.user
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPremium: user.isPremium
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Routes publiques
router.post('/register', register);
router.post('/login', login);

// Routes protégées
router.get('/me', protect, getMe);

module.exports = router;
