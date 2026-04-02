const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'data.db');
const db = new Database(DB_PATH);

// Run migrations
const migrate = () => {
  db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT,
      role TEXT NOT NULL DEFAULT 'viewer',
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('income','expense')),
      category TEXT,
      date TEXT NOT NULL,
      notes TEXT,
      created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT,
      deleted_at TEXT
    );
  `);
};

// Seed initial admin if none exists
const seed = () => {
  const row = db.prepare('SELECT COUNT(*) as cnt FROM users WHERE role = ?').get('admin');
  if (!row || row.cnt === 0) {
    const pw = 'adminpass';
    const hash = bcrypt.hashSync(pw, 8);
    db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,?)')
      .run('Administrator', 'admin@example.com', hash, 'admin');
    console.log('Seeded admin user: admin@example.com / adminpass');
  }
};

migrate();
seed();

module.exports = db;
