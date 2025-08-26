const mongoose = require('mongoose');
const config = require('../config/config');
const User = require('../models/User');

async function createAdmin() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connecté à MongoDB');

    const email = 'bahophilomeevrard@gmail.com';
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Utilisateur existant trouvé, mise à jour du rôle...');
      existingUser.role = 'admin';
      existingUser.isPremium = true;
      await existingUser.save();
      console.log('Utilisateur mis à jour en admin:', { id: existingUser._id, email: existingUser.email });
    } else {
      // Créer un nouvel admin
      const admin = await User.create({
        name: 'Bahophilomé Evrard',
        email: 'bahophilomeevrard@gmail.com',
        password: '21998',
        role: 'admin',
        isPremium: true
      });
      console.log('Admin créé:', { id: admin._id, email: admin.email });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

createAdmin();
