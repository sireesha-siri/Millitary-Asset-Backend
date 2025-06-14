const db = require('../../db/database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const users = [
  {
    username: 'admin',
    password: bcrypt.hashSync('admin123', 10),
    email: 'admin@military.com',
    full_name: 'System Admin',
  },
  {
    username: 'commander1',
    password: bcrypt.hashSync('base123', 10),
    email: 'commander@military.com',
    full_name: 'Base Commander One',
  },
  {
    username: 'logistics1',
    password: bcrypt.hashSync('logi123', 10),
    email: 'logistics@military.com',
    full_name: 'Logistics Officer One',
  },
];

users.forEach(user => {
  db.run(
    `INSERT OR IGNORE INTO users (user_id, username, password, email, full_name) VALUES (?, ?, ?, ?, ?)`,
    [uuidv4(), user.username, user.password, user.email, user.full_name],
    err => {
      if (err) console.error('Error inserting user:', err);
    }
  );
});

console.log('✅ Seeded users');
