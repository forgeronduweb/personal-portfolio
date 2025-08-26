const mongoose = require('mongoose');
const config = require('../config/config');
const User = require('../models/User');

async function main() {
  try {
    const email = 'admin@mail.com';
    const password = '123456';
    const name = 'Admin';

    await mongoose.connect(config.MONGODB_URI);

    let user = await User.findOne({ email });
    if (user) {
      user.name = name;
      user.role = 'admin';
      user.isPremium = true;
      user.password = password; // sera hashé par le hook pre('save')
      await user.save();
      console.log('Admin mis à jour:', { id: user._id.toString(), email: user.email });
    } else {
      user = await User.create({ name, email, password, role: 'admin', isPremium: true });
      console.log('Admin créé:', { id: user._id.toString(), email: user.email });
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Erreur création admin:', err.message);
    process.exit(1);
  }
}

main();


