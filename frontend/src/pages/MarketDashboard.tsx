import React from "react";
import "./MarketDashboard.css";

// Existing components (already in your project)
// import Navbar from "../components/navbar";

// New components
import DomesticBidding from "../components/DomesticBidding";
import ExportBidding from "../components/ExportBidding";
import TrendingCrops from "../components/TrendingCrops";
import ResourcesTips from "../components/ResourcesTips";

const MarketDashboard: React.FC = () => {
  return (
    <div className="md-root">
      {/* Navbar - already exists in your project */}
      {/* <Navbar /> */}

      {/* Hero Banner */}
      <div className="md-hero">
        {/* Background landscape image layer */}
        <div className="md-hero-bg" />

        <div className="md-hero-content">
          <nav className="md-breadcrumb">
            <a href="/" className="md-breadcrumb-link">Home</a>
            <span className="md-breadcrumb-sep">&rsaquo;</span>
            <span className="md-breadcrumb-current">Market Dashboard</span>
          </nav>

          <h1 className="md-hero-title">Market Dashboard</h1>
          <p className="md-hero-sub">Set competitive prices, sell domestically &amp; export easily</p>
        </div>

        <button className="md-how-btn">
          <span className="md-how-icon">?</span>
          Learn How Bidding Works &rsaquo;
        </button>
      </div>

      {/* Main Content */}
      <div className="md-container">

        {/* Top Row: Domestic + Export Bidding */}
        <div className="md-top-row">
          <div className="md-col">
            <DomesticBidding />
          </div>
          <div className="md-col">
            <ExportBidding />
          </div>
        </div>

        {/* Bottom Row: Trending Crops + Resources */}
        <div className="md-bottom-row">
          <div className="md-col-wide">
            <TrendingCrops />
          </div>
          <div className="md-col-narrow">
            <ResourcesTips />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDashboard;