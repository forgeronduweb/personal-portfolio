require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schema utilisateur simple
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'user' },
    isPremium: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

async function createAdmin() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            console.log('❌ MONGODB_URI non trouvé dans .env');
            return;
        }

        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connecté à MongoDB');

        const email = 'bahophilomeevrard@gmail.com';
        const password = 'Philome98@';

        // Supprimer l'utilisateur existant
        await User.deleteOne({ email });
        console.log('🗑️ Ancien utilisateur supprimé (si existant)');

        // Créer le nouvel admin
        const admin = new User({
            name: 'Bahophilomé Evrard',
            email: email,
            password: password,
            role: 'admin',
            isPremium: true
        });

        await admin.save();
        console.log('✅ Admin créé avec succès');

        // Test de connexion
        const testUser = await User.findOne({ email });
        const isMatch = await testUser.comparePassword(password);
        
        console.log('🔐 Test de connexion:', isMatch ? 'RÉUSSI ✅' : 'ÉCHEC ❌');
        
        if (isMatch) {
            console.log('🎉 Vous pouvez maintenant vous connecter avec:');
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

createAdmin();
