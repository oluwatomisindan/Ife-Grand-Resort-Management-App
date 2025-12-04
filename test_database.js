import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ife_resort_db',
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    const client = await pool.connect();
    console.log('✓ Connected to database');
    
    // Check if users table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✓ Users table exists');
      
      // Get table structure
      const structure = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY ordinal_position;
      `);
      
      console.log('\nUsers table structure:');
      structure.rows.forEach(row => {
        console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
      
      // Count existing users
      const count = await client.query('SELECT COUNT(*) FROM users');
      console.log(`\n✓ Existing users: ${count.rows[0].count}`);
      
    } else {
      console.log('✗ Users table does NOT exist');
      console.log('\nPlease run the database_setup.sql script first:');
      console.log('  psql -U postgres -d ife_resort_db -f server/database_setup.sql');
    }
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.error('✗ Database error:', error.message);
    console.error('\nFull error:', error);
    await pool.end();
  }
}

testDatabase();
