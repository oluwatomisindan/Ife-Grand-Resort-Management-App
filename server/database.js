import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';

// Open SQLite database
export const dbPromise = open({
    filename: './server/database.sqlite',
    driver: sqlite3.Database
});

export let db;

(async () => {
    db = await dbPromise;
    console.log('Connected to SQLite database.');

    // Enable foreign keys
    await db.run('PRAGMA foreign_keys = ON');

    // Create Users Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL,
            avatar TEXT
        )
    `);

    // Create Rooms Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS rooms (
            id TEXT PRIMARY KEY,
            number TEXT NOT NULL,
            type TEXT NOT NULL,
            status TEXT NOT NULL,
            price REAL NOT NULL,
            assignedStaffId TEXT
        )
    `);

    // Create Guests Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS guests (
            id TEXT PRIMARY KEY,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            idType TEXT,
            idNumber TEXT,
            company TEXT
        )
    `);

    // Create Reservations Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS reservations (
            id TEXT PRIMARY KEY,
            guestName TEXT NOT NULL,
            roomId TEXT NOT NULL,
            checkIn TEXT NOT NULL,
            checkOut TEXT NOT NULL,
            status TEXT NOT NULL,
            totalAmount REAL NOT NULL,
            FOREIGN KEY (roomId) REFERENCES rooms(id)
        )
    `);

    // Create Staff Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS staff (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            avatar TEXT
        )
    `);

    // Create Companies Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS companies (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            contactPerson TEXT NOT NULL,
            email TEXT NOT NULL,
            rateCode TEXT NOT NULL,
            creditLimit REAL NOT NULL
        )
    `);

    // Create Maintenance Tickets Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS maintenance_tickets (
            id TEXT PRIMARY KEY,
            location TEXT NOT NULL,
            description TEXT NOT NULL,
            priority TEXT NOT NULL,
            status TEXT NOT NULL,
            assignedTo TEXT,
            createdAt TEXT NOT NULL
        )
    `);

    // Create Invoices Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS invoices (
            id TEXT PRIMARY KEY,
            number TEXT NOT NULL,
            guestName TEXT NOT NULL,
            date TEXT NOT NULL,
            amount REAL NOT NULL,
            status TEXT NOT NULL
        )
    `);

    // Seed Super Admin if not exists
    const admin = await db.get('SELECT * FROM users WHERE email = ?', ['admin@example.com']);
    if (!admin) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await db.run(
            'INSERT INTO users (id, name, email, password, role, avatar) VALUES (?, ?, ?, ?, ?, ?)',
            ['user_1', 'Super Admin', 'admin@example.com', hashedPassword, 'Super Admin', 'https://ui-avatars.com/api/?name=Super+Admin']
        );
        console.log('Super Admin account created: admin@example.com / password123');
    }

})();
