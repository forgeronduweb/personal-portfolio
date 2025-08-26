const mongoose = require('mongoose');

const engagementSchema = new mongoose.Schema({
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  reach: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

const socialMediaPostSchema = new mongoose.Schema({
  // Contenu du post
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  hashtags: String,
  mediaUrl: String,
  mediaType: {
    type: String,
    enum: ['image', 'video', 'carousel', 'none'],
    default: 'none'
  },
  
  // Plateforme(s) de publication
  platform: {
    type: String,
    enum: ['all', 'facebook', 'instagram', 'twitter', 'linkedin'],
    required: true
  },
  
  // Statut et programmation
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'published', 'failed'],
    default: 'draft'
  },
  scheduledFor: Date,
  publishedAt: Date,
  
  // IDs des posts sur chaque plateforme
  platformPostIds: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String
  },
  
  // Engagement et statistiques
  engagement: engagementSchema,
  
  // Campagne associée
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
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
socialMediaPostSchema.index({ platform: 1 });
socialMediaPostSchema.index({ status: 1 });
socialMediaPostSchema.index({ scheduledFor: 1 });
socialMediaPostSchema.index({ createdAt: -1 });

// Middleware pour mettre à jour updatedAt
socialMediaPostSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Méthodes statiques
socialMediaPostSchema.statics.getScheduledPosts = function() {
  return this.find({
    status: 'scheduled',
    scheduledFor: { $lte: new Date() }
  }).sort({ scheduledFor: 1 });
};

socialMediaPostSchema.statics.getPostStats = function(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalLikes: { $sum: '$engagement.likes' },
        totalComments: { $sum: '$engagement.comments' },
        totalShares: { $sum: '$engagement.shares' },
        totalReach: { $sum: '$engagement.reach' }
      }
    }
  ]);
};

// Méthodes d'instance
socialMediaPostSchema.methods.publish = function() {
  this.status = 'published';
  this.publishedAt = new Date();
  return this.save();
};

socialMediaPostSchema.methods.updateEngagement = function(engagementData) {
  this.engagement = { ...this.engagement.toObject(), ...engagementData };
  this.engagement.lastUpdated = new Date();
  return this.save();
};

module.exports = mongoose.model('SocialMediaPost', socialMediaPostSchema);
