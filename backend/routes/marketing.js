const express = require('express');
const router = express.Router();
const { protect, requireAdmin } = require('../middleware/auth');
const Prospect = require('../models/Prospect');
const Promotion = require('../models/Promotion');
const Automation = require('../models/Automation');
const SocialMediaPost = require('../models/SocialMediaPost');
const Newsletter = require('../models/Newsletter');
const SiteRequest = require('../models/SiteRequest');

// Middleware pour vérifier les rôles marketing
const requireMarketing = (req, res, next) => {
  if (!['admin', 'marketing'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Accès refusé - Rôle marketing requis' });
  }
  next();
};

// ===== ROUTES PROSPECTS & CRM =====

// GET /api/admin/marketing/prospects - Liste des prospects
router.get('/prospects', protect, requireMarketing, async (req, res, next) => {
  try {
    const { page = 1, limit = 50, status, source } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (source) filter.source = source;

    const prospects = await Prospect.find(filter)
      .populate('siteRequestId', 'projectType budget timeline')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Prospect.countDocuments(filter);

    res.json({
      success: true,
      data: prospects,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: prospects.length,
        totalItems: total
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/marketing/prospects - Créer un prospect
router.post('/prospects', protect, requireMarketing, async (req, res, next) => {
  try {
    const prospect = new Prospect({
      ...req.body,
      createdBy: req.user.id
    });
    await prospect.save();

    res.status(201).json({
      success: true,
      data: prospect
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/marketing/prospects/:id - Mettre à jour un prospect
router.put('/prospects/:id', protect, requireMarketing, async (req, res, next) => {
  try {
    const prospect = await Prospect.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!prospect) {
      return res.status(404).json({ message: 'Prospect non trouvé' });
    }

    res.json({
      success: true,
      data: prospect
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/marketing/prospects/:id/interactions - Ajouter une interaction
router.post('/prospects/:id/interactions', protect, requireMarketing, async (req, res, next) => {
  try {
    const prospect = await Prospect.findById(req.params.id);
    if (!prospect) {
      return res.status(404).json({ message: 'Prospect non trouvé' });
    }

    const interaction = {
      ...req.body,
      createdBy: req.user.id
    };

    await prospect.addInteraction(interaction);

    res.json({
      success: true,
      data: prospect
    });
  } catch (err) {
    next(err);
  }
});

// ===== ROUTES PROMOTIONS =====

// GET /api/admin/marketing/promotions - Liste des promotions
router.get('/promotions', protect, requireMarketing, async (req, res, next) => {
  try {
    const { page = 1, limit = 50, active } = req.query;
    
    const filter = {};
    if (active !== undefined) {
      filter.isActive = active === 'true';
    }

    const promotions = await Promotion.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Promotion.countDocuments(filter);

    res.json({
      success: true,
      data: promotions,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: promotions.length,
        totalItems: total
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/marketing/promotions - Créer une promotion
router.post('/promotions', protect, requireMarketing, async (req, res, next) => {
  try {
    const promotion = new Promotion({
      ...req.body,
      createdBy: req.user.id
    });
    await promotion.save();

    res.status(201).json({
      success: true,
      data: promotion
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/marketing/promotions/:id - Mettre à jour une promotion
router.put('/promotions/:id', protect, requireMarketing, async (req, res, next) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!promotion) {
      return res.status(404).json({ message: 'Promotion non trouvée' });
    }

    res.json({
      success: true,
      data: promotion
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/marketing/promotions/:code/validate - Valider un code promo
router.post('/promotions/:code/validate', async (req, res, next) => {
  try {
    const { orderValue, userId } = req.body;
    
    const promotion = await Promotion.findValidPromotion(req.params.code);
    if (!promotion) {
      return res.status(404).json({ message: 'Code promo invalide ou expiré' });
    }

    const validation = promotion.canBeUsed(userId, orderValue);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.reason });
    }

    const discount = promotion.calculateDiscount(orderValue);

    res.json({
      success: true,
      data: {
        promotion: {
          name: promotion.name,
          type: promotion.type,
          value: promotion.value
        },
        discount,
        finalAmount: orderValue - discount
      }
    });
  } catch (err) {
    next(err);
  }
});

// ===== ROUTES AUTOMATISATIONS =====

// GET /api/admin/marketing/automations - Liste des automatisations
router.get('/automations', protect, requireMarketing, async (req, res, next) => {
  try {
    const automations = await Automation.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: automations
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/marketing/automations - Créer une automatisation
router.post('/automations', protect, requireMarketing, async (req, res, next) => {
  try {
    const automation = new Automation({
      ...req.body,
      createdBy: req.user.id
    });
    await automation.save();

    res.status(201).json({
      success: true,
      data: automation
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/marketing/automations/:id - Mettre à jour une automatisation
router.put('/automations/:id', protect, requireMarketing, async (req, res, next) => {
  try {
    const automation = await Automation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!automation) {
      return res.status(404).json({ message: 'Automatisation non trouvée' });
    }

    res.json({
      success: true,
      data: automation
    });
  } catch (err) {
    next(err);
  }
});

// ===== ROUTES RÉSEAUX SOCIAUX =====

// GET /api/admin/marketing/social-media - Liste des posts
router.get('/social-media', protect, requireMarketing, async (req, res, next) => {
  try {
    const { page = 1, limit = 50, platform, status } = req.query;
    
    const filter = {};
    if (platform && platform !== 'all') filter.platform = platform;
    if (status) filter.status = status;

    const posts = await SocialMediaPost.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SocialMediaPost.countDocuments(filter);

    res.json({
      success: true,
      data: posts,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: posts.length,
        totalItems: total
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/marketing/social-media - Créer un post
router.post('/social-media', protect, requireMarketing, async (req, res, next) => {
  try {
    const post = new SocialMediaPost({
      ...req.body,
      createdBy: req.user.id
    });
    await post.save();

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/marketing/social-media/:id - Mettre à jour un post
router.put('/social-media/:id', protect, requireMarketing, async (req, res, next) => {
  try {
    const post = await SocialMediaPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (err) {
    next(err);
  }
});

// ===== ROUTES STATISTIQUES =====

// GET /api/admin/marketing/stats - Statistiques marketing globales
router.get('/stats', protect, requireMarketing, async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Statistiques prospects
    const [prospectsByStatus, prospectsBySource, conversionRate] = await Promise.all([
      Prospect.getStatsByStatus(),
      Prospect.getStatsBySource(),
      Prospect.getConversionRate()
    ]);

    const prospectsStats = {
      total: await Prospect.countDocuments(),
      byStatus: prospectsByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      bySource: prospectsBySource.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      conversionRate: conversionRate[0]?.conversionRate || 0
    };

    // Statistiques campagnes (newsletter)
    const newsletterStats = await Newsletter.getStats();
    const campaignsStats = {
      total: newsletterStats.total || 0,
      openRate: 0.25, // Placeholder - à implémenter avec un vrai service email
      clickRate: 0.05,
      unsubscribeRate: 0.02
    };

    // Statistiques promotions
    const promotionStats = await Promotion.getPromotionStats();
    const promotionsStats = {
      total: promotionStats[0]?.totalPromotions || 0,
      totalUsed: promotionStats[0]?.totalUsed || 0,
      revenue: promotionStats[0]?.totalRevenue || 0
    };

    // Statistiques revenus (placeholder - à connecter avec un système de facturation)
    const revenueStats = {
      total: promotionStats[0]?.totalRevenue || 0,
      byMonth: [], // À implémenter
      roi: 0.15 // Placeholder
    };

    res.json({
      success: true,
      data: {
        prospects: prospectsStats,
        campaigns: campaignsStats,
        promotions: promotionsStats,
        revenue: revenueStats
      }
    });
  } catch (err) {
    next(err);
  }
});

// ===== HOOKS D'AUTOMATISATION =====

// Fonction pour déclencher les automatisations
const triggerAutomations = async (trigger, context) => {
  try {
    const automations = await Automation.findByTrigger(trigger);
    
    for (const automation of automations) {
      if (automation.shouldTrigger(context)) {
        await automation.execute(context);
      }
    }
  } catch (error) {
    console.error('Erreur déclenchement automatisations:', error);
  }
};

// Middleware pour créer automatiquement des prospects depuis les demandes de sites
router.post('/sync-prospects', protect, requireAdmin, async (req, res, next) => {
  try {
    // Récupérer toutes les demandes de sites sans prospect associé
    const siteRequests = await SiteRequest.find({
      prospectId: { $exists: false }
    });

    let createdCount = 0;

    for (const request of siteRequests) {
      // Vérifier si un prospect existe déjà avec cet email
      let prospect = await Prospect.findOne({ email: request.email });
      
      if (!prospect) {
        // Créer un nouveau prospect
        prospect = new Prospect({
          email: request.email,
          companyName: request.companyName,
          projectType: request.projectType,
          budget: request.budget,
          timeline: request.timeline,
          description: request.additionalInfo,
          source: 'website',
          siteRequestId: request._id,
          estimatedValue: extractBudgetValue(request.budget)
        });
        
        await prospect.save();
        createdCount++;

        // Déclencher les automatisations pour nouveau prospect
        await triggerAutomations('prospect_created', {
          email: prospect.email,
          companyName: prospect.companyName,
          projectType: prospect.projectType,
          prospectId: prospect._id
        });
      }

      // Lier la demande au prospect
      request.prospectId = prospect._id;
      await request.save();
    }

    res.json({
      success: true,
      message: `${createdCount} prospects créés et ${siteRequests.length} demandes synchronisées`
    });
  } catch (err) {
    next(err);
  }
});

// Fonction utilitaire pour extraire la valeur numérique du budget
function extractBudgetValue(budgetString) {
  if (!budgetString) return 0;
  
  const budgetMap = {
    'moins-de-500000': 400000,
    '500000-1000000': 750000,
    '1000000-2000000': 1500000,
    'plus-de-2000000': 2500000
  };
  
  return budgetMap[budgetString] || 0;
}

module.exports = router;
