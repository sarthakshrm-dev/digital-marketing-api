const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/database');
const itemRoutes = require('./routes/itemRoutes');

require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api', itemRoutes);

// Connect to Database
connectDB();

module.exports = app;
