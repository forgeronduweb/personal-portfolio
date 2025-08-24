const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['email', 'call', 'meeting', 'quote', 'follow_up', 'quote_request', 'quote_sent', 'registration', 'newsletter_subscription'],
    required: true
  },
  subject: {
    type: String,
    required: false
  },
  content: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  outcome: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    default: 'neutral'
  },
  date: {
    type: Date,
    default: Date.now
  },
  nextAction: String,
  nextActionDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
});

const prospectSchema = new mongoose.Schema({
  // Informations de base
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  companyName: String,
  contactName: String,
  phone: String,
  
  // Informations projet
  projectType: String,
  budget: String,
  timeline: String,
  description: String,
  
  // Statut et suivi
  status: {
    type: String,
    enum: ['new', 'interested', 'negotiating', 'negotiation', 'confirmed', 'qualified', 'client', 'lost'],
    default: 'new'
  },
  source: {
    type: String,
    enum: ['website', 'newsletter', 'social', 'referral', 'direct', 'website_registration', 'website_quote'],
    default: 'website'
  },
  
  // Valeur estimée
  estimatedValue: {
    type: Number,
    default: 0
  },
  
  // Référence vers la demande de site originale
  siteRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SiteRequest'
  },
  
  // Historique des interactions
  interactions: [interactionSchema],
  
  // Tags et notes
  tags: [String],
  notes: String,
  
  // Dates importantes
  lastContactDate: Date,
  nextFollowUpDate: Date,
  
  // Métadonnées
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour les recherches
prospectSchema.index({ email: 1 });
prospectSchema.index({ status: 1 });
prospectSchema.index({ source: 1 });
prospectSchema.index({ createdAt: -1 });

// Middleware pour mettre à jour updatedAt
prospectSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Méthodes statiques
prospectSchema.statics.getStatsByStatus = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

prospectSchema.statics.getStatsBySource = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$source',
        count: { $sum: 1 }
      }
    }
  ]);
};

prospectSchema.statics.getConversionRate = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        confirmed: {
          $sum: {
            $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0]
          }
        }
      }
    },
    {
      $project: {
        conversionRate: {
          $cond: [
            { $gt: ['$total', 0] },
            { $divide: ['$confirmed', '$total'] },
            0
          ]
        }
      }
    }
  ]);
};

// Méthodes d'instance
prospectSchema.methods.addInteraction = function(interactionData) {
  this.interactions.unshift(interactionData);
  this.lastContactDate = new Date();
  return this.save();
};

prospectSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  if (newStatus === 'confirmed') {
    // Convertir en client confirmé
    this.tags = this.tags || [];
    if (!this.tags.includes('client')) {
      this.tags.push('client');
    }
  }
  return this.save();
};

module.exports = mongoose.model('Prospect', prospectSchema);
