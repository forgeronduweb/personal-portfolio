const mongoose = require('mongoose');
const config = require('../config/config');
const User = require('../models/User');

async function createAdmin() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connecté à MongoDB');

    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ email: 'admin@mail.com' });
    if (existingAdmin) {
      console.log('Admin avec cet email existe déjà');
      process.exit(0);
    }

    // Créer l'admin
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@mail.com',
      password: '123456',
      role: 'admin',
      isPremium: true
    });

    console.log('Admin créé avec succès:');
    console.log('Email:', admin.email);
    console.log('ID:', admin._id);
    console.log('Role:', admin.role);
    
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error);
    process.exit(1);
  }
}

createAdmin();
