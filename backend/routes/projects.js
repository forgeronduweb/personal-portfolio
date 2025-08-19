const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// @desc    Récupérer tous les projets actifs pour le portfolio public
// @route   GET /api/projects
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select('-__v');
    
    res.json({ 
      success: true, 
      data: projects 
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
