import express from 'express';
import Submission from '../../models/Submission.js';
import Calculator from '../../models/Calculator.js';
import fetch from 'node-fetch';

const router = express.Router();

// Get all submissions with filtering and pagination
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search, calculator, agent, status } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { 'contact.email': new RegExp(search, 'i') },
                { 'contact.firstName': new RegExp(search, 'i') },
                { 'contact.lastName': new RegExp(search, 'i') }
            ];
        }

        if (calculator) query.calculator = calculator;
        if (agent) query.agent = agent;
        if (status) query.status = status;

        const submissions = await Submission.find(query)
            .populate('calculator', 'name type')
            .populate('agent', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Submission.countDocuments(query);

        res.json({
            submissions,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single submission
router.get('/:id', async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id)
            .populate('calculator')
            .populate('agent');
        if (!submission) return res.status(404).json({ error: 'Submission not found' });
        res.json(submission);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new submission
router.post('/', async (req, res) => {
    try {
        const calculator = await Calculator.findById(req.body.calculator);
        if (!calculator) return res.status(404).json({ error: 'Calculator not found' });

        const submission = new Submission({
            ...req.body,
            metadata: {
                userAgent: req.headers['user-agent'],
                ipAddress: req.ip,
                referrer: req.headers.referer
            }
        });

        await submission.save();

        // Increment calculator submission count
        await Calculator.findByIdAndUpdate(calculator._id, {
            $inc: { submissionCount: 1 }
        });

        // Send webhook if URL exists
        if (calculator.webhookUrl) {
            try {
                const response = await fetch(calculator.webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(submission)
                });

                if (!response.ok) throw new Error('Webhook failed');

                submission.webhook = {
                    status: 'sent',
                    lastAttempt: new Date()
                };
            } catch (error) {
                submission.webhook = {
                    status: 'failed',
                    attempts: [{ date: new Date(), error: error.message }],
                    lastAttempt: new Date()
                };
            }
            await submission.save();
        }

        res.status(201).json(submission);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Resend webhook
router.post('/:id/resend-webhook', async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id)
            .populate('calculator');
        if (!submission) return res.status(404).json({ error: 'Submission not found' });

        if (!submission.calculator.webhookUrl) {
            return res.status(400).json({ error: 'No webhook URL configured' });
        }

        try {
            const response = await fetch(submission.calculator.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submission)
            });

            if (!response.ok) throw new Error('Webhook failed');

            submission.webhook = {
                status: 'sent',
                lastAttempt: new Date(),
                attempts: [
                    ...(submission.webhook?.attempts || []),
                    { date: new Date(), error: null }
                ]
            };
            await submission.save();

            res.json({ message: 'Webhook resent successfully' });
        } catch (error) {
            submission.webhook = {
                status: 'failed',
                lastAttempt: new Date(),
                attempts: [
                    ...(submission.webhook?.attempts || []),
                    { date: new Date(), error: error.message }
                ]
            };
            await submission.save();
            throw error;
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get submission PDF
router.get('/:id/pdf', async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id);
        if (!submission) return res.status(404).json({ error: 'Submission not found' });
        if (!submission.pdf?.url) return res.status(404).json({ error: 'PDF not found' });

        res.redirect(submission.pdf.url);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
