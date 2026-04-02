const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');
const { permit } = require('../middleware/roles');

// Summary endpoint (analyst + admin + viewer allowed)
router.get('/summary', authMiddleware, permit('viewer','analyst','admin'), (req, res) => {
  const totals = db.prepare(`
    SELECT
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense
    FROM records
    WHERE deleted_at IS NULL
  `).get();

  totals.net = (totals.total_income || 0) - (totals.total_expense || 0);

  const byCategory = db.prepare(`
    SELECT category, type, SUM(amount) as total
    FROM records
    WHERE deleted_at IS NULL
    GROUP BY category, type
    ORDER BY total DESC
    LIMIT 20
  `).all();

  const recent = db.prepare('SELECT * FROM records WHERE deleted_at IS NULL ORDER BY date DESC LIMIT 10').all();

  // monthly trend (last 6 months)
  const trend = db.prepare(`
    SELECT strftime('%Y-%m', date) as month,
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
    FROM records
    WHERE deleted_at IS NULL AND date >= date('now','-6 months')
    GROUP BY month
    ORDER BY month ASC
  `).all();

  res.json({ totals, byCategory, recent, trend });
});

module.exports = router;
