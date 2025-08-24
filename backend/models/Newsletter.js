const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez entrer une adresse email valide']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  source: {
    type: String,
    default: 'website', // website, admin, import
    enum: ['website', 'admin', 'import']
  },
  tags: [{
    type: String,
    trim: true
  }],
  preferences: {
    frequency: {
      type: String,
      default: 'weekly',
      enum: ['daily', 'weekly', 'monthly']
    },
    categories: [{
      type: String,
      enum: ['updates', 'promotions', 'news', 'portfolio']
    }]
  },
  unsubscribeToken: {
    type: String,
    unique: true
  },
  lastEmailSent: {
    type: Date
  },
  emailsSentCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index pour les recherches
newsletterSchema.index({ email: 1 });
newsletterSchema.index({ isActive: 1 });
newsletterSchema.index({ createdAt: -1 });

// Générer un token de désabonnement avant la sauvegarde
newsletterSchema.pre('save', function(next) {
  if (!this.unsubscribeToken) {
    this.unsubscribeToken = require('crypto').randomBytes(32).toString('hex');
  }
  next();
});

// Méthode pour désactiver l'abonnement
newsletterSchema.methods.unsubscribe = function() {
  this.isActive = false;
  return this.save();
};

// Méthode pour réactiver l'abonnement
newsletterSchema.methods.resubscribe = function() {
  this.isActive = true;
  return this.save();
};

// Méthode statique pour obtenir les statistiques
newsletterSchema.statics.getStats = async function() {
  const total = await this.countDocuments();
  const active = await this.countDocuments({ isActive: true });
  const inactive = await this.countDocuments({ isActive: false });
  
  const recentSubscriptions = await this.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // 30 derniers jours
  });

  return {
    total,
    active,
    inactive,
    recentSubscriptions
  };
};

module.exports = mongoose.model('Newsletter', newsletterSchema);
