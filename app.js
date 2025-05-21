const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/database');
const itemRoutes = require('./routes/itemRoutes');
const contactRoutes = require('./routes/contactRoutes');

require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("Welcome to the api's")
});

// Routes
app.use('/api', itemRoutes);
app.use('/api/contact', contactRoutes);

// Connect to Database
connectDB();

module.exports = app;
