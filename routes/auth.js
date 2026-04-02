const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const userModel = require('../models/userModel');
const { signToken } = require('../middleware/auth');

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const user = userModel.getByEmail(email);
  if (!user || !user.password_hash) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = bcrypt.compareSync(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signToken({ id: user.id, role: user.role });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

module.exports = router;
