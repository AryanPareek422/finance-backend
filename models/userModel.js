const db = require('../db');

const createUser = ({ name, email, password_hash, role = 'viewer', status = 'active' }) => {
  const stmt = db.prepare('INSERT INTO users (name, email, password_hash, role, status) VALUES (?,?,?,?,?)');
  const info = stmt.run(name, email, password_hash, role, status);
  return getById(info.lastInsertRowid);
};

const getById = (id) => db.prepare('SELECT id, name, email, role, status, created_at FROM users WHERE id = ?').get(id) || null;
const getByEmail = (email) => db.prepare('SELECT * FROM users WHERE email = ?').get(email) || null;
const list = () => db.prepare('SELECT id, name, email, role, status, created_at FROM users').all();
const update = (id, fields) => {
  const user = getById(id);
  if (!user) return null;
  const updated = { ...user, ...fields };
  db.prepare('UPDATE users SET name = ?, email = ?, role = ?, status = ? WHERE id = ?')
    .run(updated.name, updated.email, updated.role, updated.status, id);
  return getById(id);
};
const remove = (id) => {
  const info = db.prepare('DELETE FROM users WHERE id = ?').run(id);
  return info.changes > 0;
};

module.exports = { createUser, getById, getByEmail, list, update, remove };
