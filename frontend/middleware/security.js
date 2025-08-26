const helmet = require('helmet');

// Configuration des headers de sécurité
const securityHeaders = (app) => {
  // Helmet pour les headers de sécurité de base
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }));

  // Headers personnalisés supplémentaires
  app.use((req, res, next) => {
    // Empêcher l'embedding dans des iframes
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Empêcher le sniffing MIME
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Protection XSS
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Contrôler les referrers
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Empêcher les requêtes cross-origin non autorisées
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    
    // Permissions Policy (anciennement Feature Policy)
    res.setHeader('Permissions-Policy', 
      'geolocation=(), microphone=(), camera=(), payment=(), usb=()');
    
    next();
  });
};

// Middleware de limitation du taux de requêtes
const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Trop de requêtes, veuillez réessayer plus tard.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Middleware de validation des tokens
const validateSecureToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token manquant'
    });
  }

  try {
    // Validation du token (à adapter selon votre système)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
};

// Middleware de sanitisation des entrées
const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        // Supprimer les scripts et balises dangereuses
        obj[key] = obj[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '');
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  
  next();
};

module.exports = {
  securityHeaders,
  createRateLimiter,
  validateSecureToken,
  sanitizeInput
};
