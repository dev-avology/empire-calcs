import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
    calculator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Calculator',
        required: true
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent'
    },
    contact: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String
    },
    property: {
        address: String,
        city: String,
        state: String,
        zip: String
    },
    inputs: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },
    results: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },
    pdf: {
        fileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'uploads.files'
        },
        url: String
    },
    webhook: {
        status: {
            type: String,
            enum: ['pending', 'sent', 'failed'],
            default: 'pending'
        },
        attempts: [{
            date: Date,
            error: String
        }],
        lastAttempt: Date
    },
    status: {
        type: String,
        enum: ['success', 'pending', 'failed'],
        default: 'pending'
    },
    metadata: {
        userAgent: String,
        ipAddress: String,
        referrer: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient querying
SubmissionSchema.index({ createdAt: -1 });
SubmissionSchema.index({ 'contact.email': 1 });
SubmissionSchema.index({ calculator: 1 });
SubmissionSchema.index({ agent: 1 });

export default mongoose.model('Submission', SubmissionSchema);
