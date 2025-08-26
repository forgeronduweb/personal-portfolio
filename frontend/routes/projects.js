const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// @desc    Récupérer tous les projets actifs pour le portfolio public
// @route   GET /api/projects
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    console.log('API /api/projects called');
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .select('-__v');
    
    console.log('Projects found in DB:', projects.length);
    console.log('Projects data:', JSON.stringify(projects, null, 2));
    
    res.json({ 
      success: true, 
      data: projects 
    });
  } catch (err) {
    console.error('Error in /api/projects:', err);
    next(err);
  }
});

module.exports = router;
