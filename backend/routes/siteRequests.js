const express = require('express');
const router = express.Router();
const SiteRequest = require('../models/SiteRequest');
const { protect, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @desc    Créer une nouvelle demande de site
// @route   POST /api/site-requests
// @access  Public
router.post('/', upload.array('attachments', 5), async (req, res, next) => {
    try {
        const {
            email,
            companyName,
            projectType,
            targetAudience,
            pages,
            features,
            designStyle,
            budget,
            timeline,
            additionalInfo
        } = req.body;

        // Traiter les fichiers uploadés
        const attachments = req.files ? req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
            size: file.size,
            mimetype: file.mimetype
        })) : [];

        const siteRequest = await SiteRequest.create({
            email,
            companyName,
            projectType,
            targetAudience,
            pages,
            features,
            designStyle,
            budget,
            timeline,
            additionalInfo,
            attachments
        });

        res.status(201).json({
            success: true,
            message: 'Demande de site enregistrée avec succès',
            data: siteRequest
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Récupérer toutes les demandes de sites (admin)
// @route   GET /api/site-requests
// @access  Private/Admin
router.get('/', protect, requireAdmin, async (req, res, next) => {
    try {
        const siteRequests = await SiteRequest.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: siteRequests.length,
            data: siteRequests
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Mettre à jour le statut d'une demande
// @route   PATCH /api/site-requests/:id/status
// @access  Private/Admin
router.patch('/:id/status', protect, requireAdmin, async (req, res, next) => {
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
                message: 'Demande de site non trouvée'
            });
        }

        res.status(200).json({
            success: true,
            data: siteRequest
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
