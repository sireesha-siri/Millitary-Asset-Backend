const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
require('dotenv').config();

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Fetch roles
    db.all(
      `SELECT r.role_name FROM roles r 
       JOIN user_roles ur ON r.role_id = ur.role_id 
       WHERE ur.user_id = ?`,
      [user.user_id],
      (roleErr, rolesData) => {
        if (roleErr) {
          return res.status(500).json({ error: 'Failed to fetch user roles' });
        }

        const roles = rolesData.map(r => r.role_name);

        const userInfo = {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          roles
        };

        // ✅ Generate JWT token
        const token = jwt.sign(
          { user_id: user.user_id, roles: roles },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.json({
          user: userInfo,
          token
        });
      }
    );
  });
});

module.exports = router;
