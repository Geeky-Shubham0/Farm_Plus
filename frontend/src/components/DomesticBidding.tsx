import React, { useState } from "react";
import "./DomesticBidding.css";
import { getPriceIntelligence } from "../lib/api";

interface Bid {
  id: string;
  buyer: string;
  price: number;
  unit: string;
  location: string;
  timeAgo: string;
  change: number;
}

const mockBids: Bid[] = [
  { id: "b1", buyer: "Sharma Traders", price: 2300, unit: "qtl", location: "Kocume", timeAgo: "3 hours ago", change: 50 },
  { id: "b2", buyer: "Varun Agrotech", price: 2250, unit: "qtl", location: "Lucknow", timeAgo: "5 hours ago", change: -100 },
  { id: "b3", buyer: "Singh Enterprises", price: 2200, unit: "qtl", location: "Varanasi", timeAgo: "1 day ago", change: 20 },
];

const crops = ["Wheat", "Rice", "Onion", "Potato", "Tomato"];

const DomesticBidding: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState("Wheat");
  const [price, setPrice] = useState("2000");
  const [quantity, setQuantity] = useState("100");
  const [bids, setBids] = useState<Bid[]>(mockBids);
  const [accepted, setAccepted] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insight, setInsight] = useState<string | null>(null);

  const handleAccept = (id: string) => {
    setAccepted(id);
    setTimeout(() => setAccepted(null), 2000);
  };

  const handleSetPrice = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getPriceIntelligence({
        crop: selectedCrop,
        mandi: "Noida",
        days: 3,
      });

      const mappedBids: Bid[] = response.forecast.map((item, index, forecast) => {
        const previousPrice = index > 0 ? forecast[index - 1].predicted_price : item.predicted_price;
        return {
          id: `api-${index}`,
          buyer: `Predicted Market Bid ${index + 1}`,
          price: Math.round(item.predicted_price),
          unit: "qtl",
          location: response.selected_mandi,
          timeAgo: item.date,
          change: Math.round(item.predicted_price - previousPrice),
        };
      });

      if (mappedBids.length > 0) {
        setBids(mappedBids);
      }

      const analysis = response.export_analysis;
      if (analysis && typeof analysis === "object") {
        const firstStringValue = Object.values(analysis).find((value) => typeof value === "string") as string | undefined;
        setInsight(firstStringValue ?? "Live market forecast synced.");
      } else {
        setInsight("Live market forecast synced.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to fetch market insights.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="db-card">
      <div className="db-header">
        <div className="db-live-dot" />
        <span className="db-live-label">Live</span>
      </div>

      <h2 className="db-title">Domestic Bidding</h2>
      <p className="db-subtitle">Set your price per kilogram or quintal for domestic buyers</p>

      <div className="db-controls">
        <select
          className="db-select"
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
        >
          {crops.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <div className="db-input-group">
          <span className="db-rupee">₹</span>
          <input
            className="db-input"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <select className="db-select" value={quantity} onChange={(e) => setQuantity(e.target.value)}>
          {["50", "100", "200", "500"].map((q) => (
            <option key={q}>{q} quintals</option>
          ))}
        </select>
      </div>

      <button className="db-set-btn" onClick={handleSetPrice} disabled={loading}>
        {loading ? "Syncing..." : "Set Price"}
      </button>

      {error && <p className="db-subtitle">{error}</p>}
      {insight && !error && <p className="db-subtitle">{insight}</p>}

      <div className="db-links">
        <a href="#" className="db-link">View Active Bids &rsaquo;</a>
        <a href="#" className="db-link">View Market Insights &rsaquo;</a>
      </div>

      <h3 className="db-bids-title">Active Bids</h3>
      <div className="db-bids-list">
        {bids.map((bid) => (
          <div key={bid.id} className="db-bid-row">
            <div className="db-bid-icon">🌾</div>
            <div className="db-bid-info">
              <span className="db-bid-buyer">{bid.buyer}</span>
              <span className="db-bid-time">{bid.timeAgo}</span>
            </div>
            <div className="db-bid-price-col">
              <span className="db-bid-price">₹{bid.price.toLocaleString()}<span className="db-bid-unit">/{bid.unit}</span></span>
              <span className={`db-bid-change ${bid.change >= 0 ? "positive" : "negative"}`}>
                {bid.change >= 0 ? "▲" : "▼"} ₹{Math.abs(bid.change)} {bid.change >= 0 ? "increase" : "decline"} today
              </span>
            </div>
            <div className="db-bid-location">
              <span className="db-location-dot">📍</span>
              <span>{bid.location}</span>
            </div>
            <button
              className={`db-accept-btn ${accepted === bid.id ? "accepted" : ""}`}
              onClick={() => handleAccept(bid.id)}
            >
              {accepted === bid.id ? "✓ Accepted!" : "Accept Bid"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DomesticBidding;