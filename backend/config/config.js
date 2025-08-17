require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio',
    JWT_SECRET: process.env.JWT_SECRET || 'votre_secret_jwt',
    NODE_ENV: process.env.NODE_ENV || 'development',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'https://personal-portfolio-353x.onrender.com',
    ADMIN_CORS_ORIGIN: process.env.ADMIN_CORS_ORIGIN || 'http://localhost:5174'
};

