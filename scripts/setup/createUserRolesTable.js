const db = require('../../db/database');

db.run(`
  CREATE TABLE IF NOT EXISTS user_roles (
    user_id TEXT,
    role_id INTEGER,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
  )
`, err => {
  if (err) console.error("Error creating user_roles table:", err);
  else console.log("✅ user_roles table created");
});
