import './CTABanner.css';
import farmBg from '../assets/farm-bg.jpeg';
import { useNavigate } from 'react-router-dom';

const CTABanner = () => {
  const navigate = useNavigate();

  return (
    <section className="cta-section" style={{ backgroundImage: `url(${farmBg})` }}>
      <div className="cta-overlay" />
      <div className="cta-content">
        <h2>Stay Ahead, Farm Smart!</h2>
        <p>Join Farm+ for real-time insights, AI-driven decisions &amp; better yields.</p>
        <button className="cta-btn" onClick={() => navigate('/signup')}>Get AI Insights</button>
      </div>
    </section>
  );
};

export default CTABanner;