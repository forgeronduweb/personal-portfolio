const mongoose = require('mongoose');
const User = require('../models/User');
const config = require('../config/config');

async function testLogin() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    const email = 'bahophilomeevrard@gmail.com';
    const password = '21998';

    console.log('\n🔍 Test de connexion pour:', email);

    // Rechercher l'utilisateur
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé avec cet email');
      console.log('📋 Utilisateurs existants:');
      const allUsers = await User.find({}, 'email role');
      allUsers.forEach(u => console.log(`   - ${u.email} (${u.role})`));
      return;
    }

    console.log('✅ Utilisateur trouvé:');
    console.log(`   - ID: ${user._id}`);
    console.log(`   - Nom: ${user.name}`);
    console.log(`   - Email: ${user.email}`);
    console.log(`   - Rôle: ${user.role}`);
    console.log(`   - Premium: ${user.isPremium}`);
    console.log(`   - Créé le: ${user.createdAt}`);

    // Test de comparaison du mot de passe
    console.log('\n🔐 Test du mot de passe...');
    const isMatch = await user.comparePassword(password);
    
    if (isMatch) {
      console.log('✅ Mot de passe correct!');
      console.log('🎉 La connexion devrait fonctionner');
    } else {
      console.log('❌ Mot de passe incorrect');
      console.log('💡 Le mot de passe stocké est hashé, vérifiez s\'il a été créé correctement');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n📤 Déconnecté de MongoDB');
  }
}

testLogin();
