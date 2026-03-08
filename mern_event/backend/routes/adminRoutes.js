// File: backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const bcrypt = require('bcrypt');

// 1. GET: Fetch ALL events for Oversight (Pending first)
router.get('/events', verifyToken, requireRole(['admin']), async (req, res) => {
  try {
    const query = `
      SELECT e.*, c.name as club_name 
      FROM events e
      LEFT JOIN clubs c ON e.club_id = c.id
      ORDER BY FIELD(status, 'pending', 'approved', 'rejected'), e.created_at DESC
    `;
    const [events] = await db.query(query);
    res.json(events);
  } catch (err) {
    console.error("EVENT FETCH ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 2. PUT: Update Event Status (Approve/Reject)
router.put('/events/:id/status', verifyToken, requireRole(['admin']), async (req, res) => {
  const { status } = req.body;
  const eventId = req.params.id;
  try {
    await db.query("UPDATE events SET status = ? WHERE id = ?", [status, eventId]);
    res.json({ message: `Event ${status} successfully!` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. GET: Defensive Analytics Engine
router.get('/analytics', verifyToken, requireRole(['admin']), async (req, res) => {
  let stats = { students: 0, events: 0, attendance: 0 };
  let participation = [];
  try {
    const [sRes] = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
    stats.students = sRes[0]?.count || 0;
    const [eRes] = await db.query("SELECT COUNT(*) as count FROM events WHERE status = 'approved'");
    stats.events = eRes[0]?.count || 0;
    const [aRes] = await db.query("SELECT COUNT(*) as count FROM registrations WHERE checked_in = 1");
    stats.attendance = aRes[0]?.count || 0;

    const [pRes] = await db.query(`
      SELECT u.name as student, e.title as event, r.checked_in, r.registration_time as timestamp 
      FROM registrations r 
      LEFT JOIN users u ON r.student_id = u.id 
      LEFT JOIN events e ON r.event_id = e.id 
      ORDER BY r.registration_time DESC LIMIT 10
    `);
    participation = pRes || [];
    res.json({ stats, participation });
  } catch (err) { 
    console.error("ANALYTICS ERROR:", err.message);
    res.status(200).json({ stats, participation: [] }); 
  }
});

// 4. POST: Atomic Club Forge (Club + Secure Organizer Account)
router.post('/clubs', verifyToken, requireRole(['admin']), async (req, res) => {
  const { name, description, organizerName, organizerEmail, organizerPassword } = req.body;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [clubResult] = await connection.query("INSERT INTO clubs (name, description) VALUES (?, ?)", [name, description]);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(organizerPassword, salt);
    await connection.query(
      "INSERT INTO users (name, email, password_hash, role, club_id) VALUES (?, ?, ?, ?, ?)",
      [organizerName, organizerEmail, hashedPassword, 'organizer', clubResult.insertId]
    );
    await connection.commit();
    res.status(201).json({ message: 'Organization forged and Organizer account secured!' });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally { connection.release(); }
});

// 5. GET: Fetch All Clubs
router.get('/clubs', verifyToken, requireRole(['admin']), async (req, res) => {
  try {
    const [clubs] = await db.query("SELECT * FROM clubs");
    res.json(clubs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;