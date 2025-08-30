const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function createAdminDirectly() {
    try {
        // Connexion directe avec l'URI MongoDB
        const mongoUri = 'mongodb+srv://bahophilome:Philome98@cluster0.bfxnz.mongodb.net/portfolio?retryWrites=true&w=majority';
        
        await mongoose.connect(mongoUri);
        console.log('✅ Connecté à MongoDB');

        // Définir le schéma utilisateur
        const userSchema = new mongoose.Schema({
            name: String,
            email: { type: String, unique: true },
            password: String,
            role: { type: String, default: 'user' },
            isPremium: { type: Boolean, default: false },
            createdAt: { type: Date, default: Date.now }
        });

        const User = mongoose.model('User', userSchema);

        const email = 'bahophilomeevrard@gmail.com';
        const password = 'Philome98@';

        // Supprimer l'utilisateur existant
        await User.deleteOne({ email });
        console.log('🗑️ Ancien utilisateur supprimé');

        // Hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Créer l'admin directement
        const admin = await User.create({
            name: 'Bahophilomé Evrard',
            email: email,
            password: hashedPassword,
            role: 'admin',
            isPremium: true
        });

        console.log('✅ Admin créé avec succès:');
        console.log(`   - Email: ${admin.email}`);
        console.log(`   - Rôle: ${admin.role}`);

        // Test de vérification
        const testUser = await User.findOne({ email });
        const isMatch = await bcrypt.compare(password, testUser.password);
        
        console.log('🔐 Test de connexion:', isMatch ? 'RÉUSSI ✅' : 'ÉCHEC ❌');
        
        if (isMatch) {
            console.log('🎉 Identifiants enregistrés avec succès!');
            console.log(`   Email: ${email}`);
            console.log(`   Mot de passe: ${password}`);
        }

    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('📤 Déconnecté de MongoDB');
    }
}

createAdminDirectly();
