import express from 'express';
import multer from 'multer';
import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';
import Agent from '../../models/Agent.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get all agents
router.get('/', async (req, res) => {
    try {
        const agents = await Agent.find()
            .select('-__v')
            .sort({ name: 1 });
        res.json(agents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new agent
router.post('/', upload.single('photo'), async (req, res) => {
    try {
        const agentData = JSON.parse(req.body.data);
        let photoUrl;

        if (req.file) {
            const bucket = new GridFSBucket(mongoose.connection.db);
            const uploadStream = bucket.openUploadStream(req.file.originalname);
            await new Promise((resolve, reject) => {
                uploadStream.end(req.file.buffer, (err) => {
                    if (err) reject(err);
                    resolve();
                });
            });
            photoUrl = `/api/uploads/${uploadStream.id}`;
        }

        const agent = new Agent({
            ...agentData,
            photoUrl
        });

        await agent.save();
        res.status(201).json(agent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update an agent
router.put('/:id', upload.single('photo'), async (req, res) => {
    try {
        const agentData = JSON.parse(req.body.data);
        let photoUrl;

        if (req.file) {
            // Delete old photo if exists
            const agent = await Agent.findById(req.params.id);
            if (agent.photoUrl) {
                const oldFileId = agent.photoUrl.split('/').pop();
                const bucket = new GridFSBucket(mongoose.connection.db);
                try {
                    await bucket.delete(new mongoose.Types.ObjectId(oldFileId));
                } catch (err) {
                    console.error('Error deleting old photo:', err);
                }
            }

            // Upload new photo
            const bucket = new GridFSBucket(mongoose.connection.db);
            const uploadStream = bucket.openUploadStream(req.file.originalname);
            await new Promise((resolve, reject) => {
                uploadStream.end(req.file.buffer, (err) => {
                    if (err) reject(err);
                    resolve();
                });
            });
            photoUrl = `/api/uploads/${uploadStream.id}`;
        }

        const updatedAgent = await Agent.findByIdAndUpdate(
            req.params.id,
            {
                ...agentData,
                ...(photoUrl && { photoUrl })
            },
            { new: true }
        );

        if (!updatedAgent) return res.status(404).json({ error: 'Agent not found' });
        res.json(updatedAgent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete an agent
router.delete('/:id', async (req, res) => {
    try {
        const agent = await Agent.findById(req.params.id);
        if (!agent) return res.status(404).json({ error: 'Agent not found' });

        // Delete photo if exists
        if (agent.photoUrl) {
            const fileId = agent.photoUrl.split('/').pop();
            const bucket = new GridFSBucket(mongoose.connection.db);
            try {
                await bucket.delete(new mongoose.Types.ObjectId(fileId));
            } catch (err) {
                console.error('Error deleting photo:', err);
            }
        }

        await agent.remove();
        res.json({ message: 'Agent deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Toggle agent active status
router.post('/:id/toggle-active', async (req, res) => {
    try {
        const agent = await Agent.findById(req.params.id);
        if (!agent) return res.status(404).json({ error: 'Agent not found' });

        agent.active = !agent.active;
        await agent.save();

        res.json(agent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
