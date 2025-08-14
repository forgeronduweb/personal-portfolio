const mongoose = require('mongoose');
const readline = require('readline');
const config = require('../config/config');
const User = require('../models/User');

async function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans); }));
}

async function main() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    const name = await prompt('Nom admin: ');
    const email = await prompt('Email admin: ');
    const password = await prompt('Mot de passe admin: ');

    const exists = await User.findOne({ email });
    if (exists) {
      console.log('Un utilisateur existe déjà avec cet email.');
      process.exit(0);
    }

    const admin = await User.create({ name, email, password, role: 'admin', isPremium: true });
    console.log('Admin créé:', { id: admin._id, email: admin.email });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();


