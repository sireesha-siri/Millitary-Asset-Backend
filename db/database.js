// backend/db/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'military.db'), (err) => {
  if (err) console.error('Error opening database:', err);
  else console.log('Connected to SQLite DB');
});

module.exports = db;
