import express from 'express';
import { db } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all invoices
router.get('/', async (req, res) => {
    try {
        const invoices = await db.all('SELECT * FROM invoices');
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create invoice
router.post('/', authenticateToken, async (req, res) => {
    const { id, number, guestName, date, amount, status } = req.body;
    try {
        await db.run(
            'INSERT INTO invoices (id, number, guestName, date, amount, status) VALUES (?, ?, ?, ?, ?, ?)',
            [id, number, guestName, date, amount, status]
        );
        res.status(201).json({ message: 'Invoice created' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
