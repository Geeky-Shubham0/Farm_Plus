import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';
import farmBg from '../assets/farm-bg.jpeg';

const HeroSection = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoMessage, setGeoMessage] = useState<string | null>(null);
  const [detectingLocation, setDetectingLocation] = useState(false);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGeoMessage('Geolocation is not supported on this device/browser.');
      return;
    }

    setDetectingLocation(true);
    setGeoMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = Number(position.coords.latitude.toFixed(5));
        const lng = Number(position.coords.longitude.toFixed(5));
        setCoords({ lat, lng });

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
          );
          const data = await response.json() as { display_name?: string };
          if (data.display_name) {
            setLocation(data.display_name);
          } else {
            setLocation(`${lat}, ${lng}`);
          }
        } catch {
          setLocation(`${lat}, ${lng}`);
        }

        setGeoMessage('Location detected successfully.');
        setDetectingLocation(false);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setGeoMessage('Location permission denied. Please allow location access.');
        } else {
          setGeoMessage('Unable to detect location right now.');
        }
        setDetectingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      },
    );
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('location', location.trim());
    if (coords) {
      params.set('lat', coords.lat.toString());
      params.set('lng', coords.lng.toString());
    }
    navigate(`/smart-advisory?${params.toString()}`);
  };

  return (
    <section className="hero-section" style={{ backgroundImage: `url(${farmBg})` }}>
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1>Get AI-Driven Farm Insights</h1>
        <p className="hero-sub">Smart Farming. Simple Decisions.</p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter your location for personalized insights"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className="hero-location-tools">
          <button className="hero-location-btn" onClick={handleDetectLocation} disabled={detectingLocation}>
            {detectingLocation ? 'Detecting...' : 'Use My Location'}
          </button>
          {geoMessage && <span className="hero-location-message">{geoMessage}</span>}
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