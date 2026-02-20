import './hero.css';
import farmBg from '../assets/farm-bg.jpeg';

const Hero = () => {
  return (
    <section className="hero" style={{ backgroundImage: `url(${farmBg})` }}>
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1>Smart Farming. Simple Decisions</h1>
        <div className="search-bar">
          <input type="text" placeholder="Enter your location for personalized insights" />
          <button>Search</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;