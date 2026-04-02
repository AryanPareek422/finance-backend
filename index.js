const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const db = require('./db'); // runs migrations/seeds
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const recordsRoutes = require('./routes/records');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => res.json({status: 'ok', message: 'Finance backend running'}));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
