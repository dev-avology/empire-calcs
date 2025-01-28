import express from 'express';
import Submission from '../../models/Submission.js';
import Calculator from '../../models/Calculator.js';
import Agent from '../../models/Agent.js';

const router = express.Router();

// Get dashboard stats
router.get('/stats', async (req, res) => {
    try {
        const [
            totalSubmissions,
            activeCalculators,
            activeAgents,
            recentSubmissions
        ] = await Promise.all([
            Submission.countDocuments(),
            Calculator.countDocuments({ active: true }),
            Agent.countDocuments({ active: true }),
            Submission.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('calculator', 'name')
                .populate('agent', 'name')
        ]);

        res.json({
            totalSubmissions,
            activeCalculators,
            activeAgents,
            recentSubmissions
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get submission trends
router.get('/trends', async (req, res) => {
    try {
        const { period = '7d' } = req.query;
        let days;
        
        switch (period) {
            case '7d':
                days = 7;
                break;
            case '30d':
                days = 30;
                break;
            case '90d':
                days = 90;
                break;
            default:
                days = 7;
        }

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const submissions = await Submission.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.json(submissions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get recent activity
router.get('/activity', async (req, res) => {
    try {
        const recentActivity = await Submission.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('calculator', 'name')
            .populate('agent', 'name')
            .select('createdAt calculator agent contact status');

        res.json(recentActivity);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
