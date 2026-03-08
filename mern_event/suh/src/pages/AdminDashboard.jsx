// File: suh/src/pages/AdminDashboard.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, CheckCircle, XCircle, Users, LayoutGrid, BarChart3, Plus, Sparkles, LogOut, Activity, Mail, Lock, UserPlus } from 'lucide-react';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); 
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [analytics, setAnalytics] = useState({ stats: {students: 0, events: 0, attendance: 0}, participation: [] });
  
  // EXPANDED STATE FOR ATOMIC FORGE
  const [newClub, setNewClub] = useState({ 
    name: '', 
    description: '',
    organizerName: '',
    organizerEmail: '',
    organizerPassword: ''
  });
  
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [evRes, clRes, anRes] = await Promise.all([
        axios.get('/api/admin/events', authConfig),
        axios.get('/api/admin/clubs', authConfig),
        axios.get('/api/admin/analytics', authConfig)
      ]);
      setEvents(evRes.data);
      setClubs(clRes.data);
      setAnalytics(anRes.data);
      setLoading(false);
    } catch (err) { console.error("Admin fetch error", err); setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpdateStatus = async (id, status) => {
    await axios.put(`/api/admin/events/${id}/status`, { status }, authConfig);
    fetchData();
  };

  const handleCreateClub = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/clubs', newClub, authConfig);
      setNewClub({ name: '', description: '', organizerName: '', organizerEmail: '', organizerPassword: '' });
      fetchData();
      alert('Strategic Organization & Organizer Account Secured.');
    } catch (err) {
      alert(err.response?.data?.message || 'Forge Failed.');
    }
  };

  return (
    <div className={styles.masterContainer}>
      <div className={styles.ambientOrb1}></div><div className={styles.ambientOrb2}></div>

      {/* Glass Command Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.brand}><ShieldCheck size={32} /> Admin.Core</div>
        <div className={styles.navCenter}>
          <button className={`${styles.navBtn} ${activeTab === 'overview' ? styles.activeTab : ''}`} onClick={() => setActiveTab('overview')}><LayoutGrid size={18}/> Approvals</button>
          <button className={`${styles.navBtn} ${activeTab === 'clubs' ? styles.activeTab : ''}`} onClick={() => setActiveTab('clubs')}><Users size={18}/> Club Forge</button>
          <button className={`${styles.navBtn} ${activeTab === 'analytics' ? styles.activeTab : ''}`} onClick={() => setActiveTab('analytics')}><BarChart3 size={18}/> Intelligence</button>
        </div>
        <button onClick={() => {localStorage.clear(); window.location.href='/';}} className={styles.navBtn} style={{ border: '2px solid var(--text-primary)' }}><LogOut size={18}/> Exit System</button>
      </nav>

      <main style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 10 }}>
        
        {/* TAB 1: EVENT APPROVALS */}
        {activeTab === 'overview' && (
          <section>
            <h1 className={styles.greeting} style={{ animation: 'slideDown 0.8s' }}>Event Oversight</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2.5rem' }}>
              {events.filter(e => e.status === 'pending').length === 0 ? (
                <div className={styles.statCard} style={{ gridColumn: '1/-1', padding: '5rem' }}>
                  <div className={styles.floatingIcon}><Sparkles size={64} /></div>
                  <h2 style={{ fontFamily: 'Playfair Display' }}>Queue Cleared</h2>
                  <p>All organizer submissions have been processed.</p>
                </div>
              ) : (
                events.filter(e => e.status === 'pending').map((event, index) => (
                  <div key={event.id} className={styles.card} style={{ animationDelay: `${index * 0.1}s` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span className={styles.badgePending}>PENDING</span>
                      <Activity size={20} color="var(--accent-color)" />
                    </div>
                    <h3 className={styles.eventTitle}>{event.title}</h3>
                    <p className={styles.eventDesc}>{event.description}</p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button onClick={() => handleUpdateStatus(event.id, 'approved')} className={styles.submitBtn} style={{ background: 'var(--text-primary)' }}>Approve</button>
                      <button onClick={() => handleUpdateStatus(event.id, 'rejected')} className={styles.submitBtn} style={{ background: 'transparent', border: '2px solid #C62828', color: '#C62828' }}>Reject</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* TAB 2: THE ATOMIC CLUB FORGE */}
        {activeTab === 'clubs' && (
          <section>
            <h1 className={styles.greeting}>Forge Organizations</h1>
            <div className={styles.card} style={{ marginBottom: '4rem' }}>
              <h2 style={{ marginBottom: '2rem', fontFamily: 'Playfair Display', fontSize: '2rem' }}>Initialize New Command</h2>
              <form onSubmit={handleCreateClub}>
                {/* Organizational Data */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                   <div>
                      <label className={styles.label}>Club Identity</label>
                      <input type="text" placeholder="e.g. Sreenidhi Cultra" className={styles.input} value={newClub.name} onChange={e => setNewClub({...newClub, name: e.target.value})} required />
                   </div>
                   <div>
                      <label className={styles.label}>Strategic Purpose</label>
                      <input type="text" placeholder="Short description..." className={styles.input} value={newClub.description} onChange={e => setNewClub({...newClub, description: e.target.value})} required />
                   </div>
                </div>

                {/* Personnel Credentials */}
                <div style={{ background: 'rgba(0,0,0,0.02)', padding: '2rem', borderRadius: '20px', border: '1px dashed var(--border-color)', marginBottom: '2.5rem' }}>
                  <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <UserPlus size={18} /> Personnel Credentials
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                    <div>
                      <label className={styles.label}>Lead Name</label>
                      <input type="text" placeholder="Organizer Name" className={styles.input} value={newClub.organizerName} onChange={e => setNewClub({...newClub, organizerName: e.target.value})} required />
                    </div>
                    <div>
                      <label className={styles.label}>Secure Email</label>
                      <input type="email" placeholder="org@college.edu" className={styles.input} value={newClub.organizerEmail} onChange={e => setNewClub({...newClub, organizerEmail: e.target.value})} required />
                    </div>
                    <div>
                      <label className={styles.label}>Access Key</label>
                      <input type="password" placeholder="••••••••" className={styles.input} value={newClub.organizerPassword} onChange={e => setNewClub({...newClub, organizerPassword: e.target.value})} required />
                    </div>
                  </div>
                </div>

                <button type="submit" className={styles.submitBtn} style={{ maxWidth: '300px', margin: '0 auto', background: 'var(--accent-color)' }}>
                  <Sparkles size={20} /> Execute Forge
                </button>
              </form>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
              {clubs.map((c, i) => (
                <div key={c.id} className={styles.card} style={{ textAlign: 'center', animationDelay: `${i * 0.1}s` }}>
                  <div className={styles.floatingIcon}><Users size={40} /></div>
                  <h3 className={styles.eventTitle}>{c.name}</h3>
                  <p className={styles.eventDesc}>{c.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 3: REAL-TIME INTELLIGENCE */}
        {activeTab === 'analytics' && (
          <section>
            <h1 className={styles.greeting}>Strategic Intelligence</h1>
            <div className={styles.statsRow}>
              <div className={styles.statCard} style={{ animationDelay: '0.1s' }}>
                <div className={styles.statValue}>{analytics.stats.students}</div>
                <div className={styles.statLabel}>Global Students</div>
              </div>
              <div className={styles.statCard} style={{ animationDelay: '0.2s' }}>
                <div className={styles.statValue}>{analytics.stats.events}</div>
                <div className={styles.statLabel}>Active Events</div>
              </div>
              <div className={styles.statCard} style={{ animationDelay: '0.3s' }}>
                <div className={styles.statValue}>{analytics.stats.attendance}</div>
                <div className={styles.statLabel}>Live Check-ins</div>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <div style={{ padding: '2rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontFamily: 'Playfair Display', margin: 0 }}>Attendance Log</h2>
                <span className={styles.badgeApproved} style={{ fontSize: '0.7rem' }}>LIVE FEED</span>
              </div>
              <table className={styles.participationTable}>
                <thead>
                  <tr>
                    <th>Student Identifier</th>
                    <th>Experience Title</th>
                    <th>Engagement Status</th>
                    <th>Precision Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.participation.map((row, i) => (
                    <tr key={i} style={{ animation: `fadeIn 0.5s ease-out both ${i * 0.05}s` }}>
                      <td style={{ fontWeight: '800' }}>{row.student}</td>
                      <td style={{ fontStyle: 'italic' }}>{row.event}</td>
                      <td>
                        {row.checked_in ? 
                          <span className={styles.badgeApproved} style={{ fontSize: '0.7rem' }}>CHECKED IN</span> : 
                          <span className={styles.badgePending} style={{ fontSize: '0.7rem', background: '#eee', color: '#666' }}>REGISTERED</span>
                        }
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{new Date(row.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}