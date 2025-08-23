const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function insertAdminDirectly() {
  const uri = 'mongodb+srv://forgeronduweb:rPEPuW6J6I2tqrgU@cluster0.drfeiye.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connecté à MongoDB Atlas');

    const db = client.db('portfolio');
    const usersCollection = db.collection('users');

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash('21998', 12);

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await usersCollection.findOne({ email: 'bahophilomeevrard@gmail.com' });
    
    if (existingUser) {
      // Mettre à jour l'utilisateur existant
      await usersCollection.updateOne(
        { email: 'bahophilomeevrard@gmail.com' },
        { 
          $set: { 
            role: 'admin',
            isPremium: true,
            password: hashedPassword
          }
        }
      );
      console.log('✅ Utilisateur existant mis à jour en admin');
    } else {
      // Créer un nouvel utilisateur admin
      const adminUser = {
        name: 'Bahophilomé Evrard',
        email: 'bahophilomeevrard@gmail.com',
        password: hashedPassword,
        role: 'admin',
        isPremium: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await usersCollection.insertOne(adminUser);
      console.log('✅ Nouvel admin créé avec l\'ID:', result.insertedId);
    }

    // Vérifier la création
    const admin = await usersCollection.findOne({ email: 'bahophilomeevrard@gmail.com' });
    console.log('📋 Admin dans la base:', {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isPremium: admin.isPremium
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.close();
    console.log('🔐 Connexion fermée');
  }
}

insertAdminDirectly();
