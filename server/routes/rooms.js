import express from 'express';
import { db } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all rooms
router.get('/', async (req, res) => {
    try {
        const rooms = await db.all('SELECT * FROM rooms');
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create room
router.post('/', authenticateToken, async (req, res) => {
    const { id, number, type, status, price, assignedStaffId } = req.body;
    try {
        await db.run(
            'INSERT INTO rooms (id, number, type, status, price, assignedStaffId) VALUES (?, ?, ?, ?, ?, ?)',
            [id, number, type, status, price, assignedStaffId]
        );
        res.status(201).json({ message: 'Room created' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update room
router.put('/:id', authenticateToken, async (req, res) => {
    const { number, type, status, price, assignedStaffId } = req.body;
    try {
        await db.run(
            'UPDATE rooms SET number = ?, type = ?, status = ?, price = ?, assignedStaffId = ? WHERE id = ?',
            [number, type, status, price, assignedStaffId, req.params.id]
        );
        res.json({ message: 'Room updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete room
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await db.run('DELETE FROM rooms WHERE id = ?', [req.params.id]);
        res.json({ message: 'Room deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
