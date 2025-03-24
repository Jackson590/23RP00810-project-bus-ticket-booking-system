const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all bookings
router.get('/', (req, res) => {
    db.query('SELECT * FROM bookings', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// Create a booking
router.post('/', (req, res) => {
    const { bus_id, passenger_name, contact, seat_number } = req.body;
    db.query('INSERT INTO bookings (bus_id, passenger_name, contact, seat_number) VALUES (?, ?, ?, ?)',
        [bus_id, passenger_name, contact, seat_number],
        (err, results) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: 'Booking successful', id: results.insertId });
            }
        });
});

module.exports = router;
