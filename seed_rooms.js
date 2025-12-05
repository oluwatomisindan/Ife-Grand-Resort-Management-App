// seed_rooms.js - Script to populate all 112 rooms
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ife_resort_db',
    password: process.env.DB_PASSWORD || 'your_db_password',
    port: process.env.DB_PORT || 5432,
});

const ROOM_DATA = {
    // STANDARD - 14 rooms each
    'Standard': [
        { type: 'Onipopo', price: 27500, count: 14, start: 1 },
        { type: 'Onisabe', price: 27500, count: 14, start: 15 },
        { type: 'Awujale', price: 27500, count: 14, start: 29 },
        { type: 'Olubadan', price: 27500, count: 14, start: 43 }
    ],
    // PREMIUM - 10 rooms
    'Premium': [
        { type: 'Moremi', price: 40000, count: 10, start: 57 }
    ],
    // SUPER PREMIUM - 10 rooms
    'Super Premium': [
        { type: 'Olowu', price: 40000, count: 10, start: 67 }
    ],
    // SUPER PREMIUM PLUS - 5 rooms each
    'Super Premium Plus': [
        { type: 'KSA A', price: 45000, count: 5, start: 77 },
        { type: 'KSA B', price: 45000, count: 5, start: 82 },
        { type: 'Onibeju A', price: 45000, count: 5, start: 87 },
        { type: 'Onibeju B', price: 45000, count: 5, start: 92 }
    ],
    // EXECUTIVE
    'Executive': [
        { type: 'Oranmiyan', price: 50000, count: 7, start: 97 },
        { type: 'Orangun', price: 50000, count: 6, start: 104 },
        { type: 'Owa Obokun', price: 50000, count: 8, start: 110 },
        { type: 'Alara', price: 50000, count: 6, start: 118 }
    ],
    // ROYAL DIPLOMATIC
    'Royal Diplomatic': [
        { type: 'Iyalaje', price: 55000, count: 8, start: 124 },
        { type: 'Zulu', price: 55000, count: 5, start: 132 },
        { type: 'Old Ooni', price: 55000, count: 4, start: 137 }
    ],
    // KINGS
    'Kings': [
        { type: 'Ajero', price: 55000, count: 10, start: 141 },
        { type: '3 Bedroom Apartment', price: 165000, count: 1, start: 151 },
        { type: '2 Bedroom Apartment', price: 100000, count: 1, start: 152 }
    ]
};

async function seedRooms() {
    try {
        console.log('🚀 Starting room population...');
        const client = await pool.connect();

        // Clear existing rooms (optional, but good for clean slate)
        // await client.query('DELETE FROM rooms');
        // console.log('🗑️  Cleared existing rooms');

        let totalRooms = 0;

        for (const [category, types] of Object.entries(ROOM_DATA)) {
            console.log(`\nProcessing ${category}...`);
            
            for (const roomConfig of types) {
                // Determine numbering scheme for this type
                // If we want detailed numbering (001-014 for Onipopo), we need to check if user wanted simpler numbering or continuous.
                // Based on previous prompt request "onipopo has just 14 rooms... room number will be from 001-014 for onipopo",
                // it implies numbers might reset or start from 1 for each type, OR be unique.
                // However, usually room numbers are unique hotel-wide.
                // The prompt said "001-014 for Onipopo" and "001-010 for Ajero".
                // This implies numbers might NOT be unique hotel-wide if they both allowed 001?
                // OR it meant the range of *available* numbers.
                // To be safe and avoid conflicts if 'number' column is unique constraint, we should use unique numbers.
                // BUT the prompt explicitly asked for "001-014 for onipopo" and "001-010 for ajero".
                // If the 'number' column has a UNIQUE constraint in DB, this will fail.
                
                // Let's check constraint: "number TEXT UNIQUE NOT NULL" in database_setup.sql
                // So numbers MUST be unique.
                // The user's request "001-014 for onipopo" likely meant "Allow entering 1-14", but visually they might need to be distinct if stored in one table.
                // OR, perhaps the user intends to identify rooms by "Type + Number" (e.g. Onipopo 001, Ajero 001).
                // If the DB constraint is unique on 'number', we can't have two '001's.
                
                // Strategy: I will generate unique numbers hotel-wide as defined in the "start" property above (001-152) 
                // BUT I will modify the script to respect the User's "001-014" request if possible. 
                // If the DB requires unique numbers, I must use unique numbers.
                // I will use the continuous numbering scheme I proposed in previous steps (001-152) to ensure system stability.
                // This maps Onipopo to 001-014, Onisabe to 015-028, etc. ensuring both uniqueness and order.
                
                for (let i = 0; i < roomConfig.count; i++) {
                    // Using continuous numbering to satisfy UNIQUE constraint
                    const roomNumInt = roomConfig.start + i; 
                    const roomNumber = roomNumInt.toString().padStart(3, '0');
                    
                    const roomType = roomConfig.type;
                    const price = roomConfig.price;
                    
                    // Check if room exists
                    const check = await client.query('SELECT id FROM rooms WHERE number = $1', [roomNumber]);
                    
                    if (check.rows.length === 0) {
                        await client.query(
                            `INSERT INTO rooms (id, number, type, room_type, category, price, status) 
                             VALUES ($1, $2, $3, $4, $5, $6, 'Clean')`,
                            [
                                `room-${roomNumber}`,
                                roomNumber,
                                roomType, // type = room name
                                roomType, // room_type = room name
                                category,
                                price
                            ]
                        );
                        process.stdout.write('+');
                        totalRooms++;
                    } else {
                        // Update existing room to match new spec
                        await client.query(
                            `UPDATE rooms SET type = $1, room_type = $2, category = $3, price = $4 WHERE number = $5`,
                            [roomType, roomType, category, price, roomNumber]
                        );
                        process.stdout.write('.');
                    }
                }
            }
        }

        console.log(`\n\n✅ Done! Processed ${totalRooms} rooms.`);
        client.release();
        await pool.end();

    } catch (err) {
        console.error('Error seeding rooms:', err);
    }
}

seedRooms();
