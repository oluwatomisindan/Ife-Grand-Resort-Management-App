// Run this script to add category column to existing rooms table
import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';

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
        console.log('🔄 Running category migration...\n');
        
        const client = await pool.connect();
        
        // Check if category column exists
        const checkColumn = await client.query(`
            SELECT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'rooms' AND column_name = 'category'
            );
        `);
        
        if (checkColumn.rows[0].exists) {
            console.log('✅ Category column already exists!');
        } else {
            console.log('📝 Adding category column...');
            
            // Add category column
            await client.query(`
                ALTER TABLE rooms ADD COLUMN category TEXT NOT NULL DEFAULT 'Standard';
            `);
            
            console.log('✅ Category column added successfully');
            
            // Update existing rooms with appropriate categories based on their type
            console.log('\n📝 Updating existing rooms with categories...');
            
            await client.query(`UPDATE rooms SET category = 'Premium' WHERE type = 'Deluxe'`);
            await client.query(`UPDATE rooms SET category = 'Super Premium' WHERE type = 'Suite'`);
            await client.query(`UPDATE rooms SET category = 'Kings' WHERE type = 'Villa'`);
            
            console.log('✅ Existing rooms updated with categories');
        }
        
        // Show current rooms with categories
        const rooms = await client.query('SELECT number, type, category, price FROM rooms ORDER BY category, number');
        
        console.log('\n📊 Current rooms with categories:');
        console.log('─'.repeat(70));
        rooms.rows.forEach(room => {
            console.log(`  Room ${room.number.padEnd(5)} | ${room.category.padEnd(20)} | ${room.type.padEnd(10)} | ₦${room.price}`);
        });
        console.log('─'.repeat(70));
        
        client.release();
        await pool.end();
        
        console.log('\n✅ Migration completed successfully!');
        console.log('\n💡 Next steps:');
        console.log('   1. Restart the backend server: npm run server');
        console.log('   2. Test room creation with categories in Settings');
        console.log('   3. Test category filtering in Reservations');
        
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

runMigration();
