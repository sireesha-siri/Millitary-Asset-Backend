const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/', (req, res) => {
  const { base_id, type_id, start, end } = req.query;
  let sql = `SELECT a.*, b.type_name FROM assets a
             JOIN equipment_types b ON a.equipment_type_id = b.equipment_type_id
             WHERE 1=1`;
  const params = [];
  if (base_id) { sql += ' AND a.current_base_id = ?'; params.push(base_id); }
  if (type_id) { sql += ' AND a.equipment_type_id = ?'; params.push(type_id); }
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
