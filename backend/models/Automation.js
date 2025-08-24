const mongoose = require('mongoose');

const automationExecutionSchema = new mongoose.Schema({
  triggeredBy: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    email: String,
    prospectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prospect'
    }
  },
  executedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending'
  },
  error: String,
  emailSent: {
    messageId: String,
    sentAt: Date
  }
});

const automationSchema = new mongoose.Schema({
  // Informations de base
  name: {
    type: String,
    required: true
  },
  description: String,
  
  // Type d'automatisation
  type: {
    type: String,
    enum: ['welcome', 'follow_up', 'reminder', 'abandoned_quote', 'newsletter_welcome'],
    required: true
  },
  
  // Déclencheur
  trigger: {
    type: String,
    enum: ['user_registration', 'quote_request', 'quote_sent', 'payment_due', 'newsletter_signup', 'prospect_created'],
    required: true
  },
  
  // Conditions de déclenchement
  conditions: {
    userRole: [String], // Rôles d'utilisateurs concernés
    prospectStatus: [String], // Statuts de prospects concernés
    minDaysSinceLastContact: Number,
    tags: [String] // Tags requis
  },
  
  // Délai avant exécution (en heures)
  delay: {
    type: Number,
    default: 0
  },
  
  // Contenu de l'email
  email: {
    subject: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    template: String, // Nom du template à utiliser
    variables: [String] // Variables disponibles dans le template
  },
  
  // Statut
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Statistiques
  sentCount: {
    type: Number,
    default: 0
  },
  openCount: {
    type: Number,
    default: 0
  },
  clickCount: {
    type: Number,
    default: 0
  },
  
  // Historique d'exécution
  executions: [automationExecutionSchema],
  
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
automationSchema.index({ type: 1 });
automationSchema.index({ trigger: 1 });
automationSchema.index({ isActive: 1 });
automationSchema.index({ createdAt: -1 });

// Middleware pour mettre à jour updatedAt
automationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Méthodes statiques
automationSchema.statics.findByTrigger = function(trigger) {
  return this.find({
    trigger,
    isActive: true
  });
};

automationSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalAutomations: { $sum: 1 },
        activeAutomations: {
          $sum: {
            $cond: [{ $eq: ['$isActive', true] }, 1, 0]
          }
        },
        totalSent: { $sum: '$sentCount' },
        totalOpened: { $sum: '$openCount' },
        totalClicked: { $sum: '$clickCount' }
      }
    },
    {
      $project: {
        totalAutomations: 1,
        activeAutomations: 1,
        totalSent: 1,
        openRate: {
          $cond: [
            { $gt: ['$totalSent', 0] },
            { $divide: ['$totalOpened', '$totalSent'] },
            0
          ]
        },
        clickRate: {
          $cond: [
            { $gt: ['$totalSent', 0] },
            { $divide: ['$totalClicked', '$totalSent'] },
            0
          ]
        }
      }
    }
  ]);
};

// Méthodes d'instance
automationSchema.methods.shouldTrigger = function(context) {
  if (!this.isActive) return false;
  
  // Vérifier les conditions
  if (this.conditions.userRole && this.conditions.userRole.length > 0) {
    if (!context.userRole || !this.conditions.userRole.includes(context.userRole)) {
      return false;
    }
  }
  
  if (this.conditions.prospectStatus && this.conditions.prospectStatus.length > 0) {
    if (!context.prospectStatus || !this.conditions.prospectStatus.includes(context.prospectStatus)) {
      return false;
    }
  }
  
  if (this.conditions.minDaysSinceLastContact) {
    if (!context.lastContactDate) return false;
    const daysSince = (new Date() - new Date(context.lastContactDate)) / (1000 * 60 * 60 * 24);
    if (daysSince < this.conditions.minDaysSinceLastContact) {
      return false;
    }
  }
  
  if (this.conditions.tags && this.conditions.tags.length > 0) {
    if (!context.tags || !this.conditions.tags.some(tag => context.tags.includes(tag))) {
      return false;
    }
  }
  
  return true;
};

automationSchema.methods.execute = function(context) {
  const execution = {
    triggeredBy: {
      userId: context.userId,
      email: context.email,
      prospectId: context.prospectId
    },
    status: 'pending'
  };
  
  this.executions.push(execution);
  
  // Programmer l'envoi avec le délai spécifié
  if (this.delay > 0) {
    // Dans un vrai système, on utiliserait une queue de jobs
    setTimeout(() => {
      this.sendEmail(execution, context);
    }, this.delay * 60 * 60 * 1000); // Convertir heures en millisecondes
  } else {
    this.sendEmail(execution, context);
  }
  
  return this.save();
};

automationSchema.methods.sendEmail = async function(execution, context) {
  try {
    // Remplacer les variables dans le sujet et le message
    let subject = this.email.subject;
    let message = this.email.message;
    
    // Variables disponibles
    const variables = {
      '[NOM]': context.name || 'Client',
      '[EMAIL]': context.email || '',
      '[ENTREPRISE]': context.companyName || '',
      '[PROJET]': context.projectType || '',
      '[DATE]': new Date().toLocaleDateString('fr-FR')
    };
    
    Object.entries(variables).forEach(([placeholder, value]) => {
      subject = subject.replace(new RegExp(placeholder, 'g'), value);
      message = message.replace(new RegExp(placeholder, 'g'), value);
    });
    
    // Ici, on intégrerait un service d'email comme Nodemailer, SendGrid, etc.
    console.log(`Envoi automatique - ${this.name}:`);
    console.log(`À: ${context.email}`);
    console.log(`Sujet: ${subject}`);
    console.log(`Message: ${message}`);
    
    // Simuler l'envoi réussi
    execution.status = 'sent';
    execution.emailSent = {
      messageId: `auto_${Date.now()}`,
      sentAt: new Date()
    };
    
    this.sentCount += 1;
    
  } catch (error) {
    execution.status = 'failed';
    execution.error = error.message;
  }
  
  return this.save();
};

automationSchema.methods.recordOpen = function(executionId) {
  const execution = this.executions.id(executionId);
  if (execution && execution.status === 'sent') {
    this.openCount += 1;
    return this.save();
  }
};

automationSchema.methods.recordClick = function(executionId) {
  const execution = this.executions.id(executionId);
  if (execution && execution.status === 'sent') {
    this.clickCount += 1;
    return this.save();
  }
};

module.exports = mongoose.model('Automation', automationSchema);
