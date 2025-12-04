import express from 'express';
import { db } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all reservations
router.get('/', async (req, res) => {
    try {
        const reservations = await db.all('SELECT * FROM reservations');
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create reservation
router.post('/', authenticateToken, async (req, res) => {
    const { id, guestName, roomId, checkIn, checkOut, status, totalAmount } = req.body;
    try {
        await db.run(
            'INSERT INTO reservations (id, guestName, roomId, checkIn, checkOut, status, totalAmount) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, guestName, roomId, checkIn, checkOut, status, totalAmount]
        );
        res.status(201).json({ message: 'Reservation created' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update reservation
router.put('/:id', authenticateToken, async (req, res) => {
    const { guestName, roomId, checkIn, checkOut, status, totalAmount } = req.body;
    try {
        await db.run(
            'UPDATE reservations SET guestName = ?, roomId = ?, checkIn = ?, checkOut = ?, status = ?, totalAmount = ? WHERE id = ?',
            [guestName, roomId, checkIn, checkOut, status, totalAmount, req.params.id]
        );
        res.json({ message: 'Reservation updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
