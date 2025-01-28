import mongoose from 'mongoose';

const AgentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String
    },
    title: {
        type: String
    },
    photoUrl: {
        type: String
    },
    photoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'uploads.files'
    },
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Agent', AgentSchema);
