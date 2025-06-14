const db = require('../db/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
  const { username, password } = req.body;

  // Step 1: Find user by username
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Step 2: Check password
    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Step 3: Get user's roles from junction table
    const userId = user.user_id;
    const query = `
      SELECT r.role_name 
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.role_id
      WHERE ur.user_id = ?
    `;

    db.all(query, [userId], (err, rows) => {
      if (err) {
        console.error("Role fetch error:", err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      const roles = rows.map(row => row.role_name);

      // Step 4: Generate JWT token
      const token = jwt.sign({ id: userId, roles }, process.env.JWT_SECRET, { expiresIn: '1d' });

      // Step 5: Send user info + token
      res.json({
        token,
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          roles,
        }
      });
    });
  });
};
