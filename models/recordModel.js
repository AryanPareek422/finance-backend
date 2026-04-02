const db = require('../db');

const create = ({ amount, type, category, date, notes, created_by }) => {
  const stmt = db.prepare('INSERT INTO records (amount, type, category, date, notes, created_by) VALUES (?,?,?,?,?,?)');
  const info = stmt.run(amount, type, category, date, notes, created_by);
  return getById(info.lastInsertRowid);
};

const getById = (id) => db.prepare('SELECT * FROM records WHERE id = ? AND deleted_at IS NULL').get(id) || null;

const update = (id, fields) => {
  const rec = getById(id);
  if (!rec) return null;
  const updated = { ...rec, ...fields, updated_at: new Date().toISOString() };
  db.prepare('UPDATE records SET amount = ?, type = ?, category = ?, date = ?, notes = ?, updated_at = ? WHERE id = ?')
    .run(updated.amount, updated.type, updated.category, updated.date, updated.notes, updated.updated_at, id);
  return getById(id);
};

const remove = (id) => {
  const stmt = db.prepare('UPDATE records SET deleted_at = datetime("now") WHERE id = ? AND deleted_at IS NULL');
  const info = stmt.run(id);
  return info.changes > 0;
};

const list = (filters = {}) => {
  let sql = 'SELECT * FROM records WHERE deleted_at IS NULL';
  const params = [];
  if (filters.type) { sql += ' AND type = ?'; params.push(filters.type); }
  if (filters.category) { sql += ' AND category = ?'; params.push(filters.category); }
  if (filters.startDate) { sql += ' AND date >= ?'; params.push(filters.startDate); }
  if (filters.endDate) { sql += ' AND date <= ?'; params.push(filters.endDate); }
  sql += ' ORDER BY date DESC';
  return db.prepare(sql).all(...params);
};

module.exports = { create, getById, update, remove, list };
