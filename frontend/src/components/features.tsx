import { useNavigate } from 'react-router-dom';
import './features.css';

const CropIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
    <rect x="6" y="32" width="6" height="10" rx="1" fill="#2d6a2d" />
    <rect x="15" y="24" width="6" height="18" rx="1" fill="#2d6a2d" />
    <rect x="24" y="28" width="6" height="14" rx="1" fill="#2d6a2d" />
    <path d="M30 16 Q30 6 22 6 Q22 16 30 16Z" fill="#4caf50" />
    <path d="M30 16 Q38 12 36 6 Q28 8 30 16Z" fill="#66bb6a" />
    <line x1="30" y1="16" x2="30" y2="30" stroke="#2d6a2d" strokeWidth="2" />
  </svg>
);

const LivestockIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
    <ellipse cx="22" cy="30" rx="12" ry="9" fill="#2d6a2d" />
    <ellipse cx="34" cy="24" rx="6" ry="5" fill="#2d6a2d" />
    <ellipse cx="31" cy="20" rx="2.5" ry="1.5" fill="#2d6a2d" transform="rotate(-30 31 20)" />
    <rect x="13" y="37" width="3" height="6" rx="1" fill="#2d6a2d" />
    <rect x="19" y="38" width="3" height="5" rx="1" fill="#2d6a2d" />
    <rect x="25" y="38" width="3" height="5" rx="1" fill="#2d6a2d" />
    <rect x="31" y="37" width="3" height="6" rx="1" fill="#2d6a2d" />
    <circle cx="40" cy="36" r="8" fill="#4caf50" />
    <polyline points="36,36 39,40 44,32" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrendIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
    <rect x="4" y="34" width="6" height="8" rx="1" fill="#2d6a2d" opacity="0.5" />
    <rect x="13" y="26" width="6" height="16" rx="1" fill="#2d6a2d" opacity="0.7" />
    <rect x="22" y="18" width="6" height="24" rx="1" fill="#2d6a2d" opacity="0.9" />
    <rect x="31" y="10" width="6" height="32" rx="1" fill="#2d6a2d" />
    <polyline points="4,36 14,28 24,20 38,10" stroke="#4caf50" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <polygon points="38,10 44,8 42,16" fill="#4caf50" />
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
    <path d="M24 6 C14 6 10 14 10 22 L10 32 L6 36 L42 36 L38 32 L38 22 C38 14 34 6 24 6Z" fill="#2d6a2d" />
    <circle cx="24" cy="42" r="3" fill="#2d6a2d" />
  </svg>
);

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <CropIcon />,
      title: 'Smart Advisory',
      description: 'AI-driven crop & farming insights',
      btnLabel: 'Predict Yield →',
      onClick: () => navigate('/smart-advisory'),
    },
    {
      icon: <LivestockIcon />,
      title: 'Livestock Health',
      description: 'Monitor health & get recommendations',
      btnLabel: 'Check Health →',
      onClick: () => navigate('/livestock-care'),
    },
    {
      icon: <TrendIcon />,
      title: 'Marketplace & Trade',
      description: 'Access prices, bids & export data',
      btnLabel: 'View Prices →',
      onClick: () => navigate('/market'),   // ← navigates to Market Dashboard
    },
    {
      icon: <AlertIcon />,
      title: 'Government Schemes',
      description: 'Explore subsidies & apply easily',
      btnLabel: 'Explore Schemes →',
      onClick: () => navigate('/government-schemes'),
    },
  ];

  return (
    <section className="features">
      {features.map((f, i) => (
        <div className="card" key={i}>
          <div className="card-icon">{f.icon}</div>
          <h3>{f.title}</h3>
          <p>{f.description}</p>
          <button className="card-btn" onClick={f.onClick}>{f.btnLabel}</button>
        </div>
      ))}
    </section>
  );
};

export default Features;