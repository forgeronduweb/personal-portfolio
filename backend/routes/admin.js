const express = require('express');
const router = express.Router();
const { protect, requireAdmin } = require('../middleware/auth');
const User = require('../models/User');

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

module.exports = router;


