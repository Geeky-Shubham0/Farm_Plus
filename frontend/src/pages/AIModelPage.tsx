import React from 'react';
import './AIModelPage.css';
// ── FPQI Scorer ──────────────────────────────────────────────
const FPQIScorer: React.FC = () => {
  const [score, setScore] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);

  const factors = [
    { label: 'Soil Quality', value: 82 },
    { label: 'Water Availability', value: 67 },
    { label: 'Crop Diversity', value: 74 },
    { label: 'Market Access', value: 91 },
  ];

  const handleScore = () => {
    setLoading(true);
    setTimeout(() => {
      setScore(Math.floor(Math.random() * 30) + 65);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="model-inner">
      <p className="model-desc">Evaluate Farm Productivity & Quality Index based on multiple agricultural parameters.</p>
      <div className="factor-list">
        {factors.map((f, i) => (
          <div className="factor-row" key={i}>
            <span className="factor-label">{f.label}</span>
            <div className="factor-bar-bg">
              <div className="factor-bar" style={{ width: `${f.value}%` }} />
            </div>
            <span className="factor-val">{f.value}%</span>
          </div>
        ))}
      </div>
      <button className="model-btn" onClick={handleScore} disabled={loading}>
        {loading ? 'Calculating...' : 'Calculate FPQI Score'}
      </button>
      {score !== null && (
        <div className="score-result">
          <span className="score-label">FPQI Score</span>
          <span className="score-value">{score}/100</span>
          <span className={`score-badge ${score >= 80 ? 'excellent' : score >= 65 ? 'good' : 'average'}`}>
            {score >= 80 ? '🌟 Excellent' : score >= 65 ? '✅ Good' : '⚠️ Average'}
          </span>
        </div>
      )}
    </div>
  );
};

// ── FPO Aggregator ───────────────────────────────────────────
const FPOAggregator: React.FC = () => {
  const fpos = [
    { name: 'Punjab Grain FPO', members: 340, crop: 'Wheat', match: 94 },
    { name: 'Haryana Agro FPO', members: 210, crop: 'Rice', match: 87 },
    { name: 'UP Farmers Union', members: 520, crop: 'Sugarcane', match: 79 },
    { name: 'Rajasthan Kisan FPO', members: 180, crop: 'Mustard', match: 72 },
  ];

  return (
    <div className="model-inner">
      <p className="model-desc">Aggregate and match Farmer Producer Organizations for collective bargaining and bulk trading.</p>
      <div className="fpo-list">
        {fpos.map((f, i) => (
          <div className="fpo-card" key={i}>
            <div className="fpo-info">
              <span className="fpo-name">{f.name}</span>
              <span className="fpo-meta">👥 {f.members} members · 🌾 {f.crop}</span>
            </div>
            <div className="fpo-match">
              <span className="match-val">{f.match}%</span>
              <span className="match-label">match</span>
            </div>
          </div>
        ))}
      </div>
      <button className="model-btn">Find Best FPO Match</button>
    </div>
  );
};

// ── B2B Matcher ──────────────────────────────────────────────
const B2BMatcher: React.FC = () => {
  const [matched, setMatched] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const buyers = [
    { name: 'AgroWorld Pvt Ltd', type: 'Exporter', crop: 'Wheat', price: '₹2300/qtl', rating: '⭐ 4.8' },
    { name: 'Bharat Foods Ltd', type: 'Processor', crop: 'Rice', price: '₹1950/qtl', rating: '⭐ 4.5' },
    { name: 'Global Agro Exports', type: 'Exporter', crop: 'Soybean', price: '₹5200/qtl', rating: '⭐ 4.7' },
  ];

  const handleMatch = () => {
    setLoading(true);
    setTimeout(() => { setMatched(true); setLoading(false); }, 1000);
  };

  return (
    <div className="model-inner">
      <p className="model-desc">AI-powered B2B matching connects farmers directly with verified buyers and exporters.</p>
      <button className="model-btn" onClick={handleMatch} disabled={loading || matched}>
        {loading ? 'Finding Matches...' : matched ? '✅ Matches Found' : 'Find B2B Matches'}
      </button>
      {matched && (
        <div className="buyer-list">
          {buyers.map((b, i) => (
            <div className="buyer-card" key={i}>
              <div className="buyer-info">
                <span className="buyer-name">{b.name}</span>
                <span className="buyer-meta">{b.type} · {b.crop}</span>
              </div>
              <div className="buyer-right">
                <span className="buyer-price">{b.price}</span>
                <span className="buyer-rating">{b.rating}</span>
                <button className="connect-btn">Connect</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────
const AIModelPage: React.FC = () => {
  return (
    <div className="dash-page">
      {/* Hero */}
      <div className="ai-hero">
        <p className="ai-breadcrumb-text">Home › AI Dashboard</p>
        <h1>🤖 AI Model Dashboard</h1>
        <p>Leverage machine learning models for smarter farming decisions</p>
      </div>

      <main className="dashboard-main">
        <div className="main-grid">
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">🧪 Model 7: FPQI Scoring</h2>
            </div>
            <div className="card-body">
              <FPQIScorer />
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">🤝 Model 8: FPO Aggregation</h2>
            </div>
            <div className="card-body">
              <FPOAggregator />
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">🔗 Model 9: B2B Matching</h2>
            </div>
            <div className="card-body">
              <B2BMatcher />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AIModelPage;