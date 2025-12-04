import express from 'express';
import { db } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all guests
router.get('/', async (req, res) => {
    try {
        const guests = await db.all('SELECT * FROM guests');
        res.json(guests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create guest
router.post('/', authenticateToken, async (req, res) => {
    const { id, firstName, lastName, email, phone, idType, idNumber, company } = req.body;
    try {
        await db.run(
            'INSERT INTO guests (id, firstName, lastName, email, phone, idType, idNumber, company) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, firstName, lastName, email, phone, idType, idNumber, company]
        );
        res.status(201).json({ message: 'Guest created' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update guest
router.put('/:id', authenticateToken, async (req, res) => {
    const { firstName, lastName, email, phone, idType, idNumber, company } = req.body;
    try {
        await db.run(
            'UPDATE guests SET firstName = ?, lastName = ?, email = ?, phone = ?, idType = ?, idNumber = ?, company = ? WHERE id = ?',
            [firstName, lastName, email, phone, idType, idNumber, company, req.params.id]
        );
        res.json({ message: 'Guest updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
