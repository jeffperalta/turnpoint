const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./database/init')();

const clientRoutes = require('./routes/clients');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/clients', clientRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});