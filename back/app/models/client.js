const { Pool } = require('pg');
require('dotenv').config();

// Setup the connection pool with the connection string
const pool = new Pool({
  connectionString: process.env.PG_URL,
  max: 20,  // Max number of clients in the pool
  idleTimeoutMillis: 30000,  // 30 seconds
  connectionTimeoutMillis: 2000,  // 2 seconds
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Database connected:', res.rows);
});

module.exports = pool;