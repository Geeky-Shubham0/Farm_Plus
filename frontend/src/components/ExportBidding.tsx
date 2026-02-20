import React, { useState } from "react";
import "./ExportBidding.css";
import { getPriceIntelligence } from "../lib/api";

interface ExportOffer {
  id: string;
  buyer: string;
  pricePerKg: number;
  quantity: string;
  destination: string;
  timeAgo: string;
}

const mockOffers: ExportOffer[] = [
  { id: "e1", buyer: "AgroGlobal Ltd.", pricePerKg: 2550, quantity: "7 tonnes", destination: "Dubai", timeAgo: "2 hours ago" },
  { id: "e2", buyer: "GreenFields Int'l", pricePerKg: 2525, quantity: "10 tonnes", destination: "Singapore", timeAgo: "6 hours ago" },
  { id: "e3", buyer: "IndiGrain Exporters", pricePerKg: 2500, quantity: "6 tonnes", destination: "London", timeAgo: "1 day ago" },
];

const exportOrgs = ["ABC Agro Exports Ltd.", "GreenFields Int'l", "IndiGrain Exporters"];
const crops = ["Wheat", "Rice", "Onion", "Potato", "Tomato"];

const ExportBidding: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState("Wheat");
  const [selectedOrg, setSelectedOrg] = useState(exportOrgs[0]);
  const [exportPrice, setExportPrice] = useState("2600");
  const [quantity, setQuantity] = useState("5");
  const [accepted, setAccepted] = useState<string | null>(null);
  const [offers, setOffers] = useState<ExportOffer[]>(mockOffers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAccept = (id: string) => {
    setAccepted(id);
    setTimeout(() => setAccepted(null), 2000);
  };

  const handleSetExportPrice = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getPriceIntelligence({
        crop: selectedCrop,
        mandi: "Noida",
        days: 3,
      });

      const mappedOffers: ExportOffer[] = response.forecast.map((item, index) => ({
        id: `offer-${index}`,
        buyer: `Global Buyer ${index + 1}`,
        pricePerKg: Math.round(item.predicted_price),
        quantity: `${quantity} tonnes`,
        destination: selectedOrg,
        timeAgo: item.date,
      }));

      if (mappedOffers.length > 0) {
        setOffers(mappedOffers);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to fetch export offers.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="eb-card">
      <div className="eb-header">
        <div className="eb-live-dot" />
        <span className="eb-live-label">Live</span>
      </div>

      <h2 className="eb-title">Export Bidding</h2>
      <p className="eb-subtitle">Set your price to export to organizations or international buyers.</p>

      <div className="eb-controls">
        <select className="eb-select" value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)}>
          {crops.map((c) => <option key={c}>{c}</option>)}
        </select>

        <select className="eb-select" value={selectedOrg} onChange={(e) => setSelectedOrg(e.target.value)}>
          {exportOrgs.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>

      <div className="eb-price-row">
        <div className="eb-input-group">
          <span className="eb-rupee">₹</span>
          <input
            className="eb-input"
            type="number"
            value={exportPrice}
            onChange={(e) => setExportPrice(e.target.value)}
          />
        </div>
        <select className="eb-select" value={quantity} onChange={(e) => setQuantity(e.target.value)}>
          {["1", "2", "5", "10", "20"].map((q) => <option key={q}>{q} tonnes</option>)}
        </select>
      </div>

      <button className="eb-set-btn" onClick={handleSetExportPrice} disabled={loading}>
        {loading ? "Syncing..." : "Set Export Price"}
      </button>

      {error && <p className="eb-subtitle">{error}</p>}

      <div className="eb-links">
        <a href="#" className="eb-link">View Export Offers &rsaquo;</a>
      </div>

      <h3 className="eb-offers-title">Export Offers</h3>
      <div className="eb-offers-list">
        {offers.map((offer) => (
          <div key={offer.id} className="eb-offer-row">
            <div className="eb-offer-icon">🌍</div>
            <div className="eb-offer-info">
              <span className="eb-offer-buyer">{offer.buyer}</span>
              <span className="eb-offer-time">{offer.timeAgo}</span>
            </div>
            <div className="eb-offer-price-col">
              <span className="eb-offer-price">₹{offer.pricePerKg.toLocaleString()}<span className="eb-offer-unit">/kg</span></span>
              <span className="eb-offer-qty">📦 {offer.quantity}</span>
            </div>
            <div className="eb-offer-dest">
              <span className="eb-dest-flag">🏴</span>
              <span>{offer.destination}</span>
            </div>
            <button
              className={`eb-accept-btn ${accepted === offer.id ? "accepted" : ""}`}
              onClick={() => handleAccept(offer.id)}
            >
              {accepted === offer.id ? "✓ Accepted!" : "Accept Offer"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExportBidding;