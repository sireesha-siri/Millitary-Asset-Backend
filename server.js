require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const usersRouter = require('./routes/users');
const authenticateToken = require('./middleware/authMiddleware');

const basesRouter = require('./routes/bases');
const eqTypesRouter = require('./routes/equipmentTypes');
const assetsRouter = require('./routes/assets');
const dashboardRouter = require('./routes/dashboard');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', usersRouter);

app.use('/bases', authenticateToken, basesRouter);
app.use('/equipment-types', authenticateToken, eqTypesRouter);
app.use('/assets', authenticateToken, assetsRouter);
app.use('/dashboard', authenticateToken, dashboardRouter);

// ✅ Protected Route Example
// app.get('/dashboard', authenticateToken, (req, res) => {
//   res.json({
//     message: 'Access granted to dashboard',
//     user: req.user,
//   });
// });

app.get('/', (req, res) => res.send('API running 🚀'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
