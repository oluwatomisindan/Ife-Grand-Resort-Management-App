import express from 'express';
import { db } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all staff
router.get('/', async (req, res) => {
    try {
        const staff = await db.all('SELECT * FROM staff');
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create staff
router.post('/', authenticateToken, async (req, res) => {
    const { id, name, role, avatar } = req.body;
    try {
        await db.run(
            'INSERT INTO staff (id, name, role, avatar) VALUES (?, ?, ?, ?)',
            [id, name, role, avatar]
        );
        res.status(201).json({ message: 'Staff created' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update staff
router.put('/:id', authenticateToken, async (req, res) => {
    const { name, role, avatar } = req.body;
    try {
        await db.run(
            'UPDATE staff SET name = ?, role = ?, avatar = ? WHERE id = ?',
            [name, role, avatar, req.params.id]
        );
        res.json({ message: 'Staff updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete staff
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await db.run('DELETE FROM staff WHERE id = ?', [req.params.id]);
        res.json({ message: 'Staff deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
