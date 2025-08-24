const mongoose = require('mongoose');

const promotionUsageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  email: String,
  orderId: String,
  orderValue: Number,
  discountApplied: Number,
  usedAt: {
    type: Date,
    default: Date.now
  }
});

const promotionSchema = new mongoose.Schema({
  // Informations de base
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  description: String,
  
  // Type et valeur de la promotion
  type: {
    type: String,
    enum: ['percentage', 'fixed', 'pack'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  
  // Conditions d'application
  minOrderValue: {
    type: Number,
    default: 0
  },
  maxUses: {
    type: Number,
    default: 0 // 0 = illimité
  },
  maxUsesPerUser: {
    type: Number,
    default: 1
  },
  
  // Services applicables
  applicableServices: [{
    type: String,
    enum: ['website', 'hosting', 'maintenance', 'seo', 'design']
  }],
  
  // Période de validité
  validFrom: {
    type: Date,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  
  // Statut
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Utilisation
  usedCount: {
    type: Number,
    default: 0
  },
  usageHistory: [promotionUsageSchema],
  
  // Statistiques
  totalRevenue: {
    type: Number,
    default: 0
  },
  totalDiscount: {
    type: Number,
    default: 0
  },
  
  // Métadonnées
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour les recherches
promotionSchema.index({ code: 1 });
promotionSchema.index({ isActive: 1 });
promotionSchema.index({ validFrom: 1, validUntil: 1 });
promotionSchema.index({ createdAt: -1 });

// Middleware pour mettre à jour updatedAt
promotionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Méthodes statiques
promotionSchema.statics.findValidPromotion = function(code) {
  const now = new Date();
  return this.findOne({
    code: code.toUpperCase(),
    isActive: true,
    validFrom: { $lte: now },
    validUntil: { $gte: now }
  });
};

promotionSchema.statics.getActivePromotions = function() {
  const now = new Date();
  return this.find({
    isActive: true,
    validFrom: { $lte: now },
    validUntil: { $gte: now }
  }).sort({ createdAt: -1 });
};

promotionSchema.statics.getPromotionStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalPromotions: { $sum: 1 },
        activePromotions: {
          $sum: {
            $cond: [{ $eq: ['$isActive', true] }, 1, 0]
          }
        },
        totalUsed: { $sum: '$usedCount' },
        totalRevenue: { $sum: '$totalRevenue' },
        totalDiscount: { $sum: '$totalDiscount' }
      }
    }
  ]);
};

// Méthodes d'instance
promotionSchema.methods.canBeUsed = function(userId, orderValue) {
  const now = new Date();
  
  // Vérifier si la promotion est active et valide
  if (!this.isActive || now < this.validFrom || now > this.validUntil) {
    return { valid: false, reason: 'Promotion expirée ou inactive' };
  }
  
  // Vérifier le nombre maximum d'utilisations
  if (this.maxUses > 0 && this.usedCount >= this.maxUses) {
    return { valid: false, reason: 'Nombre maximum d\'utilisations atteint' };
  }
  
  // Vérifier la valeur minimum de commande
  if (orderValue < this.minOrderValue) {
    return { valid: false, reason: `Commande minimum de ${this.minOrderValue} FCFA requise` };
  }
  
  // Vérifier le nombre d'utilisations par utilisateur
  if (userId && this.maxUsesPerUser > 0) {
    const userUsages = this.usageHistory.filter(usage => 
      usage.userId && usage.userId.toString() === userId.toString()
    );
    if (userUsages.length >= this.maxUsesPerUser) {
      return { valid: false, reason: 'Nombre maximum d\'utilisations par utilisateur atteint' };
    }
  }
  
  return { valid: true };
};

promotionSchema.methods.calculateDiscount = function(orderValue) {
  switch (this.type) {
    case 'percentage':
      return Math.min(orderValue * (this.value / 100), orderValue);
    case 'fixed':
      return Math.min(this.value, orderValue);
    case 'pack':
      // Pour les packs, la logique de réduction peut être plus complexe
      return this.value;
    default:
      return 0;
  }
};

promotionSchema.methods.usePromotion = function(userId, email, orderId, orderValue) {
  const discount = this.calculateDiscount(orderValue);
  
  // Ajouter l'utilisation à l'historique
  this.usageHistory.push({
    userId,
    email,
    orderId,
    orderValue,
    discountApplied: discount
  });
  
  // Mettre à jour les statistiques
  this.usedCount += 1;
  this.totalRevenue += orderValue;
  this.totalDiscount += discount;
  
  return this.save();
};

promotionSchema.methods.isExpired = function() {
  return new Date() > this.validUntil;
};

module.exports = mongoose.model('Promotion', promotionSchema);
