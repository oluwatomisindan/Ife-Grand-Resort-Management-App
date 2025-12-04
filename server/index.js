import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

import authRoutes from './routes/auth.js';
import roomRoutes from './routes/rooms.js';
import guestRoutes from './routes/guests.js';
import reservationRoutes from './routes/reservations.js';
import staffRoutes from './routes/staff.js';
import companyRoutes from './routes/companies.js';
import ticketRoutes from './routes/tickets.js';
import invoiceRoutes from './routes/invoices.js';

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/invoices', invoiceRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('Ife Grand Resort API is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
