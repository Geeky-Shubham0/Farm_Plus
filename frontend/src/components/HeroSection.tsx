import './HeroSection.css';
import farmBg from '../assets/farm-bg.jpeg';

const HeroSection = () => {
  return (
    <section className="hero-section" style={{ backgroundImage: `url(${farmBg})` }}>
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1>Get AI-Driven Farm Insights</h1>
        <p className="hero-sub">Smart Farming. Simple Decisions.</p>
        <div className="search-bar">
          <input type="text" placeholder="Enter your location for personalized insights" />
          <button>Search</button>
        </div>
        <ul className="hero-features">
          <li>• AI-Powered Crop, Livestock & Market Analysis</li>
          <li>• Real-Time Weather, Soil & Price Alerts</li>
          <li>• Government Schemes & Expert Advice</li>
        </ul>
      </div>
    </section>
  );
};

export default HeroSection;