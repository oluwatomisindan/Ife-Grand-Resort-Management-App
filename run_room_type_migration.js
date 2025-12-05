// Run this script to add room_type column to existing rooms table
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

async function runMigration() {
    try {
        console.log('🔄 Running room_type migration...\n');
        
        const client = await pool.connect();
        
        // Check if room_type column exists
        const checkColumn = await client.query(`
            SELECT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'rooms' AND column_name = 'room_type'
            );
        `);
        
        if (checkColumn.rows[0].exists) {
            console.log('✅ room_type column already exists!');
        } else {
            console.log('📝 Adding room_type column...');
            
            // Add room_type column
            await client.query(`
                ALTER TABLE rooms ADD COLUMN room_type TEXT;
            `);
            
            console.log('✅ room_type column added successfully');
        }
        
        // Show current rooms
        const rooms = await client.query('SELECT number, type, room_type, category, price FROM rooms ORDER BY category, number LIMIT 10');
        
        console.log('\n📊 Sample rooms:');
        console.log('─'.repeat(90));
        console.log('Room # | Type     | Room Type        | Category             | Price');
        console.log('─'.repeat(90));
        rooms.rows.forEach(room => {
            console.log(
                `${(room.number || '').padEnd(6)} | ` +
                `${(room.type || '').padEnd(8)} | ` +
                `${(room.room_type || 'Not Set').padEnd(16)} | ` +
                `${(room.category || '').padEnd(20)} | ` +
                `₦${room.price}`
            );
        });
        console.log('─'.repeat(90));
        
        client.release();
        await pool.end();
        
        console.log('\n✅ Migration completed successfully!');
        console.log('\n💡 Next steps:');
        console.log('   1. Restart the backend server');
        console.log('   2. Test room creation with room types in Settings');
        console.log('   3. Prices will be automatically set based on room type');
        
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

runMigration();
