const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const userModel = require('../models/userModel');
const { authMiddleware } = require('../middleware/auth');
const { permit } = require('../middleware/roles');

// List users (admin only)
router.get('/', authMiddleware, permit('admin'), (req, res) => {
  res.json(userModel.list());
});

// Create user (admin only)
router.post('/', authMiddleware, permit('admin'), (req, res) => {
  const { name, email, password, role = 'viewer' } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password required' });
  if (userModel.getByEmail(email)) return res.status(400).json({ error: 'email already exists' });
  const hash = bcrypt.hashSync(password, 8);
  const user = userModel.createUser({ name, email, password_hash: hash, role });
  res.status(201).json(user);
});

// Update user (admin only)
router.put('/:id', authMiddleware, permit('admin'), (req, res) => {
  const updated = userModel.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'User not found' });
  res.json(updated);
});

// Deactivate / delete user (admin only)
router.delete('/:id', authMiddleware, permit('admin'), (req, res) => {
  const ok = userModel.remove(req.params.id);
  if (!ok) return res.status(404).json({ error: 'User not found' });
  res.json({ success: true });
});

module.exports = router;
