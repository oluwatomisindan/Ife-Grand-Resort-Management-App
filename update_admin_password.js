import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ife_resort_db',
  password: 'Oluwa2701',
  port: 5432,
});

const updatePassword = async () => {
  try {
    const hash = '$2b$10$fVuO23NA..6A/9m0beyB7ezDZtpIaTuoPK7poLY2ts082WD81EwNu';
    const email = 'superadmin@ife.com';
    
    // Check if user exists
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (res.rows.length === 0) {
        console.log('User not found, inserting...');
        await pool.query(
            "INSERT INTO users (id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5)",
            ['admin-seed-id', 'Super Admin', email, hash, 'Administrator']
        );
    } else {
        console.log('User found, updating password...');
        await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [hash, email]);
    }
    console.log('Password updated successfully');
  } catch (err) {
    console.error('Error updating password:', err);
  } finally {
    await pool.end();
  }
};

updatePassword();
