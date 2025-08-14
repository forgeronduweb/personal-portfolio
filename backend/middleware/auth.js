const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    try {
        let token;
        
        // Vérifier si le token existe dans les headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Veuillez vous connecter pour accéder à cette ressource' 
            });
        }

        try {
            // Vérifier le token
            const decoded = jwt.verify(token, config.JWT_SECRET);

            // Vérifier si l'utilisateur existe toujours
            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Utilisateur non trouvé' 
                });
            }

            // Ajouter l'utilisateur à la requête
            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ 
                success: false, 
                message: 'Token invalide ou expiré' 
            });
        }
    } catch (error) {
        next(error);
    }
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: "Vous n'avez pas les droits pour effectuer cette action" 
            });
        }
        next();
    };
};

// Middleware spécifique pour les routes admin
exports.requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "Accès réservé à l'administrateur"
        });
    }
    next();
};