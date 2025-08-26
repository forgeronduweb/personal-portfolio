const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');
const auth = require('../middleware/auth');

// Route publique pour s'inscrire à la newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }

    // Vérifier si l'email existe déjà
    const existingSubscription = await Newsletter.findOne({ email });
    
    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return res.status(400).json({ message: 'Cet email est déjà inscrit à la newsletter' });
      } else {
        // Réactiver l'abonnement s'il était désactivé
        await existingSubscription.resubscribe();
        return res.status(200).json({ 
          message: 'Abonnement réactivé avec succès',
          data: existingSubscription 
        });
      }
    }

    // Créer un nouvel abonnement
    const newsletter = new Newsletter({
      email,
      source: 'website'
    });

    await newsletter.save();

    res.status(201).json({
      message: 'Inscription à la newsletter réussie',
      data: newsletter
    });

  } catch (error) {
    console.error('Erreur inscription newsletter:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
  }
});

// Route publique pour se désabonner
router.get('/unsubscribe/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const subscription = await Newsletter.findOne({ unsubscribeToken: token });
    
    if (!subscription) {
      return res.status(404).json({ message: 'Lien de désabonnement invalide' });
    }

    await subscription.unsubscribe();

    res.status(200).json({ message: 'Désabonnement effectué avec succès' });

  } catch (error) {
    console.error('Erreur désabonnement:', error);
    res.status(500).json({ message: 'Erreur serveur lors du désabonnement' });
  }
});

// Routes admin (protégées)

// Obtenir toutes les inscriptions
router.get('/admin/newsletters', auth, async (req, res) => {
  try {
    // Vérifier les permissions admin
    if (!['admin', 'marketing'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const { page = 1, limit = 50, active } = req.query;
    
    const filter = {};
    if (active !== undefined) {
      filter.isActive = active === 'true';
    }

    const newsletters = await Newsletter.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Newsletter.countDocuments(filter);
    const stats = await Newsletter.getStats();

    res.json({
      data: newsletters,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: newsletters.length,
        totalItems: total
      },
      stats
    });

  } catch (error) {
    console.error('Erreur récupération newsletters:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer une inscription
router.delete('/admin/newsletters/:id', auth, async (req, res) => {
  try {
    if (!['admin', 'marketing'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const newsletter = await Newsletter.findByIdAndDelete(req.params.id);
    
    if (!newsletter) {
      return res.status(404).json({ message: 'Inscription non trouvée' });
    }

    res.json({ message: 'Inscription supprimée avec succès' });

  } catch (error) {
    console.error('Erreur suppression newsletter:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Ajouter manuellement un email
router.post('/admin/newsletters', auth, async (req, res) => {
  try {
    if (!['admin', 'marketing'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const { email, tags = [] } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }

    // Vérifier si l'email existe déjà
    const existingSubscription = await Newsletter.findOne({ email });
    
    if (existingSubscription) {
      return res.status(400).json({ message: 'Cet email est déjà inscrit' });
    }

    const newsletter = new Newsletter({
      email,
      source: 'admin',
      tags
    });

    await newsletter.save();

    res.status(201).json({
      message: 'Email ajouté avec succès',
      data: newsletter
    });

  } catch (error) {
    console.error('Erreur ajout newsletter:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Envoyer une newsletter (simulation)
router.post('/admin/newsletters/send', auth, async (req, res) => {
  try {
    if (!['admin', 'marketing'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const { subject, message, type = 'info', recipients } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: 'Sujet et message requis' });
    }

    let targetEmails;
    
    if (recipients && recipients.length > 0) {
      // Envoyer à des destinataires spécifiques
      targetEmails = recipients;
    } else {
      // Envoyer à tous les abonnés actifs
      const activeSubscriptions = await Newsletter.find({ isActive: true });
      targetEmails = activeSubscriptions.map(sub => sub.email);
    }

    // Simulation d'envoi d'email
    // Dans un vrai projet, ici vous intégreriez un service comme SendGrid, Mailchimp, etc.
    console.log(`📧 Newsletter envoyée:`);
    console.log(`Sujet: ${subject}`);
    console.log(`Type: ${type}`);
    console.log(`Destinataires: ${targetEmails.length}`);
    console.log(`Message: ${message.substring(0, 100)}...`);

    // Mettre à jour les statistiques d'envoi
    await Newsletter.updateMany(
      { email: { $in: targetEmails }, isActive: true },
      { 
        $inc: { emailsSentCount: 1 },
        $set: { lastEmailSent: new Date() }
      }
    );

    res.json({
      message: 'Newsletter envoyée avec succès',
      sentCount: targetEmails.length,
      subject,
      type
    });

  } catch (error) {
    console.error('Erreur envoi newsletter:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'envoi' });
  }
});

// Obtenir les statistiques
router.get('/admin/newsletters/stats', auth, async (req, res) => {
  try {
    if (!['admin', 'marketing'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const stats = await Newsletter.getStats();
    
    // Statistiques supplémentaires
    const monthlyGrowth = await Newsletter.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      data: {
        ...stats,
        monthlyGrowth
      }
    });

  } catch (error) {
    console.error('Erreur statistiques newsletter:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
