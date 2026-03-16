const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (pool) => {
  const router = express.Router();

  // Register New User
  router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required.' });
      }

      const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      if (rows.length > 0) {
        return res.status(400).json({ error: 'Username already exists.' });
      }

      const hashedPw = await bcrypt.hash(password, 10);
      await pool.query(
        "INSERT INTO users (username, password_hash) VALUES ($1, $2)",
        [username, hashedPw]
      );
      
      res.status(201).json({ message: 'User created successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Login
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      if (rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'supersecretjwtkey123',
        { expiresIn: '1h' }
      );

      res.json({ message: 'Login successful', token, role: user.role });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
};
