import express from 'express';
import pg from 'pg';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_this';

// Middleware
app.use(cors());
app.use(express.json());

// Database Configuration (User must update this)
const dbConfig = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ife_resort_db',
    password: process.env.DB_PASSWORD || 'your_db_password',
    port: process.env.DB_PORT || 5432,
};

const pool = new Pool(dbConfig);

// Test DB Connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Connected to PostgreSQL database');
    release();
});

// --- Authentication Middleware ---

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
        }
        next();
    };
};

// --- Helper Functions ---

const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
};

// --- API Endpoints ---

// 1. Auth: Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) return res.status(400).json({ message: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

        const token = generateToken(user);
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. Auth: Register (Super Admin Creation)
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    
    // Validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    
    try {
        // Check if user already exists
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Generate UUID for the user
        const userId = `admin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Create user with Administrator role
        const result = await pool.query(
            'INSERT INTO users (id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
            [userId, name, email, hashedPassword, 'Administrator']
        );
        
        const user = result.rows[0];
        const token = generateToken(user);
        
        res.status(201).json({ 
            token, 
            user: { id: user.id, name: user.name, email: user.email, role: user.role } 
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: err.message });
    }
});

// 3. Auth: Get Current User (Session Persistence)
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        // req.user is set by authenticateToken middleware
        const result = await pool.query(
            'SELECT id, name, email, role FROM users WHERE id = $1',
            [req.user.id]
        );
        
        const user = result.rows[0];
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (err) {
        console.error('Get current user error:', err);
        res.status(500).json({ message: err.message });
    }
});

// 2. User CRUD: Create Staff (Admin Only)
app.post('/api/admin/users', authenticateToken, authorizeRoles('Administrator'), async (req, res) => {
    const { id, name, email, password, role } = req.body;
    
    // Validation
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    
    try {
        // Check if user already exists
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, created_at',
            [id, name, email, hashedPassword, role]
        );
        
        res.status(201).json({ 
            message: 'User created successfully',
            user: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. User CRUD: List Staff (Admin Only)
app.get('/api/admin/users', authenticateToken, authorizeRoles('Administrator'), async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, role, created_at FROM users');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. User CRUD: Update Staff (Admin Only)
app.put('/api/admin/users/:id', authenticateToken, authorizeRoles('Administrator'), async (req, res) => {
    const { name, email, role } = req.body;
    try {
        await pool.query(
            'UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4',
            [name, email, role, req.params.id]
        );
        res.json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 5. Rooms Status: Real-time Grid (Front Office / HK Supervisor)
app.get('/api/rooms/status', authenticateToken, authorizeRoles('Administrator', 'Front Manager', 'Front Desk Agent', 'Housekeeping Supervisor'), async (req, res) => {
    try {
        const result = await pool.query('SELECT id, number, type, room_type, category, status, price, assigned_to FROM rooms ORDER BY category, number');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 6. Rooms Status: Update Status (HK Staff / HK Supervisor)
app.put('/api/rooms/:id/status', authenticateToken, authorizeRoles('Administrator', 'Housekeeping Supervisor', 'Housekeeping Staff'), async (req, res) => {
    const { status } = req.body; // Dirty -> Cleaning in Progress -> Clean -> Ready
    try {
        await pool.query('UPDATE rooms SET status = $1 WHERE id = $2', [status, req.params.id]);
        res.json({ message: 'Room status updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 6b. Rooms: Create (Admin Only)
app.post('/api/rooms', authenticateToken, authorizeRoles('Administrator'), async (req, res) => {
    const { id, number, type, roomType, category, price, status } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO rooms (id, number, type, room_type, category, price, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [id, number, type, roomType || null, category || 'Standard', price, status || 'Clean']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 6c. Rooms: Update Details (Admin Only)
app.put('/api/rooms/:id', authenticateToken, authorizeRoles('Administrator'), async (req, res) => {
    const { number, type, roomType, category, price, status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE rooms SET number = $1, type = $2, room_type = $3, category = $4, price = $5, status = $6 WHERE id = $7 RETURNING *',
            [number, type, roomType || null, category, price, status, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// 6d. Rooms: Delete (Admin Only)
app.delete('/api/rooms/:id', authenticateToken, authorizeRoles('Administrator'), async (req, res) => {
    try {
        await pool.query('DELETE FROM rooms WHERE id = $1', [req.params.id]);
        res.json({ message: 'Room deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 6e. Rooms: Get by Category (Front Office)
app.get('/api/rooms/category/:category', authenticateToken, authorizeRoles('Administrator', 'Front Manager', 'Front Desk Agent'), async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, number, type, category, status, price FROM rooms WHERE category = $1 AND status IN ($2, $3) ORDER BY number',
            [req.params.category, 'Clean', 'Ready']
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 6f. Rooms: Get Available Categories (Front Office)
app.get('/api/rooms/categories', authenticateToken, authorizeRoles('Administrator', 'Front Manager', 'Front Desk Agent'), async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT DISTINCT category, COUNT(*) as room_count FROM rooms WHERE status IN ($1, $2) GROUP BY category ORDER BY category',
            ['Clean', 'Ready']
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 7. HK Tasks: List Dirty/Ready Rooms (HK Supervisor)
app.get('/api/rooms/dirty', authenticateToken, authorizeRoles('Administrator', 'Housekeeping Supervisor'), async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM rooms WHERE status IN ('Dirty', 'Ready')");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 8. HK Tasks: Assign Room (HK Supervisor)
app.put('/api/rooms/:id/assign', authenticateToken, authorizeRoles('Administrator', 'Housekeeping Supervisor'), async (req, res) => {
    const { assignedTo } = req.body; // User ID of HK Staff
    try {
        await pool.query('UPDATE rooms SET assigned_to = $1 WHERE id = $2', [assignedTo, req.params.id]);
        res.json({ message: 'Room assigned to staff' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 9. Reservations: Create Booking (Front Desk)
app.post('/api/reservations', authenticateToken, authorizeRoles('Administrator', 'Front Manager', 'Front Desk Agent'), async (req, res) => {
    const { id, guestName, roomId, checkIn, checkOut, totalAmount } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO reservations (id, guest_name, room_id, check_in, check_out, total_amount, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [id, guestName, roomId, checkIn, checkOut, totalAmount || 0, 'Confirmed']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 10. Reservations: Check-In (Transactional)
app.put('/api/reservations/:id/checkin', authenticateToken, authorizeRoles('Administrator', 'Front Manager', 'Front Desk Agent'), async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Update Reservation
        const resResult = await client.query(
            "UPDATE reservations SET status = 'Checked-In' WHERE id = $1 RETURNING room_id, total_amount, guest_name",
            [req.params.id]
        );
        
        if (resResult.rows.length === 0) throw new Error('Reservation not found');
        const { room_id: roomId, total_amount: totalAmount, guest_name: guestName } = resResult.rows[0];

        // Update Room Status
        await client.query("UPDATE rooms SET status = 'Occupied' WHERE id = $1", [roomId]);

        // Create Revenue Record
        if (totalAmount && totalAmount > 0) {
            await client.query(
                'INSERT INTO room_revenue (id, room_id, reservation_id, amount, description) VALUES ($1, $2, $3, $4, $5)',
                [`rev-${Date.now()}`, roomId, req.params.id, totalAmount, `Check-in: ${guestName}`]
            );
        }

        await client.query('COMMIT');
        res.json({ message: 'Check-in successful' });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: err.message });
    } finally {
        client.release();
    }
});

// 11. Reservations: Check-Out (Transactional)
app.put('/api/reservations/:id/checkout', authenticateToken, authorizeRoles('Administrator', 'Front Manager', 'Front Desk Agent'), async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Update Reservation
        const resResult = await client.query(
            "UPDATE reservations SET status = 'Checked-Out' WHERE id = $1 RETURNING room_id",
            [req.params.id]
        );
        
        if (resResult.rows.length === 0) throw new Error('Reservation not found');
        const roomId = resResult.rows[0].room_id;

        // Update Room Status to Dirty
        await client.query("UPDATE rooms SET status = 'Dirty' WHERE id = $1", [roomId]);

        await client.query('COMMIT');
        res.json({ message: 'Check-out successful' });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: err.message });
    } finally {
        client.release();
    }
});

// 12. Companies: List (Front Office)
app.get('/api/companies', authenticateToken, authorizeRoles('Administrator', 'Front Manager', 'Front Desk Agent'), async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM companies');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 13. Companies: Create (Front Office)
app.post('/api/companies', authenticateToken, authorizeRoles('Administrator', 'Front Manager', 'Front Desk Agent'), async (req, res) => {
    const { id, name, contactPerson, email, rateCode, creditLimit } = req.body;
    try {
        await pool.query(
            'INSERT INTO companies (id, name, contact_person, email, rate_code, credit_limit) VALUES ($1, $2, $3, $4, $5, $6)',
            [id, name, contactPerson, email, rateCode, creditLimit]
        );
        res.status(201).json({ message: 'Company created' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 14. Tickets: Create (All Staff)
app.post('/api/tickets', authenticateToken, async (req, res) => {
    const { id, location, description, priority } = req.body;
    try {
        await pool.query(
            'INSERT INTO maintenance_tickets (id, location, description, priority, status) VALUES ($1, $2, $3, $4, $5)',
            [id, location, description, priority, 'Open']
        );
        res.status(201).json({ message: 'Ticket created' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 15. Tickets: View Manager (Maintenance Manager)
app.get('/api/tickets/manager', authenticateToken, authorizeRoles('Administrator', 'Maintenance Manager'), async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM maintenance_tickets');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 16. Tickets: Assign (Maintenance Manager)
app.put('/api/tickets/:id/assign', authenticateToken, authorizeRoles('Administrator', 'Maintenance Manager'), async (req, res) => {
    const { assignedTo } = req.body; // User ID
    try {
        await pool.query(
            "UPDATE maintenance_tickets SET assigned_to = $1, status = 'In Progress' WHERE id = $2",
            [assignedTo, req.params.id]
        );
        res.json({ message: 'Ticket assigned' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 17. Tickets: Resolve (Maintenance Staff)
app.put('/api/tickets/:id/resolve', authenticateToken, authorizeRoles('Administrator', 'Maintenance Staff', 'Maintenance Manager'), async (req, res) => {
    try {
        await pool.query(
            "UPDATE maintenance_tickets SET status = 'Resolved' WHERE id = $1",
            [req.params.id]
        );
        res.json({ message: 'Ticket resolved' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 18. Reservations: List (Front Desk / Admin)
app.get('/api/reservations', authenticateToken, authorizeRoles('Administrator', 'Front Manager', 'Front Desk Agent'), async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM reservations');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 19. Guests: List (Front Desk / Admin) - Assuming Guests are Users or separate? 
// The PRD didn't explicitly specify a Guests table, but the previous schema had it. 
// The SQL setup script I generated DOES NOT have a 'guests' table, it has 'users', 'rooms', 'reservations', 'companies', 'tickets'.
// 'reservations' has 'guest_name'. 
// If the frontend expects a separate Guests list, I should probably derive it from reservations or add a Guests table.
// Given the PRD "User CRUD" implies Staff, and Reservations have "guest_name", maybe guests are just names?
// However, the frontend `AppContext` has `guests` state.
// I will add a simple Guests table to the SQL and this endpoint to match the frontend's expectation of managing guests.
// Wait, I can't easily edit the SQL file I just made without rewriting it.
// I'll check if I included a Guests table in database_setup.sql. I did NOT.
// I will add it to the SQL file first, then here.
// Actually, let's just fetch unique guest names from reservations for now to satisfy the GET, 
// OR better, add the table. The frontend has "Guest" entity with email, phone etc.
// I will add the Guest table to SQL and here.

app.get('/api/guests', authenticateToken, authorizeRoles('Administrator', 'Front Manager', 'Front Desk Agent'), async (req, res) => {
    try {
        // If I add the table, this works.
        const result = await pool.query('SELECT * FROM guests');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/guests', authenticateToken, authorizeRoles('Administrator', 'Front Manager', 'Front Desk Agent'), async (req, res) => {
    const { id, name, email, phone } = req.body;
    try {
        await pool.query(
            'INSERT INTO guests (id, name, email, phone) VALUES ($1, $2, $3, $4)',
            [id, name, email, phone]
        );
        res.status(201).json({ message: 'Guest created' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 20. Revenue: Get Room Revenue (Admin / Front Manager)
app.get('/api/revenue/rooms', authenticateToken, authorizeRoles('Administrator', 'Front Manager'), async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                r.id,
                r.number,
                r.type,
                COALESCE(SUM(rv.amount), 0) as total_revenue,
                COUNT(rv.id) as booking_count
            FROM rooms r
            LEFT JOIN room_revenue rv ON r.id = rv.room_id
            GROUP BY r.id, r.number, r.type
            ORDER BY total_revenue DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 21. Revenue: Get Total Revenue Stats (Admin / Front Manager)
app.get('/api/revenue/stats', authenticateToken, authorizeRoles('Administrator', 'Front Manager'), async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                COALESCE(SUM(amount), 0) as total_revenue,
                COUNT(id) as total_bookings,
                COALESCE(AVG(amount), 0) as average_revenue
            FROM room_revenue
        `);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 22. Reservations: Update (Admin / Front Desk)
app.put('/api/reservations/:id', authenticateToken, authorizeRoles('Administrator', 'Front Manager', 'Front Desk Agent'), async (req, res) => {
    const { guestName, roomId, checkIn, checkOut, totalAmount, status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE reservations SET guest_name = $1, room_id = $2, check_in = $3, check_out = $4, total_amount = $5, status = $6 WHERE id = $7 RETURNING *',
            [guestName, roomId, checkIn, checkOut, totalAmount, status, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 23. Companies: Get All (All authenticated users)
app.get('/api/companies', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM companies ORDER BY name');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 24. Companies: Create (Admin / Front Manager)
app.post('/api/companies', authenticateToken, authorizeRoles('Administrator', 'Front Manager'), async (req, res) => {
    const { id, name, contactPerson, email, rateCode, creditLimit } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO companies (id, name, contact_person, email, rate_code, credit_limit) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [id, name, contactPerson, email, rateCode || '', creditLimit || 0]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 25. Companies: Update (Admin / Front Manager)
app.put('/api/companies/:id', authenticateToken, authorizeRoles('Administrator', 'Front Manager'), async (req, res) => {
    const { name, contactPerson, email, rateCode, creditLimit } = req.body;
    try {
        const result = await pool.query(
            'UPDATE companies SET name = $1, contact_person = $2, email = $3, rate_code = $4, credit_limit = $5 WHERE id = $6 RETURNING *',
            [name, contactPerson, email, rateCode, creditLimit, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 26. Companies: Delete (Admin Only)
app.delete('/api/companies/:id', authenticateToken, authorizeRoles('Administrator'), async (req, res) => {
    try {
        await pool.query('DELETE FROM companies WHERE id = $1', [req.params.id]);
        res.json({ message: 'Company deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 27. Invoices: Get All (All authenticated users)
app.get('/api/invoices', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM invoices ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 28. Invoices: Create (Front Desk / Admin)
app.post('/api/invoices', authenticateToken, authorizeRoles('Administrator', 'Front Manager', 'Front Desk Agent'), async (req, res) => {
    const { id, number, guestName, date, amount, status } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO invoices (id, number, guest_name, date, amount, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [id, number, guestName, date, amount, status || 'Pending']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('WARNING: Ensure you have updated the dbConfig with your PostgreSQL credentials.');
    console.log('WARNING: Default Super Admin seed password needs to be hashed correctly in database_setup.sql or reset manually.');
});
