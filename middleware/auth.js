const jwt = require('jsonwebtoken');
const db = require('../db');
const userModel = require('../models/userModel');

const SECRET = process.env.JWT_SECRET || 'change-me-fast';

function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '8h' });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing authorization header' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid authorization format' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, SECRET);
    const user = userModel.getById(payload.id);
    if (!user) return res.status(401).json({ error: 'User not found' });
    if (user.status !== 'active') return res.status(403).json({ error: 'User inactive' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { authMiddleware, signToken };
