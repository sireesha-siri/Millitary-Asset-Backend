const db = require('../../db/database');

db.run(`
  CREATE TABLE IF NOT EXISTS roles (
    role_id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_name TEXT UNIQUE NOT NULL,
    description TEXT
  )
`, err => {
  if (err) console.error("Error creating roles table:", err);
  else console.log("✅ roles table created");
});
