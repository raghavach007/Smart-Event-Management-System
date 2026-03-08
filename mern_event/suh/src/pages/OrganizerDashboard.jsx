// File: suh/src/pages/OrganizerDashboard.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Scanner } from '@yudiel/react-qr-scanner';
import { PlusCircle, ScanLine, LayoutDashboard, Camera, Sparkles, CheckCircle, Clock } from 'lucide-react';
import styles from './OrganizerDashboard.module.css'; // Utilizing the master styles!

export default function OrganizerDashboard() {
  const [activeTab, setActiveTab] = useState('scan'); // 'create', 'scan', 'manage'
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', event_date: '', capacity: '' });
  
  const [scanToken, setScanToken] = useState('');
  const [scanMessage, setScanMessage] = useState(null);
  const [isScanError, setIsScanError] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  const fetchMyEvents = async () => {
    try {
      const res = await axios.get('/api/organizer/events', authConfig);
      setEvents(res.data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchMyEvents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/organizer/events', formData, authConfig);
      alert('Experience submitted for admin approval!');
      setFormData({ title: '', description: '', event_date: '', capacity: '' });
      fetchMyEvents();
      setActiveTab('manage');
    } catch (error) { alert('Failed to create event.'); }
  };

  const processCheckIn = async (tokenString) => {
    setScanMessage(null);
    if (!tokenString) return;
    try {
      const res = await axios.post('/api/organizer/checkin', { qr_token: tokenString }, authConfig);
      setScanMessage(res.data.message);
      setIsScanError(false);
      setIsCameraOpen(false);
    } catch (error) {
      setScanMessage(error.response?.data?.message || 'Error processing ticket.');
      setIsScanError(true);
    }
  };

  return (
    <div className={styles.masterContainer}>
      <div className={styles.ambientOrb1}></div><div className={styles.ambientOrb2}></div>

      <nav className={styles.navbar}>
        <div className={styles.brand}><Sparkles size={28} /> Cultra Organizer.</div>
        <div className={styles.navCenter}>
          <button className={`${styles.navBtn} ${activeTab === 'scan' ? styles.activeTab : ''}`} onClick={() => setActiveTab('scan')}><ScanLine size={18} /> Access Control</button>
          <button className={`${styles.navBtn} ${activeTab === 'create' ? styles.activeTab : ''}`} onClick={() => setActiveTab('create')}><PlusCircle size={18} /> Create</button>
          <button className={`${styles.navBtn} ${activeTab === 'manage' ? styles.activeTab : ''}`} onClick={() => setActiveTab('manage')}><LayoutDashboard size={18} /> My Events</button>
        </div>
        <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} className={styles.navBtn} style={{ border: '1px solid var(--text-primary)' }}>Sign Out</button>
      </nav>

      <header className={styles.heroSection}>
        <h1 className={styles.greeting}>Studio, {user?.name?.split(' ')[0]}.</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Manage your experiences and verify attendees.</p>
      </header>

      <main className={styles.contentArea} style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* ACCESS CONTROL (SCANNER) */}
        {activeTab === 'scan' && (
          <div className={styles.card} style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginBottom: '2rem' }}>Digital Ticket Scanner</h2>
            
            {!isCameraOpen ? (
              <button onClick={() => setIsCameraOpen(true)} className={styles.submitBtn} style={{ background: '#1A1918', marginBottom: '2rem' }}>
                <Camera size={20} /> Activate Live Scanner
              </button>
            ) : (
              <div className={styles.scannerBox}>
                <Scanner onScan={(result) => { if (result && result.length > 0) processCheckIn(result[0].rawValue); }} />
                <button onClick={() => setIsCameraOpen(false)} className={styles.submitBtn} style={{ borderRadius: '0', background: 'var(--accent-color)' }}>Close Camera</button>
              </div>
            )}

            <div style={{ margin: '2rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>— OR MANUAL ENTRY —</div>

            <form onSubmit={(e) => { e.preventDefault(); processCheckIn(scanToken.trim()); setScanToken(''); }} style={{ display: 'flex', gap: '1rem' }}>
              <input type="text" className={styles.input} placeholder="Paste Unique Token..." value={scanToken} onChange={(e) => setScanToken(e.target.value)} />
              <button type="submit" className={styles.submitBtn} style={{ width: 'auto', padding: '0 2rem' }}>Verify</button>
            </form>

            {scanMessage && (
              <div className={`${styles.scanResult} ${isScanError ? styles.scanError : styles.scanSuccess}`}>
                {isScanError ? '⚠️ ' : '✅ '}{scanMessage}
              </div>
            )}
          </div>
        )}

        {/* CREATE EVENT */}
        {activeTab === 'create' && (
          <div className={styles.card}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', marginBottom: '2rem' }}>Architect an Experience</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Event Title</label>
                <input type="text" name="title" className={styles.input} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea name="description" className={styles.textarea} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
              </div>
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <label className={styles.label}>Date & Time</label>
                  <input type="datetime-local" name="event_date" className={styles.input} value={formData.event_date} onChange={(e) => setFormData({...formData, event_date: e.target.value})} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label className={styles.label}>Max Capacity</label>
                  <input type="number" name="capacity" className={styles.input} value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} required />
                </div>
              </div>
              <button type="submit" className={styles.submitBtn}><PlusCircle size={20} /> Submit for Approval</button>
            </form>
          </div>
        )}

        {/* MANAGE EVENTS */}
        {activeTab === 'manage' && (
          <div className={styles.grid}>
            {events.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>You haven't created any events yet.</p> : null}
            {events.map(event => (
              <div key={event.id} className={styles.card} style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontFamily: "'Playfair Display', serif", margin: '0 0 0.5rem 0' }}>{event.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  {new Date(event.event_date).toLocaleDateString()} • Capacity: {event.capacity}
                </p>
                <div className={`${styles.badge} ${event.status === 'pending' ? styles.badgePending : event.status === 'approved' ? styles.badgeApproved : styles.badgeRejected}`}>
                  {event.status === 'pending' ? <Clock size={14} /> : event.status === 'approved' ? <CheckCircle size={14} /> : <Sparkles size={14} />}
                  {event.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}