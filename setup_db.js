import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ife_resort_db',
  password: 'Oluwa2701',
  port: 5432,
});

async function setupDatabase() {
  try {
    console.log('Reading database setup script...');
    const sqlPath = path.join(__dirname, 'server', 'database_setup.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Connecting to database...');
    const client = await pool.connect();

    console.log('Executing setup script...');
    await client.query(sql);
    
    console.log('✓ Database setup completed successfully!');
    console.log('✓ Users table created');
    console.log('✓ Super admin account created');
    
    client.release();
  } catch (error) {
    console.error('✗ Error setting up database:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase();
