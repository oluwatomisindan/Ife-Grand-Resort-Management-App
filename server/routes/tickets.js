import express from 'express';
import { db } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all tickets
router.get('/', async (req, res) => {
    try {
        const tickets = await db.all('SELECT * FROM maintenance_tickets');
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create ticket
router.post('/', authenticateToken, async (req, res) => {
    const { id, location, description, priority, status, assignedTo, createdAt } = req.body;
    try {
        await db.run(
            'INSERT INTO maintenance_tickets (id, location, description, priority, status, assignedTo, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, location, description, priority, status, assignedTo, createdAt]
        );
        res.status(201).json({ message: 'Ticket created' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update ticket
router.put('/:id', authenticateToken, async (req, res) => {
    const { location, description, priority, status, assignedTo } = req.body;
    try {
        await db.run(
            'UPDATE maintenance_tickets SET location = ?, description = ?, priority = ?, status = ?, assignedTo = ? WHERE id = ?',
            [location, description, priority, status, assignedTo, req.params.id]
        );
        res.json({ message: 'Ticket updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
