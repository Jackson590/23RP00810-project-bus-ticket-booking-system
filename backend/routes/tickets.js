const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all tickets
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tickets');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new ticket
router.post('/', async (req, res) => {
  const { passenger_name, route, price } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO tickets (passenger_name, route, price) VALUES (?, ?, ?)',
      [passenger_name, route, price]
    );
    res.status(201).json({ message: 'Ticket created', id: result[0].insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a ticket
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { passenger_name, route, price } = req.body;
  
    try {
      const result = await db.query(
        'UPDATE tickets SET passenger_name = ?, route = ?, price = ? WHERE id = ?',
        [passenger_name, route, price, id]
      );
  
      if (result[0].affectedRows === 0) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
  
      res.json({ message: 'Ticket updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete a ticket
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await db.query('DELETE FROM tickets WHERE id = ?', [id]);
  
      if (result[0].affectedRows === 0) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
  
      res.json({ message: 'Ticket deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
module.exports = router;
