import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Register
router.post('/register', async (req, res) => {
    const { name, email, password, role, avatar } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const id = `user_${Date.now()}`;
        await db.run(
            'INSERT INTO users (id, name, email, password, role, avatar) VALUES (?, ?, ?, ?, ?, ?)',
            [id, name, email, hashedPassword, role, avatar || 'https://ui-avatars.com/api/?name=' + name]
        );
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) return res.status(400).json({ message: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        
        // Return user info without password
        const { password: _, ...userInfo } = user;
        res.json({ token, user: userInfo });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Get Current User
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await db.get('SELECT id, name, email, role, avatar FROM users WHERE id = ?', [req.user.id]);
        if (!user) return res.sendStatus(404);
        res.json(user);
    } catch (error) {
        res.sendStatus(500);
    }
});

export default router;
