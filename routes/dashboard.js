const express = require('express');
const router = express.Router();
const db = require('../db/database');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', (req, res) => {
  const { base_id, type_id, start, end } = req.query;
  const filters = [];
  let params = [];

  let whereTrans = 'WHERE 1=1';
  if (base_id) { whereTrans += ' AND (from_base_id = ? OR to_base_id = ?)'; params.push(base_id, base_id); }
  if (type_id) { whereTrans += ' AND asset_id IN (SELECT asset_id FROM assets WHERE equipment_type_id = ?)'; params.push(type_id); }
  if (start) { whereTrans += ' AND date >= ?'; params.push(start); }
  if (end) { whereTrans += ' AND date <= ?'; params.push(end); }

  const queries = {
    purchases: `SELECT SUM(quantity) AS purchases FROM transactions ${whereTrans} AND type='purchase'`,
    in:        `SELECT SUM(quantity) AS transfersIn FROM transactions ${whereTrans} AND type='transfer_in'`,
    out:       `SELECT SUM(quantity) AS transfersOut FROM transactions ${whereTrans} AND type='transfer_out'`,
    expended:  `SELECT SUM(quantity) AS expended FROM transactions ${whereTrans} AND type='expend'`,
    assigned:  `SELECT SUM(quantity) AS assigned FROM transactions ${whereTrans} AND type='assign'`
  };

  const results = {};
  let done = 0, needed = Object.keys(queries).length;

  Object.entries(queries).forEach(([key, sql]) => {
    db.get(sql, params, (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      results[key] = row[key] || 0;
      if (++done === needed) {
        const netMovement = results.purchases + results.in - results.out;
        res.json({ ...results, netMovement });
      }
    });
  });
});

router.get('/auth-check', authenticateToken, (req, res) => {
  res.json({
    message: 'Access granted to dashboard',
    user: req.user,
  });
});

// detailed breakdown
router.get('/net-breakdown', (req, res) => {
  const { base_id, type_id, start, end } = req.query;
  let sql = `SELECT type, asset_id, quantity, date, from_base_id, to_base_id, user_id FROM transactions WHERE 1=1`;
  const params = [];
  if (base_id) { sql += ' AND (from_base_id = ? OR to_base_id = ?)'; params.push(base_id, base_id); }
  if (type_id) { sql += ' AND asset_id IN (SELECT asset_id FROM assets WHERE equipment_type_id = ?)'; params.push(type_id); }
  if (start) { sql += ' AND date >= ?'; params.push(start); }
  if (end) { sql += ' AND date <= ?'; params.push(end); }
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
