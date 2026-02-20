import { useState } from "react";
import "./livestock.css";
import dairyImg from '../assets/dairy-contracts.jpg';
import livestockImg from '../assets/livestock-marketplace.jpg';

const LivestockCare = () => {
  const [activeTab, setActiveTab] = useState("health");

  const livestock = [
    { id: "#14", name: "Cow #14", breed: "Taj", task: "Ihy day", due: "Tomorrow", color: "#f59e0b" },
    { id: "#21", name: "Rabies Vaccine", breed: "Goat #21", task: "n 3 days", due: "3 days", color: "#10b981" },
    { id: "#34", name: "Deworming", breed: "Cow #34", task: "n 5 days", due: "5 days", color: "#f59e0b" },
    { id: "#all", name: "Mastitis Check", breed: "All cows", task: "7 days", due: "7 days", color: "#ef4444" },
  ];

  const alerts = [
    {
      type: "Early Alert",
      subject: "Shirley #223",
      time: "1 hour ago",
      desc: "Trade alert - early symptoms of decreased activity",
      color: "#f59e0b",
    },
    {
      type: "Low Temperature",
      subject: "detected;",
      time: "3 hour ago",
      desc: "Possible illness",
      color: "#f59e0b",
    },
    {
      type: "Issue Alert",
      subject: "Owni #425",
      time: "2 hour ago",
      desc: "High temperature: immediate attention needed",
      color: "#f59e0b",
    },
  ];

  // Simulated temperature sparkline data
  const sparkPoints = [40, 55, 45, 60, 58, 70, 80];
  const maxVal = Math.max(...sparkPoints);
  const minVal = Math.min(...sparkPoints);
  const normalize = (v: number) => 100 - ((v - minVal) / (maxVal - minVal)) * 70 - 10;
  const polyline = sparkPoints
    .map((v, i) => `${(i / (sparkPoints.length - 1)) * 140},${normalize(v)}`)
    .join(" ");

  return (
    <div className="lc-page">
      {/* Navbar */}
      <nav className="lc-navbar">
        <div className="lc-brand">
          <span className="lc-logo">🌿</span>
          <span className="lc-brand-name">Farm+</span>
        </div>
        <div className="lc-nav-links">
          <a href="#">Home</a>
          <a href="#">Smart Advisory</a>
          <a href="#">Market</a>
          <a href="#" className="active">Livestock Care</a>
          <a href="#">Government Schemes</a>
          <a href="#">Knowledge Hub</a>
        </div>
        <div className="lc-nav-actions">
          <span className="lc-icon">👤</span>
          <span className="lc-icon">⚙️</span>
          <span className="lc-icon">🔔</span>
          <button className="lc-login-btn">Login</button>
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="lc-hero">
        <div className="lc-hero-overlay" />
        <div className="lc-hero-content">
          <h1>Livestock Care</h1>
          <p>AI-powered health monitoring, productivity analytics, and livestock marketplace</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="lc-tabs-bar">
        <button
          className={`lc-tab ${activeTab === "health" ? "lc-tab-active" : ""}`}
          onClick={() => setActiveTab("health")}
        >
          Health Dashboard
        </button>
        <button
          className={`lc-tab ${activeTab === "productivity" ? "lc-tab-active" : ""}`}
          onClick={() => setActiveTab("productivity")}
        >
          Productivity Analytics
        </button>
        <button
          className={`lc-tab ${activeTab === "trade" ? "lc-tab-active" : ""}`}
          onClick={() => setActiveTab("trade")}
        >
          Livestock Trade
        </button>
      </div>

      {/* Main Content */}
      <div className="lc-main">
        {/* Left Panel */}
        <div className="lc-left">
          {/* Health Monitoring Summary */}
          <div className="lc-summary-bar">
            <span className="lc-summary-title">Health Monitoring Summary</span>
            <div className="lc-summary-badges">
              <span className="lc-badge lc-badge-total">🐄 68 Total</span>
              <span className="lc-badge lc-badge-healthy">⚡ 6 healthy</span>
              <span className="lc-badge lc-badge-priority">📋 5 #ity</span>
              <span className="lc-badge lc-badge-issues">❤️ 2 Issues</span>
            </div>
            <button className="lc-sync-btn">⟳ Sync IOT Data</button>
          </div>

          {/* Health Overview + Cow Detail */}
          <div className="lc-cards-row">
            {/* Overview Card */}
            <div className="lc-card lc-overview-card">
              <h3>Livestock Health Overview</h3>
              <div className="lc-overview-stats">
                <div className="lc-stat">
                  <span className="lc-stat-icon">📋</span>
                  <span className="lc-stat-label">68 Total</span>
                </div>
                <div className="lc-stat">
                  <span className="lc-stat-icon lc-green">✅</span>
                  <span className="lc-stat-label">66 Healthy</span>
                </div>
                <div className="lc-stat">
                  <span className="lc-stat-icon lc-green">📊</span>
                  <span className="lc-stat-label lc-big">85%</span>
                </div>
                <div className="lc-stat">
                  <span className="lc-stat-icon lc-red">🚨</span>
                  <span className="lc-stat-label">2 Issues</span>
                </div>
                <div className="lc-stat">
                  <span className="lc-stat-icon lc-yellow">⚠️</span>
                  <span className="lc-stat-label">AI IOC-</span>
                </div>
                <div className="lc-stat">
                  <span className="lc-view-insights">View Insights &gt;</span>
                </div>
              </div>
              <div className="lc-alert-box">
                <span className="lc-alert-icon">⚠️</span>
                <div className="lc-alert-text">
                  <strong>AI Alert</strong>
                  <span className="lc-alert-sub">Discreation</span>
                </div>
                <span className="lc-alert-desc">High temperature and low activity detected: Possible lameness</span>
                <span className="lc-chevron">&gt;</span>
              </div>
            </div>

            {/* Cow Detail Card */}
            <div className="lc-card lc-cow-card">
              <div className="lc-cow-card-top">
                <div style={{ flex: 1 }}>
                  <h3>Cow #52</h3>
                  <div className="lc-cow-text">
                    <p><span>ID:</span> #52</p>
                    <p><span>Age:</span> 4 years</p>
                    <p><span>Breed:</span> Holstein</p>
                  </div>
                  <div className="lc-temp-row">
                    <span>🌡️</span>
                    <span>Temp</span>
                  </div>
                  <div className="lc-sparkline-container">
                    <svg viewBox="0 0 140 90" className="lc-sparkline">
                      <polyline
                        points={polyline}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {sparkPoints.map((v, i) => (
                        <circle key={i} cx={(i / (sparkPoints.length - 1)) * 140} cy={normalize(v)} r="3" fill="#10b981" />
                      ))}
                    </svg>
                    <div className="lc-sparkline-labels">
                      <span>7 Days</span><span>1</span><span>7</span><span>6</span><span>10</span>
                    </div>
                  </div>
                </div>
                <div className="lc-cow-img-section">
                  <div className="lc-temp-badge">
                    <span className="lc-temp-val">102.8°F</span>
                    <span className="lc-temp-trend">↑ 1L by day</span>
                  </div>
                  <div className="lc-cow-img-placeholder">🐄</div>
                </div>
              </div>
              <button className="lc-milk-btn">🐄 ↓ 148 IL +1 liters</button>
            </div>
          </div>

          {/* Livestock Marketplace */}
          <div className="lc-marketplace">
            <h2>Livestock Marketplace</h2>
            <div className="lc-market-cards">

              {/* Card 1 — No image (emoji only) */}
              <div className="lc-market-card">
                <div className="lc-market-img lc-market-img-1">
                  <div className="lc-market-overlay" />
                  <div className="lc-market-emoji">🐂</div>
                </div>
                <div className="lc-market-label">Buy & Sell Livestock</div>
              </div>

              {/* Card 2 — Dairy Contracts image */}
              <div className="lc-market-card">
                <div className="lc-market-img lc-market-img-2">
                  <img
                    src={dairyImg}
                    alt="Dairy Contracts"
                    className="lc-market-real-img"
                  />
                  <div className="lc-market-overlay" />
                </div>
                <div className="lc-market-label">Dairy Contracts</div>
                <button className="lc-market-btn">Start Contract</button>
              </div>

              {/* Card 3 — Livestock Marketplace image */}
              <div className="lc-market-card">
                <div className="lc-market-img lc-market-img-3">
                  <img
                    src={livestockImg}
                    alt="Livestock Marketplace"
                    className="lc-market-real-img"
                  />
                  <div className="lc-market-overlay" />
                </div>
                <div className="lc-market-label">Livestock Marketplace</div>
                <button className="lc-market-btn lc-market-btn-dark">Explore Offers &gt;</button>
              </div>

            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="lc-right">
          {/* Upcoming Tasks */}
          <div className="lc-card lc-tasks-card">
            <div className="lc-tasks-header">
              <h3>Upcoming Tasks</h3>
              <span className="lc-more">···</span>
            </div>
            <div className="lc-tasks-list">
              {livestock.map((item, i) => (
                <div className="lc-task-item" key={i}>
                  <span className="lc-task-icon">🐄</span>
                  <div className="lc-task-info">
                    <span className="lc-task-name">{item.name}</span>
                    <span className="lc-task-sub">{item.breed} · {item.task}</span>
                  </div>
                  <span className="lc-task-badge" style={{ background: `${item.color}22`, color: item.color }}>
                    {item.due}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="lc-card lc-alerts-card">
            <h3>Recent Alerts</h3>
            <div className="lc-alerts-list">
              {alerts.map((alert, i) => (
                <div className="lc-alert-item" key={i}>
                  <span className="lc-alert-item-icon">⚠️</span>
                  <div className="lc-alert-item-content">
                    <div className="lc-alert-item-header">
                      <span className="lc-alert-type" style={{ color: alert.color }}>
                        <strong>{alert.type}</strong>
                      </span>
                      <span className="lc-alert-subject"> - {alert.subject}</span>
                      <span className="lc-alert-time">{alert.time}</span>
                    </div>
                    <p className="lc-alert-desc-text">{alert.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivestockCare;