-- Complete Database Setup with All Required Tables
-- Run this script to ensure all tables exist with correct schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rooms table with all required fields
CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    number TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    room_type TEXT,
    category TEXT NOT NULL DEFAULT 'Standard',
    status TEXT NOT NULL DEFAULT 'Clean',
    price TEXT NOT NULL,  -- Changed to TEXT to handle flexible price formats
    assigned_to TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    email TEXT NOT NULL,
    rate_code TEXT,
    credit_limit DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Guests table with all required fields
CREATE TABLE IF NOT EXISTS guests (
    id TEXT PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    name TEXT,
    email TEXT,
    phone TEXT,
    id_type TEXT,
    id_number TEXT,
    company TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
    id TEXT PRIMARY KEY,
    guest_name TEXT NOT NULL,
    room_id TEXT REFERENCES rooms(id),
    check_in TEXT NOT NULL,
    check_out TEXT NOT NULL,
    total_amount DECIMAL(10, 2) DEFAULT 0,
    amount_paid DECIMAL(10, 2) DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Room Revenue table
CREATE TABLE IF NOT EXISTS room_revenue (
    id TEXT PRIMARY KEY,
    room_id TEXT REFERENCES rooms(id) ON DELETE CASCADE,
    reservation_id TEXT REFERENCES reservations(id),
    amount DECIMAL(10, 2) NOT NULL,
    revenue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

-- Maintenance Tickets table
CREATE TABLE IF NOT EXISTS maintenance_tickets (
    id TEXT PRIMARY KEY,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Open',
    assigned_to TEXT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    number TEXT UNIQUE NOT NULL,
    guest_name TEXT NOT NULL,
    date TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Super Administrator (password: password123)
INSERT INTO users (id, name, email, password_hash, role)
VALUES 
('admin-seed-id', 'Super Admin', 'superadmin@ife.com', '$2b$10$fVuO23NA..6A/9m0beyB7ezDZtpIaTuoPK7poLY2ts082WD81EwNu', 'Administrator')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_rooms_category ON rooms(category);
CREATE INDEX IF NOT EXISTS idx_reservations_room_id ON reservations(room_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
