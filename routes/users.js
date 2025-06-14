const express = require('express');
const router = express.Router();
const db = require('../db/database'); // adjust based on your project structure

// Get all users
router.get('/', (req, res) => {
  const query = 'SELECT * FROM users';
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

module.exports = router;
