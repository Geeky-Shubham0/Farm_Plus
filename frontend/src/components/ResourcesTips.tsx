import React from "react";
import "./ResourcesTips.css";

interface Resource {
  id: string;
  title: string;
  desc: string;
  icon: string;
  tag: string;
}

const resources: Resource[] = [
  { id: "r1", title: "Bidding Best Practices", desc: "Learn tips for successful bidding", icon: "🏆", tag: "Guide" },
  { id: "r2", title: "Market Reports", desc: "Analyse latest market trends", icon: "📈", tag: "Report" },
  { id: "r3", title: "Export Guidelines", desc: "How to export crops internationally", icon: "🌍", tag: "Export" },
  { id: "r4", title: "Price Negotiation Tips", desc: "Get the best price for your produce", icon: "💬", tag: "Tips" },
];

const ResourcesTips: React.FC = () => {
  return (
    <div className="rt-card">
      <div className="rt-header">
        <h3 className="rt-title">Resources & Tips</h3>
        <button className="rt-read-all-btn">Read All</button>
      </div>

      <div className="rt-list">
        {resources.map((res) => (
          <div key={res.id} className="rt-item">
            <div className="rt-item-icon">{res.icon}</div>
            <div className="rt-item-content">
              <div className="rt-item-top">
                <span className="rt-item-title">{res.title}</span>
                <span className="rt-item-tag">{res.tag}</span>
              </div>
              <p className="rt-item-desc">{res.desc}</p>
            </div>
            <button className="rt-item-arrow">→</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourcesTips;