const mongoose = require('mongoose');

const siteRequestSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "L'email est requis"],
        trim: true,
        lowercase: true
    },
    companyName: {
        type: String,
        required: [true, "Le nom de l'entreprise est requis"],
        trim: true
    },
    projectType: {
        type: String,
        required: [true, "Le type de projet est requis"],
        enum: ['ecommerce', 'corporate', 'portfolio', 'blog', 'landing', 'other']
    },
    targetAudience: {
        type: String,
        required: [true, "Le public cible est requis"],
        trim: true
    },
    pages: {
        type: String,
        required: [true, "Les pages souhaitées sont requises"],
        trim: true
    },
    features: {
        type: String,
        required: [true, "Les fonctionnalités sont requises"],
        trim: true
    },
    designStyle: {
        type: String,
        required: [true, "Le style de design est requis"],
        enum: ['modern', 'classic', 'creative', 'minimalist', 'colorful', 'other']
    },
    budget: {
        type: String,
        enum: ['150000-300000', '300000-600000', '600000-1000000', '1000000-2000000', '2000000+', 'flexible', ''],
        default: ''
    },
    timeline: {
        type: String,
        required: [true, "Le délai est requis"],
        enum: ['urgent', 'normal', 'flexible']
    },
    additionalInfo: {
        type: String,
        trim: true,
        default: ''
    },
    attachments: [{
        filename: {
            type: String,
            required: true
        },
        originalName: {
            type: String,
            required: true
        },
        path: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        mimetype: {
            type: String,
            required: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    quote: {
        amount: {
            type: Number,
            min: 0
        },
        currency: {
            type: String,
            default: 'XOF'
        },
        description: {
            type: String,
            trim: true
        },
        sentAt: {
            type: Date
        }
    },
    adminNotes: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SiteRequest', siteRequestSchema);
