const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./database/init')();
const { requireAuth } = require('./session');

const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const fundingRoutes = require('./routes/fundings');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/clients',requireAuth, clientRoutes);
app.use('/api/fundings', requireAuth, fundingRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});