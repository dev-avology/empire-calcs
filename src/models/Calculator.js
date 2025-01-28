import mongoose from 'mongoose';

const CalculatorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['seller', 'buyer']
    },
    description: {
        type: String,
        trim: true
    },
    fields: [{
        name: String,
        label: String,
        type: String,
        required: Boolean,
        defaultValue: mongoose.Schema.Types.Mixed,
        options: [String], // For select/radio fields
        validation: {
            type: String, // regex pattern or validation type
            message: String
        }
    }],
    calculations: [{
        name: String,
        formula: String, // JavaScript formula as string
        description: String
    }],
    webhookUrl: String,
    pdfTemplate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'uploads.files'
    },
    createdFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Calculator'
    },
    active: {
        type: Boolean,
        default: true
    },
    submissionCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamps on save
CalculatorSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

export default mongoose.model('Calculator', CalculatorSchema);
