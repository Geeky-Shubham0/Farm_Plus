import React, { useState, useEffect } from "react";
import "./TrendingCrops.css";

interface CropPrice {
  name: string;
  price: number;
  change: number;
  icon: string;
}


// TODO: Replace with real API call
const defaultCropData: CropPrice[] = [
  { name: "Wheat", price: 2150, change: 50, icon: "🌾" },
  { name: "Rice", price: 3100, change: -100, icon: "🍚" },
  { name: "Maize", price: 160, change: 50, icon: "🌽" },
  { name: "Mustard", price: 5200, change: 120, icon: "🌼" },
  { name: "Chickpea", price: 5800, change: -80, icon: "🫘" },
];


const TrendingCrops: React.FC = () => {
  const [cropData, setCropData] = useState<CropPrice[]>(defaultCropData);
  const [highlightedPrice, setHighlightedPrice] = useState({ min: 1600, max: 3100 });
  const [loading, setLoading] = useState(false);

  // Simulate API fetch
  const fetchCropPrices = async () => {
    setLoading(true);
    // TODO: Replace with real API call
    setTimeout(() => {
      setCropData(defaultCropData);
      setHighlightedPrice({ min: 1600, max: 3100 });
      setLoading(false);
    }, 800);
  };

  // Poll every 1 min
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCropPrices();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Manual update handler
  const handleUpdateNow = () => {
    fetchCropPrices();
  };

  return (
    <div className="tc-card">
      <div className="tc-header">
        <h3 className="tc-title">Trending Crops Prices</h3>
        <div className="tc-range">
          <span className="tc-range-val tc-green">₹{highlightedPrice.max.toLocaleString()}/qtl</span>
          <span className="tc-range-sep">↔</span>
          <span className="tc-range-val tc-muted">₹{highlightedPrice.min.toLocaleString()}/qtl</span>
        </div>
        <button className="tc-update-btn" onClick={handleUpdateNow} disabled={loading} title="Update Now">
          {loading ? "Updating..." : "Update Now"}
        </button>
      </div>

      <div className="tc-crops-grid">
        {cropData.map((crop) => (
          <div key={crop.name} className="tc-crop-item">
            <span className="tc-crop-icon">{crop.icon}</span>
            <div className="tc-crop-info">
              <span className="tc-crop-name">{crop.name}</span>
              <span className="tc-crop-price">₹{crop.price.toLocaleString()}/qtl</span>
            </div>
            <span className={`tc-crop-change ${crop.change >= 0 ? "tc-up" : "tc-down"}`}>
              {crop.change >= 0 ? "▲" : "▼"} ₹{Math.abs(crop.change)} {crop.change >= 0 ? "increase" : "decrease"} today
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingCrops;