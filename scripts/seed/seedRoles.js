const db = require('../../db/database');

const roles = [
  { role_name: 'Admin', description: 'System Administrator' },
  { role_name: 'Base Commander', description: 'Responsible for base operations' },
  { role_name: 'Logistics Officer', description: 'Handles asset logistics' }
];

roles.forEach(role => {
  db.run(
    `INSERT OR IGNORE INTO roles (role_name, description) VALUES (?, ?)`,
    [role.role_name, role.description],
    err => {
      if (err) console.error('Error inserting role:', err);
    }
  );
});

console.log('✅ Seeded roles');
