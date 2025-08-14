require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function testConnection() {
    try {
        // Connexion à MongoDB
        console.log('Tentative de connexion à MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connecté avec succès à MongoDB Atlas!');

        // Test de création d'un utilisateur
        console.log('\nTest de création d\'un utilisateur...');
        const testUser = new User({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            isPremium: true
        });

        await testUser.save();
        console.log('✅ Utilisateur test créé avec succès!');

        // Recherche de l'utilisateur
        console.log('\nRecherche de l\'utilisateur créé...');
        const foundUser = await User.findOne({ email: 'test@example.com' });
        console.log('Utilisateur trouvé:', {
            name: foundUser.name,
            email: foundUser.email,
            isPremium: foundUser.isPremium,
            createdAt: foundUser.createdAt
        });

        // Nettoyage - Suppression de l'utilisateur test
        console.log('\nSuppression de l\'utilisateur test...');
        await User.deleteOne({ email: 'test@example.com' });
        console.log('✅ Utilisateur test supprimé avec succès!');

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        // Fermeture de la connexion
        await mongoose.disconnect();
        console.log('\n📋 Test terminé, connexion fermée.');
    }
}

testConnection();
