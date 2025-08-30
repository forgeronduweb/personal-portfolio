const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/User');

async function updateAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('❌ MONGODB_URI non trouvé dans les variables d\'environnement');
      process.exit(1);
    }
    await mongoose.connect(mongoUri);
    console.log('Connexion à MongoDB réussie');

    // Chercher l'admin existant
    const admin = await User.findOne({ role: 'admin' });
    
    if (!admin) {
      console.log('Aucun admin trouvé. Création d\'un nouvel admin...');
      
      // Créer un nouvel admin
      const newAdmin = await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
        isPremium: true
      });
      
      console.log('Nouvel admin créé:', {
        id: newAdmin._id,
        email: newAdmin.email,
        role: newAdmin.role
      });
    } else {
      console.log('Admin trouvé:', admin.email);
      
      // Mettre à jour l'email et le mot de passe
      admin.email = process.env.ADMIN_EMAIL;
      admin.password = process.env.ADMIN_PASSWORD; // Le middleware pre('save') va hasher automatiquement
      
      await admin.save();
      
      console.log('Admin mis à jour:', {
        id: admin._id,
        email: admin.email,
        role: admin.role
      });
    }

    console.log('✅ Mise à jour terminée avec succès!');
    console.log('Nouvelles informations de connexion:');
    console.log('Email:', process.env.ADMIN_EMAIL);
    console.log('Mot de passe: [MASQUÉ]');
    
    process.exit(0);
  } catch (err) {
    console.error('Erreur:', err);
    process.exit(1);
  }
}

updateAdmin();
