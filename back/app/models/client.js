// const { Client } = require('pg');
// require('dotenv').config();

// // const client = new Client(process.env.PG_URL);

// const client = new Client({
//     connectionString: process.env.PG_URL});

// client.connect();

// module.exports = client;

const { Pool } = require('pg');
require('dotenv').config();

// Setup the connection pool with the connection string
const pool = new Pool({
  connectionString: process.env.PG_URL,
  ssl: { rejectUnauthorized: false }, // Ensures SSL connection for Render
  max: 20,  // Max number of clients in the pool
  idleTimeoutMillis: 30000,  // 30 seconds
  connectionTimeoutMillis: 2000,  // 2 seconds
});

module.exports = pool;