import './MarketTrends.css';

const MarketTrends = () => {
  return (
    <section className="market-section">
      <div className="market-header">
        <span className="market-icon">📊</span>
        <h2>Market Trends &amp; Trade</h2>
        <span className="live-badge">🔴 Live</span>
      </div>

      <div className="market-grid">
        {/* LEFT: Price Card */}
        <div className="price-card">
          <div className="price-top">
            <span className="price-label">🌾 Wheat Price</span>
            <span className="price-main">₹2150<span>/qtl</span></span>
            <span className="price-change positive">▲ ₹50 increase today</span>
          </div>

          {/* Bar chart */}
          <div className="price-bars">
            <div className="bar-group">
              <div className="bar current" style={{ height: '60%' }} />
              <span>Current<br/>₹300/qtl</span>
            </div>
            <div className="bar-group">
              <div className="bar target" style={{ height: '85%' }} />
              <span>Target<br/>₹2500/qtl</span>
            </div>
            <div className="bar-group">
              <div className="bar max" style={{ height: '40%' }} />
              <span>Max<br/>₹150/qtl</span>
            </div>
          </div>

          <div className="bar-legend">
            <span><span className="dot current-dot"/>Current</span>
            <span><span className="dot target-dot"/>Target</span>
            <span><span className="dot max-dot"/>Max</span>
          </div>

          <div className="price-actions">
            <button className="btn-outline">View Prices ›</button>
            <button className="btn-solid">Trade Market ›</button>
          </div>
        </div>

        {/* RIGHT: Import/Export */}
        <div className="import-card">
          <div className="import-header">
            <span>🚛 Import/Export Data</span>
          </div>
          <div className="import-value">₹6.2Cr</div>

          {/* Gauge */}
          <div className="gauge-wrapper">
            <svg viewBox="0 0 200 110" className="gauge-svg">
              {/* Background arc */}
              <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#e0e0e0" strokeWidth="18" strokeLinecap="round"/>
              {/* Green zone */}
              <path d="M 20 100 A 80 80 0 0 1 100 20" fill="none" stroke="#4caf50" strokeWidth="18" strokeLinecap="round"/>
              {/* Yellow zone */}
              <path d="M 100 20 A 80 80 0 0 1 155 38" fill="none" stroke="#ffc107" strokeWidth="18" strokeLinecap="round"/>
              {/* Red zone */}
              <path d="M 155 38 A 80 80 0 0 1 180 100" fill="none" stroke="#f44336" strokeWidth="18" strokeLinecap="round"/>
              {/* Needle */}
              <line x1="100" y1="100" x2="148" y2="42" stroke="#333" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="100" cy="100" r="6" fill="#333"/>
            </svg>
            <div className="gauge-labels">
              <span>Low</span>
              <span>Mid</span>
              <span>High</span>
            </div>
          </div>

          <div className="import-meta">
            <span>📅 2 Days Forecast</span>
            <span className="forecast-badge high">High</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketTrends;