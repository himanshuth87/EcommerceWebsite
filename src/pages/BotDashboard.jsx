import React, { useState, useEffect } from 'react';
import './BotDashboard.css';

const BotDashboard = () => {
  const [botStatus, setBotStatus] = useState({
    success: true,
    service: 'Priority Bags WhatsApp Bot V1',
    status: 'Ready',
    webhookUrl: '...',
    activeConnections: 0,
    intelligenceLevel: '...'
  });

  const [activeChat, setActiveChat] = useState({
    name: 'Julian Vance',
    subject: 'Luggage Inquiry',
    transcript: [
      { sender: 'user', text: "Tell me more about the gold-plated hardware on the Priority Tote..." },
      { sender: 'bot', text: "Our Priority Tote features 24k gold-plated solid brass hardware, designed to resist tarnishing and maintain a deep, rich luster over a lifetime of travel." },
      { sender: 'user', text: "That sounds impressive. Does it come in different sizes?" },
      { sender: 'bot', text: "Yes, it is available in Grand (Cabin-approved) and Petit (Everyday carry). Would you like to see the specifications for both?" }
    ]
  });

  const [feed, setFeed] = useState([
    { id: 1, name: 'Julian Vance', time: '2m ago', preview: "The custom engraving has a typo. Can we adjust this before it ships?" },
    { id: 2, name: 'Elena Rossi', time: '14m ago', preview: "Order #7742 has been dispatched. Thank you for your assistance." },
    { id: 3, name: 'Marcus Sterling', time: '1h ago', preview: "Viewing: Limited Edition Alligator Satchel in Onyx Black..." },
    { id: 4, name: 'Sarah Jenkins', time: '2h ago', preview: "How do I care for the leather on the Aero Aluminum collection?" }
  ]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/v1/whatsapp/status');
        const data = await response.json();
        if (data.success) {
          setBotStatus(data);
        }
      } catch (err) {
        console.error('Failed to fetch bot status:', err);
      }
    };
    fetchStatus();
  }, []);

  return (
    <div className="bot-dashboard">
      <header className="dashboard-header">
        <div>
          <span className="status-badge">AI {botStatus.status.toUpperCase()}</span>
          <h1>BOT CONCIERGE</h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p className="stat-label">System Health</p>
          <p style={{ color: '#00FF00', fontWeight: 'bold' }}>99.9% UPTIME</p>
        </div>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Active Conversations</p>
          <span className="stat-value">{botStatus.activeConnections || 128}</span>
        </div>
        <div className="stat-card">
          <p className="stat-label">Current Success Rate</p>
          <span className="stat-value">94%</span>
        </div>
        <div className="stat-card">
          <p className="stat-label">Avg. Response Time</p>
          <span className="stat-value">0.8s</span>
        </div>
        <div className="stat-card">
          <p className="stat-label">Human Handoffs (Today)</p>
          <span className="stat-value">12</span>
        </div>
      </section>

      <div className="dashboard-content">
        {/* Live Feed */}
        <section className="feed-section">
          <h3>LIVE FEED</h3>
          <p style={{ fontSize: '0.8rem', color: '#CCC6B9', marginBottom: '32px' }}>
            Monitoring real-time interactions with the Atelier concierge.
          </p>
          
          <div className="conversation-list">
            {feed.map(item => (
              <div key={item.id} className="conversation-item">
                <div className="item-meta">
                  <span style={{ fontWeight: 'bold' }}>{item.name}</span>
                  <span>{item.time}</span>
                </div>
                <div className="item-preview">
                  {item.preview}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Log View */}
        <section className="log-section">
          <div className="dashboard-header" style={{ marginBottom: '32px' }}>
            <div>
              <p className="stat-label">CURRENT DIALOGUE</p>
              <h3>{activeChat.name} • {activeChat.subject}</h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#00FF00' }}>• ACTIVE</span>
          </div>

          <div className="transcript">
            {activeChat.transcript.map((msg, i) => (
              <div key={i} className={`message ${msg.sender}`}>
                <p style={{ margin: 0 }}>{msg.text}</p>
                <span style={{ fontSize: '0.65rem', opacity: 0.5, marginTop: '8px', display: 'block' }}>
                  {msg.sender === 'bot' ? 'ATELIER AI' : 'CLIENT'}
                </span>
              </div>
            ))}
          </div>

          <button className="takeover-btn">
            TAKE OVER CONVERSATION
          </button>
        </section>
      </div>

      <footer style={{ marginTop: '80px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px' }}>
        <p className="stat-label" style={{ textAlign: 'center' }}>
          ATELIER BOT DASHBOARD • SECURE ACCESS ONLY • PRIORITY BAGS © 2026
        </p>
      </footer>
    </div>
  );
};

export default BotDashboard;
