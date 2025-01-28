import express from 'express';
import Calculator from '../../models/Calculator.js';

const router = express.Router();

// Get all calculators
router.get('/', async (req, res) => {
    try {
        const calculators = await Calculator.find();
        res.json(calculators);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new calculator
router.post('/', async (req, res) => {
    try {
        const calculator = new Calculator(req.body);
        await calculator.save();
        res.status(201).json(calculator);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a calculator
router.put('/:id', async (req, res) => {
    try {
        const calculator = await Calculator.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!calculator) return res.status(404).json({ error: 'Calculator not found' });
        res.json(calculator);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a calculator
router.delete('/:id', async (req, res) => {
    try {
        const calculator = await Calculator.findByIdAndDelete(req.params.id);
        if (!calculator) return res.status(404).json({ error: 'Calculator not found' });
        res.json({ message: 'Calculator deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Clone a calculator
router.post('/:id/clone', async (req, res) => {
    try {
        const source = await Calculator.findById(req.params.id);
        if (!source) return res.status(404).json({ error: 'Calculator not found' });

        const clone = new Calculator({
            ...source.toObject(),
            _id: undefined,
            name: `${source.name} (Copy)`,
            createdFrom: source._id,
            submissionCount: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await clone.save();
        res.status(201).json(clone);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
