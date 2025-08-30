const mongoose = require('mongoose');
const User = require('../models/User');
const config = require('../config/config');
const bcrypt = require('bcryptjs');

async function fixAdmin() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    const email = 'bahophilomeevrard@gmail.com';
    const newPassword = '21998';

    // Supprimer l'utilisateur existant s'il existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await User.deleteOne({ email });
      console.log('🗑️ Ancien utilisateur supprimé');
    }

    // Créer un nouvel admin avec le mot de passe correct
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const admin = await User.create({
      name: 'Bahophilomé Evrard',
      email: email,
      password: hashedPassword,
      role: 'admin',
      isPremium: true
    });

    console.log('✅ Nouvel admin créé:');
    console.log(`   - ID: ${admin._id}`);
    console.log(`   - Email: ${admin.email}`);
    console.log(`   - Rôle: ${admin.role}`);

    // Test de connexion
    const testUser = await User.findOne({ email });
    const isMatch = await testUser.comparePassword(newPassword);
    
    if (isMatch) {
      console.log('✅ Test de connexion réussi!');
    } else {
      console.log('❌ Problème avec le mot de passe');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Déconnecté de MongoDB');
  }
}

fixAdmin();
