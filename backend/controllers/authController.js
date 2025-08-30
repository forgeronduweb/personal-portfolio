const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Générer le token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, config.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Inscription utilisateur
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        console.log('Données reçues:', req.body);
        const { name, email, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        console.log('Vérification de l\'existence de l\'email:', email);
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('Utilisateur existant trouvé');
            return res.status(400).json({
                success: false,
                message: 'Un utilisateur avec cet email existe déjà'
            });
        }
        console.log('Email disponible, création de l\'utilisateur');

        // Créer l'utilisateur
        const user = await User.create({
            name,
            email,
            password,
            isPremium: true // Pour le moment, tous les nouveaux utilisateurs sont premium
        });

        // Générer le token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isPremium: user.isPremium,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Créer un administrateur
// @route   POST /api/auth/create-admin
// @access  Public (temporaire pour setup initial)
exports.createAdmin = async (req, res, next) => {
    try {
        console.log('=== CREATE ADMIN DEBUG ===');
        console.log('Request body:', req.body);
        console.log('ADMIN_SETUP_KEY from env:', process.env.ADMIN_SETUP_KEY);
        console.log('adminKey from request:', req.body.adminKey);
        
        const { name, email, password, adminKey } = req.body;

        // Clé secrète pour créer un admin (sécurité basique)
        if (adminKey !== config.ADMIN_SETUP_KEY) {
            console.log('Admin key mismatch!');
            return res.status(403).json({
                success: false,
                message: 'Clé administrateur invalide'
            });
        }

        // Vérifier si l'utilisateur existe déjà
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Un utilisateur avec cet email existe déjà'
            });
        }

        // Créer l'administrateur
        const admin = await User.create({
            name,
            email,
            password,
            role: 'admin',
            isPremium: true
        });

        // Générer le token
        const token = generateToken(admin._id);

        res.status(201).json({
            success: true,
            message: 'Administrateur créé avec succès',
            token,
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                isPremium: admin.isPremium,
                role: admin.role
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Connexion utilisateur
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Vérifier si l'email et le mot de passe sont fournis
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Veuillez fournir un email et un mot de passe'
            });
        }

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Vérifier si le mot de passe est correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Générer le token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isPremium: user.isPremium,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Obtenir le profil utilisateur
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isPremium: user.isPremium,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};
