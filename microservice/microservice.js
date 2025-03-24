require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'mysql-service',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'microservice_db'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Health Check Route
app.get('/health', (req, res) => {
  res.json({ status: 'Microservice is running' });
});

// Fetch data from Backend Service
app.get('/data', async (req, res) => {
  try {
    const backendUrl = process.env.BACKEND_SERVICE_URL || 'http://backend-service:80';
    const response = await axios.get(`${backendUrl}/backend-data`);
    res.json({ microservice: 'Data fetched from backend', backendData: response.data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from backend' });
  }
});

// Sample Database Query
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query failed' });
    } else {
      res.json(results);
    }
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Microservice running on port ${port}`);
});
