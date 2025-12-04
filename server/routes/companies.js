import express from 'express';
import { db } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all companies
router.get('/', async (req, res) => {
    try {
        const companies = await db.all('SELECT * FROM companies');
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create company
router.post('/', authenticateToken, async (req, res) => {
    const { id, name, contactPerson, email, rateCode, creditLimit } = req.body;
    try {
        await db.run(
            'INSERT INTO companies (id, name, contactPerson, email, rateCode, creditLimit) VALUES (?, ?, ?, ?, ?, ?)',
            [id, name, contactPerson, email, rateCode, creditLimit]
        );
        res.status(201).json({ message: 'Company created' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update company
router.put('/:id', authenticateToken, async (req, res) => {
    const { name, contactPerson, email, rateCode, creditLimit } = req.body;
    try {
        await db.run(
            'UPDATE companies SET name = ?, contactPerson = ?, email = ?, rateCode = ?, creditLimit = ? WHERE id = ?',
            [name, contactPerson, email, rateCode, creditLimit, req.params.id]
        );
        res.json({ message: 'Company updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete company
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await db.run('DELETE FROM companies WHERE id = ?', [req.params.id]);
        res.json({ message: 'Company deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
