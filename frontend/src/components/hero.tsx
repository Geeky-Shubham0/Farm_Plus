import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './hero.css';
import farmBg from '../assets/farm-bg.jpeg';

const Hero = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');

  return (
    <section className="hero" style={{ backgroundImage: `url(${farmBg})` }}>
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1>Smart Farming. Simple Decisions</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter your location for personalized insights"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button onClick={() => navigate(`/smart-advisory?location=${encodeURIComponent(location.trim())}`)}>Search</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;