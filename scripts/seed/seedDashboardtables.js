const db = require('../db/database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// 1. Base seeds
const bases = [
  { base_name: 'Base Alpha', location: 'Sector 1', description: 'Lead command base' },
  { base_name: 'Base Beta', location: 'Sector 2', description: 'Logistics hub' },
  { base_name: 'Base Charlie', location: 'Sector 3', description: 'Medical station' },
];

bases.forEach(b => {
  db.run(
    `INSERT OR IGNORE INTO bases (base_id, base_name, location, description) VALUES (?, ?, ?, ?)`,
    [uuidv4(), b.base_name, b.location, b.description]
  );
});

// 2. UserBases relationship (assumes you seeded users already)
db.all(`SELECT user_id, username FROM users`, [], (err, rows) => {
  rows.forEach(row => {
    bases.forEach(b => {
      db.get(`SELECT base_id FROM bases WHERE base_name = ?`, [b.base_name], (e, baseRow) => {
        db.run(
          `INSERT OR IGNORE INTO user_bases (user_id, base_id) VALUES (?, ?)`,
          [row.user_id, baseRow.base_id]
        );
      });
    });
  });
});

// 3. Equipment types
const types = [
  { type_name: 'Vehicle', category: 'Ground', description: 'Transport vehicles' },
  { type_name: 'Small Arm', category: 'Ground', description: 'Handheld weapons' },
  { type_name: 'Ammunition', category: 'Consumable', description: 'Ammo for weapons' },
];
types.forEach(t => {
  db.run(
    `INSERT OR IGNORE INTO equipment_types (equipment_type_id, type_name, category, description) VALUES (?, ?, ?, ?)`,
    [uuidv4(), t.type_name, t.category, t.description]
  );
});

// 4. Assets
db.all(`SELECT equipment_type_id, type_name FROM equipment_types`, [], (err, types) => {
  db.all(`SELECT base_id, base_name FROM bases`, [], (err2, bases) => {
    types.forEach(type => {
      bases.forEach(base => {
        const qty = type.type_name === 'Ammunition' ? 500 : 5;
        db.run(
          `INSERT OR IGNORE INTO assets (asset_id, equipment_type_id, model_name, serial_number, current_base_id, quantity, status, is_fungible, current_balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            uuidv4(),
            type.equipment_type_id,
            `${type.type_name} Model X`,
            type.type_name !== 'Ammunition' ? `SN-${uuidv4().slice(0,8)}` : null,
            base.base_id,
            qty,
            'Operational',
            type.type_name === 'Ammunition' ? 1 : 0,
            qty
          ]
        );
      });
    });
  });
});

// 5. Transactions
db.all(`SELECT asset_id, is_fungible, current_base_id FROM assets`, [], (err, assets) => {
  assets.forEach(asset => {
    const seedTrans = [
      { type: 'purchase', qty: 100, base: asset.current_base_id },
      { type: 'transfer_out', qty: 50, base: asset.current_base_id },
      { type: 'transfer_in', qty: 30, base: asset.current_base_id }
    ];
    seedTrans.forEach(t => {
      db.run(
        `INSERT INTO transactions (transaction_id, asset_id, type, quantity, from_base_id, to_base_id, user_id) VALUES (?, ?, ?, ?, ?, ?, (SELECT user_id FROM users LIMIT 1))`,
        [uuidv4(), asset.asset_id, t.type, t.qty, t.type==='transfer_out' ? t.base : null, t.type==='transfer_in' ? t.base : null]
      );
    });
  });
});

console.log('✅ Seed data inserted');
