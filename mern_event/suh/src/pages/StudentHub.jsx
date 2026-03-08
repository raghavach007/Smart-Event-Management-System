import { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import { Search, Calendar, Ticket, CheckCircle, Sparkles, Bell, X, Share2, LogOut } from 'lucide-react';
import styles from './StudentHub.module.css';

export default function StudentHub() {
  const [activeTab, setActiveTab] = useState('discover');
  const [allEvents, setAllEvents] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Welcome to Cultra! Explore upcoming experiences.", time: "Just now" }
  ]);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch public approved events
      const eventsRes = await axios.get('/api/events');
      
      // Fetch personal tickets if logged in
      let ticketsRes = { data: [] };
      if (user && token) {
        ticketsRes = await axios.get('/api/student/tickets', authConfig);
      }
      
      setAllEvents(eventsRes.data || []);
      setMyTickets(ticketsRes.data || []);
    } catch (error) {
      console.error('Master fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRegister = async (event) => {
    try {
      await axios.post(`/api/student/events/${event.id}/register`, {}, authConfig);
      
      setNotifications(prev => [
        { id: Date.now(), message: `Pass secured for ${event.title}!`, time: "Just now" },
        ...prev
      ]);
      
      fetchData();
      setActiveTab('tickets'); 
      setSearchQuery('');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to claim ticket.');
    }
  };

  const shareEvent = (event) => {
    const message = `Hey! I just claimed my ticket for ${event.title} on Cultra! 🚀 Let's go together. Details: ${event.description}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const getPosterUrl = (eventId) => `https://picsum.photos/seed/${eventId * 42}/600/300`;

  // Logic for filtering events
  const registeredEventIds = myTickets.map(t => t.event_id || t.id);
  const discoverEvents = allEvents.filter(e => 
    !registeredEventIds.includes(e.id) && 
    (e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     e.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Loose equality check for database tinyint/boolean compatibility
  const upcomingTickets = myTickets.filter(t => Number(t.checked_in) === 0);
  const attendedEvents = myTickets.filter(t => Number(t.checked_in) === 1);

  return (
    <div className={styles.masterContainer}>
      <div className={styles.ambientOrb1}></div>
      <div className={styles.ambientOrb2}></div>

      {/* Notifications Drawer */}
      {showNotifications && (
        <>
          <div className={styles.drawerBackdrop} onClick={() => setShowNotifications(false)} />
          <div className={styles.drawer}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif" }}>Intel Feed</h2>
              <button onClick={() => setShowNotifications(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X /></button>
            </div>
            {notifications.map(n => (
              <div key={n.id} className={styles.notificationCard}>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{n.message}</p>
                <small style={{ color: 'var(--text-secondary)' }}>{n.time}</small>
              </div>
            ))}
          </div>
        </>
      )}

      <nav className={styles.navbar}>
        <div className={styles.brand}><Sparkles size={28} /> Cultra.</div>
        
        <div className={styles.navCenter}>
          <button className={`${styles.navBtn} ${activeTab === 'discover' ? styles.activeTab : ''}`} onClick={() => setActiveTab('discover')}>
            <Calendar size={18} /> Discover
          </button>
          <button className={`${styles.navBtn} ${activeTab === 'tickets' ? styles.activeTab : ''}`} onClick={() => setActiveTab('tickets')}>
            <Ticket size={18} /> Wallet
          </button>
          <button className={`${styles.navBtn} ${activeTab === 'vault' ? styles.activeTab : ''}`} onClick={() => setActiveTab('vault')}>
            <CheckCircle size={18} /> Vault
          </button>
        </div>

        <div className={styles.navRight}>
          <div className={styles.bellWrapper} onClick={() => setShowNotifications(true)}>
            <Bell size={24} color="var(--text-primary)" />
            <div className={styles.notificationDot} />
          </div>
          <button onClick={handleLogout} className={styles.navBtn} style={{ border: '1px solid var(--text-primary)' }}><LogOut size={18} /> Leave</button>
        </div>
      </nav>

      <header className={styles.heroSection}>
        <h1 className={styles.greeting}>Welcome, {user?.name?.split(' ')[0] || 'Member'}.</h1>
      </header>

      <main className={styles.contentArea}>
        {activeTab === 'discover' && (
          <div className={styles.searchWrapper}>
            <div className={styles.searchBar}>
              <Search size={20} color="var(--text-secondary)" />
              <input 
                type="text" 
                placeholder="Search experiences..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
            </div>
          </div>
        )}
        
        <div className={styles.grid}>
          {loading ? (
             <div className={styles.emptyState}><p>Syncing with Core...</p></div>
          ) : activeTab === 'discover' ? (
            discoverEvents.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.floatingIcon}><Sparkles size={56} /></div>
                <h3>All Caught Up</h3>
                <p>You've claimed everything available. Stay tuned for fresh drops!</p>
              </div>
            ) : (
              discoverEvents.map((event, index) => (
                <div key={event.id} className={styles.card} style={{ animationDelay: `${index * 0.1}s` }}>
                  <img src={getPosterUrl(event.id)} className={styles.cardImage} alt="Event" />
                  <div className={styles.cardContent}>
                    <div className={styles.eventDate}>
                      {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <h3 className={styles.eventTitle}>{event.title}</h3>
                    <p className={styles.eventDesc}>{event.description}</p>
                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                      <button onClick={() => handleRegister(event)} className={styles.registerBtn} style={{ flex: 3 }}>Claim Pass</button>
                      <button onClick={() => shareEvent(event)} className={styles.registerBtn} style={{ flex: 1, background: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)' }}><Share2 size={18} /></button>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : activeTab === 'tickets' ? (
            upcomingTickets.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.floatingIcon}><Ticket size={56} /></div>
                <h3>Wallet Empty</h3>
                <p>Claim an event from the Discover tab to see your digital passes here.</p>
              </div>
            ) : (
              upcomingTickets.map((ticket, index) => (
                <div key={ticket.id} className={styles.card} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className={styles.cardContent}>
                    <h3 className={styles.eventTitle}>{ticket.title}</h3>
                    <div className={styles.vintageStub}>
                      <div className={styles.cutoutRight}></div>
                      <div className={styles.ticketTop}>
                        <span className={styles.ticketBadge}>Official Pass</span>
                        <div className={styles.ticketDateText}>
                          {new Date(ticket.event_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <div className={styles.ticketBottom}>
                        <div className={styles.qrContainer}><QRCodeCanvas value={ticket.qr_token} size={130} level="H" /></div>
                        <span className={styles.tokenText}>{ticket.qr_token.slice(0, 16)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            attendedEvents.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.floatingIcon}><CheckCircle size={56} /></div>
                <h3>Vault Locked</h3>
                <p>Complete an event check-in to unlock your history here.</p>
              </div>
            ) : (
              attendedEvents.map((event, index) => (
                <div key={event.id} className={styles.card} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className={styles.cardImageWrapper} style={{ filter: 'sepia(40%) contrast(1.1)' }}>
                    <img src={getPosterUrl(event.event_id || event.id)} className={styles.cardImage} alt="Attended" />
                    <div className={styles.stamp}>VERIFIED</div>
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.eventTitle}>{event.title}</h3>
                    <p className={styles.eventDesc}>Experience Completed.</p>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </main>
    </div>
  );
}