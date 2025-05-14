const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all ticket types
router.get('/ticket-types', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM ticket_types ORDER BY createdAt DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch ticket types' });
  }
});

// Add a new ticket type
router.post('/ticket-types', async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const [result] = await pool.query('INSERT INTO ticket_types (title, createdAt) VALUES (?, NOW())', [title]);
    res.status(201).json({ id: result.insertId, title });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add ticket type' });
  }
});

module.exports = router;