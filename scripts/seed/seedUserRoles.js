const db = require('../../db/database');

const userRoles = [
  { username: 'admin', role_name: 'Admin' },
  { username: 'commander1', role_name: 'Base Commander' },
  { username: 'logistics1', role_name: 'Logistics Officer' }
];

userRoles.forEach(({ username, role_name }) => {
  db.get(`SELECT user_id FROM users WHERE username = ?`, [username], (err, user) => {
    if (err || !user) return;

    db.get(`SELECT role_id FROM roles WHERE role_name = ?`, [role_name], (err2, role) => {
      if (err2 || !role) return;

      db.run(
        `INSERT OR IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)`,
        [user.user_id, role.role_id],
        err3 => {
          if (err3) console.error('Error inserting user role:', err3);
        }
      );
    });
  });
});

console.log('✅ Seeded user_roles');
