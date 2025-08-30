require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET || 'votre_secret_jwt',
    NODE_ENV: process.env.NODE_ENV || 'production',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
    ADMIN_CORS_ORIGIN: process.env.ADMIN_CORS_ORIGIN || 'http://localhost:5174',
    ADMIN_SETUP_KEY: process.env.ADMIN_SETUP_KEY
};
