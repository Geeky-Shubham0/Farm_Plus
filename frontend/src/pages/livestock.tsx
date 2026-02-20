import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./livestock.css";
import dairyImg from '../assets/dairy-contracts.jpg';
import livestockImg from '../assets/livestock-marketplace.jpg';
import {
  predictAgroImpact,
  predictLivestock,
  type AgroImpactResponse,
  type LivestockResponse,
} from "../lib/api";

const LivestockCare = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("health");
  const [prediction, setPrediction] = useState<LivestockResponse | null>(null);
  const [agroImpact, setAgroImpact] = useState<AgroImpactResponse | null>(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  const loadLivestockPrediction = async (tab: string) => {
    try {
      setLoadingPrediction(true);
      setPredictionError(null);

      if (tab === "health") {
        const [livestockResponse, agroImpactResponse] = await Promise.all([
          predictLivestock({
            movement: 0.67,
            feeding: 1,
            resting: 0.59,
            temperature: 101.4,
          }),
          predictAgroImpact({
            N: 50,
            P: 45,
            K: 50,
            temperature: 29,
            humidity: 62,
            ph: 6.5,
            rainfall: 20,
            soil_moisture: 40,
            soil_type: 2,
            sunlight_exposure: 8,
            wind_speed: 7,
            co2_concentration: 400,
            organic_matter: 3,
            irrigation_frequency: 3,
            crop_density: 5,
            pest_pressure: 0.5,
            fertilizer_usage: 100,
            growth_stage: 2,
            urban_area_proximity: 10,
            water_source_type: 1,
            frost_risk: 0,
            water_usage_efficiency: 2.5,
          }),
        ]);
        setPrediction(livestockResponse);
        setAgroImpact(agroImpactResponse);
        return;
      }

      if (tab === "productivity") {
        const livestockResponse = await predictLivestock({
          movement: 0.72,
          feeding: 1,
          resting: 0.64,
          temperature: 100.8,
        });
        setPrediction(livestockResponse);
        return;
      }

      const agroImpactResponse = await predictAgroImpact({
        N: 48,
        P: 42,
        K: 46,
        temperature: 30,
        humidity: 65,
        ph: 6.4,
        rainfall: 25,
        soil_moisture: 45,
        soil_type: 2,
        sunlight_exposure: 8,
        wind_speed: 8,
        co2_concentration: 405,
        organic_matter: 3,
        irrigation_frequency: 3,
        crop_density: 5,
        pest_pressure: 0.6,
        fertilizer_usage: 100,
        growth_stage: 2,
        urban_area_proximity: 10,
        water_source_type: 1,
        frost_risk: 0,
        water_usage_efficiency: 2.5,
      });
      setAgroImpact(agroImpactResponse);
    } catch (error) {
      setPredictionError(error instanceof Error ? error.message : "Unable to sync livestock model data.");
    } finally {
      setLoadingPrediction(false);
    }
  };

  useEffect(() => {
    void loadLivestockPrediction(activeTab);
  }, [activeTab]);

  const livestock = [
    { id: "#14", name: "Cow #14", breed: "Taj", task: "Ihy day", due: "Tomorrow", color: "#f59e0b" },
    { id: "#21", name: "Rabies Vaccine", breed: "Goat #21", task: "n 3 days", due: "3 days", color: "#10b981" },
    { id: "#34", name: "Deworming", breed: "Cow #34", task: "n 5 days", due: "5 days", color: "#f59e0b" },
    { id: "#all", name: "Mastitis Check", breed: "All cows", task: "7 days", due: "7 days", color: "#ef4444" },
  ];

  const alerts = [
    {
      type: "Early Alert",
      subject: "Shirley #223",
      time: "1 hour ago",
      desc: "Trade alert - early symptoms of decreased activity",
      color: "#f59e0b",
    },
    {
      type: "Low Temperature",
      subject: "detected;",
      time: "3 hour ago",
      desc: "Possible illness",
      color: "#f59e0b",
    },
    {
      type: "Issue Alert",
      subject: "Owni #425",
      time: "2 hour ago",
      desc: "High temperature: immediate attention needed",
      color: "#f59e0b",
    },
  ];

  // Simulated temperature sparkline data
  const sparkPoints = [40, 55, 45, 60, 58, 70, 80];
  const maxVal = Math.max(...sparkPoints);
  const minVal = Math.min(...sparkPoints);
  const normalize = (v: number) => 100 - ((v - minVal) / (maxVal - minVal)) * 70 - 10;
  const polyline = sparkPoints
    .map((v, i) => `${(i / (sparkPoints.length - 1)) * 140},${normalize(v)}`)
    .join(" ");

  return (
    <div className="lc-page">

      {/* Hero Banner */}
      <div className="lc-hero">
        <div className="lc-hero-overlay" />
        <div className="lc-hero-content">
          <h1>Livestock Care</h1>
          <p>AI-powered health monitoring, productivity analytics, and livestock marketplace</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="lc-tabs-bar">
        <button
          className={`lc-tab ${activeTab === "health" ? "lc-tab-active" : ""}`}
          onClick={() => setActiveTab("health")}
        >
          Health Dashboard
        </button>
        <button
          className={`lc-tab ${activeTab === "productivity" ? "lc-tab-active" : ""}`}
          onClick={() => setActiveTab("productivity")}
        >
          Productivity Analytics
        </button>
        <button
          className={`lc-tab ${activeTab === "trade" ? "lc-tab-active" : ""}`}
          onClick={() => setActiveTab("trade")}
        >
          Livestock Trade
        </button>
      </div>

      {/* Main Content */}
      <div className="lc-main">
        {/* Left Panel */}
        <div className="lc-left">
          {/* Health Monitoring Summary */}
          <div className="lc-summary-bar">
            <span className="lc-summary-title">Health Monitoring Summary</span>
            <div className="lc-summary-badges">
              <span className="lc-badge lc-badge-total">🐄 68 Total</span>
              <span className="lc-badge lc-badge-healthy">⚡ {prediction?.health_status ?? "Pending"}</span>
              <span className="lc-badge lc-badge-priority">📋 {agroImpact?.impact?.replace(/_/g, " ") ?? "Pending"}</span>
              <span className="lc-badge lc-badge-issues">❤️ {prediction?.confidence_percent?.toFixed(0) ?? "--"}% confidence</span>
            </div>
            <button className="lc-sync-btn" onClick={() => void loadLivestockPrediction(activeTab)} disabled={loadingPrediction}>
              {loadingPrediction ? "⟳ Syncing..." : "⟳ Sync IOT Data"}
            </button>
          </div>
          {predictionError && <div className="lc-summary-bar">{predictionError}</div>}

          {/* Health Overview + Cow Detail */}
          <div className="lc-cards-row">
            {/* Overview Card */}
            <div className="lc-card lc-overview-card">
              <h3>Livestock Health Overview</h3>
              <div className="lc-overview-stats">
                <div className="lc-stat">
                  <span className="lc-stat-icon">📋</span>
                  <span className="lc-stat-label">68 Total</span>
                </div>
                <div className="lc-stat">
                  <span className="lc-stat-icon lc-green">✅</span>
                  <span className="lc-stat-label">66 Healthy</span>
                </div>
                <div className="lc-stat">
                  <span className="lc-stat-icon lc-green">📊</span>
                  <span className="lc-stat-label lc-big">85%</span>
                </div>
                <div className="lc-stat">
                  <span className="lc-stat-icon lc-red">🚨</span>
                  <span className="lc-stat-label">2 Issues</span>
                </div>
                <div className="lc-stat">
                  <span className="lc-stat-icon lc-yellow">⚠️</span>
                  <span className="lc-stat-label">AI IOC-</span>
                </div>
                <div className="lc-stat">
                  <button
                    className="lc-view-insights"
                    onClick={() => {
                      setActiveTab("health");
                      void loadLivestockPrediction("health");
                    }}
                  >
                    View Insights &gt;
                  </button>
                </div>
              </div>
              <div className="lc-alert-box">
                <span className="lc-alert-icon">⚠️</span>
                <div className="lc-alert-text">
                  <strong>AI Alert</strong>
                  <span className="lc-alert-sub">{prediction?.health_status ?? "Pending"}</span>
                </div>
                <span className="lc-alert-desc">
                  {prediction?.recommended_action ?? "Sync IoT data to receive recommendations."}
                  {agroImpact ? ` Agro impact: ${agroImpact.impact} (${agroImpact.confidence.toFixed(2)}).` : ""}
                </span>
                <span className="lc-chevron">&gt;</span>
              </div>
            </div>

            {/* Cow Detail Card */}
            <div className="lc-card lc-cow-card">
              <div className="lc-cow-card-top">
                <div style={{ flex: 1 }}>
                  <h3>Cow #52</h3>
                  <div className="lc-cow-text">
                    <p><span>ID:</span> #52</p>
                    <p><span>Age:</span> 4 years</p>
                    <p><span>Breed:</span> Holstein</p>
                  </div>
                  <div className="lc-temp-row">
                    <span>🌡️</span>
                    <span>Temp</span>
                  </div>
                  <div className="lc-sparkline-container">
                    <svg viewBox="0 0 140 90" className="lc-sparkline">
                      <polyline
                        points={polyline}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {sparkPoints.map((v, i) => (
                        <circle key={i} cx={(i / (sparkPoints.length - 1)) * 140} cy={normalize(v)} r="3" fill="#10b981" />
                      ))}
                    </svg>
                    <div className="lc-sparkline-labels">
                      <span>7 Days</span><span>1</span><span>7</span><span>6</span><span>10</span>
                    </div>
                  </div>
                </div>
                <div className="lc-cow-img-section">
                  <div className="lc-temp-badge">
                    <span className="lc-temp-val">102.8°F</span>
                    <span className="lc-temp-trend">↑ 1L by day</span>
                  </div>
                  <div className="lc-cow-img-placeholder">🐄</div>
                </div>
              </div>
              <button
                className="lc-milk-btn"
                onClick={() => {
                  setActiveTab("productivity");
                  void loadLivestockPrediction("productivity");
                }}
              >
                🐄 ↓ 148 IL +1 liters
              </button>
            </div>
          </div>

          {/* Livestock Marketplace */}
          <div className="lc-marketplace">
            <h2>Livestock Marketplace</h2>
            <div className="lc-market-cards">

              {/* Card 1 — No image (emoji only) */}
              <div className="lc-market-card">
                <div className="lc-market-img lc-market-img-1">
                  <div className="lc-market-overlay" />
                  <div className="lc-market-emoji">🐂</div>
                </div>
                <div className="lc-market-label">Buy & Sell Livestock</div>
              </div>

              {/* Card 2 — Dairy Contracts image */}
              <div className="lc-market-card">
                <div className="lc-market-img lc-market-img-2">
                  <img
                    src={dairyImg}
                    alt="Dairy Contracts"
                    className="lc-market-real-img"
                  />
                  <div className="lc-market-overlay" />
                </div>
                <div className="lc-market-label">Dairy Contracts</div>
                <button
                  className="lc-market-btn"
                  onClick={() => {
                    setActiveTab("trade");
                    void loadLivestockPrediction("trade");
                  }}
                >
                  Start Contract
                </button>
              </div>

              {/* Card 3 — Livestock Marketplace image */}
              <div className="lc-market-card">
                <div className="lc-market-img lc-market-img-3">
                  <img
                    src={livestockImg}
                    alt="Livestock Marketplace"
                    className="lc-market-real-img"
                  />
                  <div className="lc-market-overlay" />
                </div>
                <div className="lc-market-label">Livestock Marketplace</div>
                <button className="lc-market-btn lc-market-btn-dark" onClick={() => navigate('/market')}>Explore Offers &gt;</button>
              </div>

            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="lc-right">
          {/* Upcoming Tasks */}
          <div className="lc-card lc-tasks-card">
            <div className="lc-tasks-header">
              <h3>Upcoming Tasks</h3>
              <span className="lc-more">···</span>
            </div>
            <div className="lc-tasks-list">
              {livestock.map((item, i) => (
                <div className="lc-task-item" key={i}>
                  <span className="lc-task-icon">🐄</span>
                  <div className="lc-task-info">
                    <span className="lc-task-name">{item.name}</span>
                    <span className="lc-task-sub">{item.breed} · {item.task}</span>
                  </div>
                  <span className="lc-task-badge" style={{ background: `${item.color}22`, color: item.color }}>
                    {item.due}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="lc-card lc-alerts-card">
            <h3>Recent Alerts</h3>
            <div className="lc-alerts-list">
              {alerts.map((alert, i) => (
                <div className="lc-alert-item" key={i}>
                  <span className="lc-alert-item-icon">⚠️</span>
                  <div className="lc-alert-item-content">
                    <div className="lc-alert-item-header">
                      <span className="lc-alert-type" style={{ color: alert.color }}>
                        <strong>{alert.type}</strong>
                      </span>
                      <span className="lc-alert-subject"> - {alert.subject}</span>
                      <span className="lc-alert-time">{alert.time}</span>
                    </div>
                    <p className="lc-alert-desc-text">{alert.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivestockCare;