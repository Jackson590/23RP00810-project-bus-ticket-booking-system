const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all buses
router.get('/', (req, res) => {
    db.query('SELECT * FROM buses', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// Add a new bus
router.post('/', (req, res) => {
    const { name, number_plate, seats } = req.body;
    db.query('INSERT INTO buses (name, number_plate, seats) VALUES (?, ?, ?)',
        [name, number_plate, seats],
        (err, results) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: 'Bus added successfully', id: results.insertId });
            }
        });
});

module.exports = router;
