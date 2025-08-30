const mongoose = require('mongoose');

const siteRequestSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "L'email est requis"],
        trim: true,
        lowercase: true
    },
    purpose: {
        type: String,
        required: [true, "L'objectif du site est requis"],
        trim: true
    },
    pages: {
        type: String,
        required: [true, "Les pages souhaitées sont requises"],
        trim: true
    },
    inspiration: {
        type: String,
        trim: true,
        default: ''
    },
    budget: {
        type: String,
        required: [true, "Le budget est requis"],
        enum: ['under-200k', '200k-400k', '400k-600k', '600k-1m', '1m-1.5m', 'over-1.5m', 'discuss']
    },
    designFiles: [{
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
    timeline: {
        type: String,
        required: [true, "Le délai est requis"],
        enum: ['asap', 'urgent', 'normal', 'relaxed', 'flexible']
    },
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
