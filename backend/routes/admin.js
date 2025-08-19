const express = require('express');
const router = express.Router();
const { protect, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const User = require('../models/User');
const SiteRequest = require('../models/SiteRequest');
const Project = require('../models/Project');
const { sendQuoteEmail } = require('../services/emailService');

// Exemple d'endpoint admin: stats rapides
router.get('/stats', protect, requireAdmin, async (req, res, next) => {
  try {
    const usersCount = await User.countDocuments();
    const premiumCount = await User.countDocuments({ isPremium: true });
    const adminsCount = await User.countDocuments({ role: 'admin' });
    res.json({ success: true, data: { usersCount, premiumCount, adminsCount } });
  } catch (err) {
    next(err);
  }
});

// Liste des utilisateurs (exemple, à paginer plus tard)
router.get('/users', protect, requireAdmin, async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
});

// Récupérer toutes les demandes de sites
router.get('/site-requests', protect, requireAdmin, async (req, res, next) => {
  try {
    const siteRequests = await SiteRequest.find().sort({ createdAt: -1 });
    res.json({ success: true, data: siteRequests });
  } catch (err) {
    next(err);
  }
});

// Mettre à jour le statut d'une demande
router.patch('/site-requests/:id/status', protect, requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    const siteRequest = await SiteRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!siteRequest) {
      return res.status(404).json({
        success: false,
        message: 'Demande non trouvée'
      });
    }

    res.json({ success: true, data: siteRequest });
  } catch (err) {
    next(err);
  }
});

// Envoyer un devis pour une demande
router.post('/site-requests/:id/quote', protect, requireAdmin, async (req, res, next) => {
  try {
    const { amount, currency, description, adminNotes } = req.body;
    
    const siteRequest = await SiteRequest.findByIdAndUpdate(
      req.params.id,
      { 
        quote: {
          amount,
          currency: currency || 'XOF',
          description,
          sentAt: new Date()
        },
        adminNotes,
        status: 'in_progress'
      },
      { new: true, runValidators: true }
    );

    if (!siteRequest) {
      return res.status(404).json({
        success: false,
        message: 'Demande non trouvée'
      });
    }

    // Envoyer l'email de devis
    const emailResult = await sendQuoteEmail(siteRequest, {
      amount,
      currency: currency || 'EUR',
      description
    });

    if (!emailResult.success) {
      console.warn('Erreur envoi email:', emailResult.error);
      // On continue même si l'email échoue
    }

    res.json({ 
      success: true, 
      message: emailResult.success ? 'Devis envoyé avec succès par email' : 'Devis sauvegardé (erreur envoi email)',
      data: siteRequest 
    });
  } catch (err) {
    next(err);
  }
});

// Récupérer les détails d'une demande
router.get('/site-requests/:id', protect, requireAdmin, async (req, res, next) => {
  try {
    const siteRequest = await SiteRequest.findById(req.params.id);
    
    if (!siteRequest) {
      return res.status(404).json({
        success: false,
        message: 'Demande non trouvée'
      });
    }

    res.json({ success: true, data: siteRequest });
  } catch (err) {
    next(err);
  }
});

// ===== ROUTES PROJETS =====

// Upload d'image pour les projets
router.post('/projects/upload', protect, requireAdmin, upload.single('image'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier uploadé'
      });
    }

    // Retourner l'URL de l'image uploadée
    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Image uploadée avec succès',
      data: {
        filename: req.file.filename,
        url: imageUrl,
        originalName: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (err) {
    next(err);
  }
});

// Récupérer tous les projets
router.get('/projects', protect, requireAdmin, async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (err) {
    next(err);
  }
});

// Créer un nouveau projet
router.post('/projects', protect, requireAdmin, async (req, res, next) => {
  try {
    const { image, title, category, alt, technologies, order } = req.body;
    
    const project = await Project.create({
      image,
      title,
      category,
      alt,
      technologies,
      order: order || 0
    });

    res.status(201).json({ 
      success: true, 
      message: 'Projet créé avec succès',
      data: project 
    });
  } catch (err) {
    next(err);
  }
});

// Mettre à jour un projet
router.put('/projects/:id', protect, requireAdmin, async (req, res, next) => {
  try {
    const { image, title, category, alt, technologies, order, isActive } = req.body;
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { image, title, category, alt, technologies, order, isActive },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }

    res.json({ 
      success: true, 
      message: 'Projet mis à jour avec succès',
      data: project 
    });
  } catch (err) {
    next(err);
  }
});

// Supprimer un projet
router.delete('/projects/:id', protect, requireAdmin, async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }

    res.json({ 
      success: true, 
      message: 'Projet supprimé avec succès' 
    });
  } catch (err) {
    next(err);
  }
});

// Récupérer un projet spécifique
router.get('/projects/:id', protect, requireAdmin, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }

    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
});

module.exports = router;


