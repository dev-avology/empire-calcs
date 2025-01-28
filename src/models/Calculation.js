import mongoose from 'mongoose';

const CalculationSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['seller', 'buyer']
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
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent'
    },
    inputs: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },
    results: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },
    pdfId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'uploads.files'
    },
    webhookStatus: {
        sent: {
            type: Boolean,
            default: false
        },
        error: String,
        sentAt: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Calculation', CalculationSchema);
