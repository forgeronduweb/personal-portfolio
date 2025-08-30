const mongoose = require('mongoose');
const User = require('../models/User');
const config = require('../config/config');

async function createNewAdmin() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    const email = 'bahophilomeevrard@gmail.com';
    const password = 'Philome98@';

    // Supprimer l'utilisateur existant s'il existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await User.deleteOne({ email });
      console.log('🗑️ Ancien utilisateur supprimé');
    }

    // Créer un nouvel admin
    const admin = await User.create({
      name: 'Bahophilomé Evrard',
      email: email,
      password: password,
      role: 'admin',
      isPremium: true
    });

    console.log('✅ Nouvel admin créé avec succès:');
    console.log(`   - ID: ${admin._id}`);
    console.log(`   - Email: ${admin.email}`);
    console.log(`   - Rôle: ${admin.role}`);
    console.log(`   - Premium: ${admin.isPremium}`);

    // Test de connexion
    const testUser = await User.findOne({ email });
    const isMatch = await testUser.comparePassword(password);
    
    if (isMatch) {
      console.log('✅ Test de connexion réussi!');
      console.log('🎉 Vous pouvez maintenant vous connecter avec ces identifiants');
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

createNewAdmin();
