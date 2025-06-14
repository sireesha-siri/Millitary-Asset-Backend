const db = require('./database');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS bases (
  base_id TEXT PRIMARY KEY,
  base_name TEXT UNIQUE NOT NULL,
  location TEXT NOT NULL,
  description TEXT
)
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS user_bases (
  user_id TEXT NOT NULL,
  base_id TEXT NOT NULL,
  PRIMARY KEY(user_id, base_id),
  FOREIGN KEY(user_id) REFERENCES users(user_id),
  FOREIGN KEY(base_id) REFERENCES bases(base_id)
)
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS equipment_types (
  equipment_type_id TEXT PRIMARY KEY,
  type_name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT
)
  `);

  db.run(`
     asset_id TEXT PRIMARY KEY,
  equipment_type_id TEXT NOT NULL,
  model_name TEXT,
  serial_number TEXT UNIQUE,
  current_base_id TEXT,
  quantity INTEGER DEFAULT 1,
  status TEXT,
  is_fungible BOOLEAN DEFAULT 0,
  current_balance INTEGER,
  last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(equipment_type_id) REFERENCES equipment_types(equipment_type_id),
  FOREIGN KEY(current_base_id) REFERENCES bases(base_id)
)
  `);

  db.run(
    ` 
    CREATE TABLE IF NOT EXISTS transactions (
  transaction_id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL,
  type TEXT NOT NULL, /* purchase | transfer_in | transfer_out | assign | expend */
  quantity INTEGER NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  from_base_id TEXT,
  to_base_id TEXT,
  user_id TEXT,
  FOREIGN KEY(asset_id) REFERENCES assets(asset_id),
  FOREIGN KEY(from_base_id) REFERENCES bases(base_id),
  FOREIGN KEY(to_base_id) REFERENCES bases(base_id),
  FOREIGN KEY(user_id) REFERENCES users(user_id)
)
    `
  )

  console.log('✅ Tables created');
});
