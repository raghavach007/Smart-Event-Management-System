// File: backend/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const crypto = require('crypto');

// 1. POST: Register for Event (Claim Ticket)
router.post('/events/:id/register', verifyToken, requireRole(['student', 'admin']), async (req, res) => {
  const eventId = req.params.id;
  const studentId = req.user.id;
  const qrToken = crypto.randomBytes(16).toString('hex');

  try {
    await db.query(
      'INSERT INTO registrations (student_id, event_id, qr_token, checked_in) VALUES (?, ?, ?, 0)', 
      [studentId, eventId, qrToken]
    );
    res.status(201).json({ message: 'Ticket secured!', qr_token: qrToken });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Already in your wallet.' });
    res.status(500).json({ error: err.message });
  }
});

// 2. GET: Fetch Tickets (Joins registrations with events)
router.get('/tickets', verifyToken, requireRole(['student', 'admin']), async (req, res) => {
  try {
    const query = `
      SELECT r.qr_token, r.checked_in, r.registration_time, e.id as event_id, e.title, e.description, e.event_date, e.capacity
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      WHERE r.student_id = ?
      ORDER BY e.event_date ASC
    `;
    const [tickets] = await db.query(query, [req.user.id]);
    res.json(tickets);
  } catch (err) {
    console.error("TICKET FETCH ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;