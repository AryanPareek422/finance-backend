const express = require('express');
const router = express.Router();
const recordModel = require('../models/recordModel');
const { authMiddleware } = require('../middleware/auth');
const { permit } = require('../middleware/roles');

// List records with filters (viewer, analyst, admin)
router.get('/', authMiddleware, permit('viewer','analyst','admin'), (req, res) => {
  const filters = {
    type: req.query.type,
    category: req.query.category,
    startDate: req.query.startDate,
    endDate: req.query.endDate
  };
  const results = recordModel.list(filters);
  res.json(results);
});

// Get single record
router.get('/:id', authMiddleware, permit('viewer','analyst','admin'), (req, res) => {
  const rec = recordModel.getById(req.params.id);
  if (!rec) return res.status(404).json({ error: 'Record not found' });
  res.json(rec);
});

// Create record (admin only)
router.post('/', authMiddleware, permit('admin'), (req, res) => {
  const { amount, type, category, date, notes } = req.body;
  if (typeof amount !== 'number' && !amount) return res.status(400).json({ error: 'amount is required and must be a number' });
  if (!['income','expense'].includes(type)) return res.status(400).json({ error: 'type must be income or expense' });
  if (!date) return res.status(400).json({ error: 'date is required' });
  const rec = recordModel.create({ amount, type, category, date, notes, created_by: req.user.id });
  res.status(201).json(rec);
});

// Update record (admin only)
router.put('/:id', authMiddleware, permit('admin'), (req, res) => {
  const updated = recordModel.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Record not found' });
  res.json(updated);
});

// Delete (soft) record (admin only)
router.delete('/:id', authMiddleware, permit('admin'), (req, res) => {
  const ok = recordModel.remove(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Record not found' });
  res.json({ success: true });
});

module.exports = router;