require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'adminpassword',
  database: process.env.DB_NAME || 'loggindb'
});

// Initialize DB schema and admin user
const initDB = async (retries = 5) => {
  while (retries > 0) {
    try {
      const client = await pool.connect();
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      // Create default admin user if not exists
      const bcrypt = require('bcrypt');
      const { rows } = await client.query("SELECT * FROM users WHERE username = 'admin'");
      if (rows.length === 0) {
        const hashedPw = await bcrypt.hash('admin', 10);
        await client.query(
          "INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)",
          ['admin', hashedPw, 'admin']
        );
        console.log('Default admin user created.');
      }
      client.release();
      console.log('Database initialized.');
      break; // Success, exit loop
    } catch (err) {
      console.error(`Error initializing database. Retries left: ${retries - 1}`, err.message);
      retries -= 1;
      // Wait for 2 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
};

initDB();

// Routes
app.use('/api/auth', require('./routes/auth')(pool));

// Start server
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
