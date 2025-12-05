// Test database connection and rooms table
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const dbConfig = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ife_resort_db',
    password: process.env.DB_PASSWORD || 'your_db_password',
    port: process.env.DB_PORT || 5432,
};

const pool = new Pool(dbConfig);

async function testDatabase() {
    try {
        console.log('Testing database connection...');
        
        // Test connection
        const client = await pool.connect();
        console.log('✅ Connected to PostgreSQL database');
        
        // Check if rooms table exists
        const tableCheck = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'rooms'
            );
        `);
        
        if (tableCheck.rows[0].exists) {
            console.log('✅ Rooms table exists');
            
            // Get table structure
            const structure = await client.query(`
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = 'rooms'
                ORDER BY ordinal_position;
            `);
            
            console.log('\n📋 Rooms table structure:');
            structure.rows.forEach(col => {
                console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
            });
            
            // Count existing rooms
            const count = await client.query('SELECT COUNT(*) FROM rooms');
            console.log(`\n📊 Current rooms count: ${count.rows[0].count}`);
            
            // Show existing rooms
            if (parseInt(count.rows[0].count) > 0) {
                const rooms = await client.query('SELECT id, number, type, price, status FROM rooms LIMIT 5');
                console.log('\n🏨 Sample rooms:');
                rooms.rows.forEach(room => {
                    console.log(`  - Room ${room.number} (${room.type}): ₦${room.price} - ${room.status}`);
                });
            }
        } else {
            console.log('❌ Rooms table does not exist!');
            console.log('Please run: psql -U postgres -d ife_resort_db -f server/database_setup.sql');
        }
        
        client.release();
        await pool.end();
        
    } catch (error) {
        console.error('❌ Database error:', error.message);
        console.error('\nPlease check:');
        console.error('1. PostgreSQL is running');
        console.error('2. Database "ife_resort_db" exists');
        console.error('3. .env file has correct credentials');
        process.exit(1);
    }
}

testDatabase();
