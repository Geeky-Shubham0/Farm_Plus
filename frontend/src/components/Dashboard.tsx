import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaChartLine } from "react-icons/fa";
import { GiCow, GiWheat } from "react-icons/gi";
import {
  getPriceIntelligence,
  predictAgroImpactLite,
  predictCropYield,
  predictLivestock,
  predictRisk,
  type AgroImpactResponse,
  type CropYieldResponse,
  type LivestockResponse,
  type PriceIntelligenceResponse,
  type RiskResponse,
} from "../lib/api";
import "./dashboard.css";

function getSeasonFromDate(date: Date) {
  // India: Rabi (Oct-Mar), Kharif (Jun-Oct), Zaid (Mar-Jun)
  const month = date.getMonth() + 1;
  if (month >= 10 || month <= 3) return "Rabi";
  if (month >= 6 && month <= 10) return "Kharif";
  return "Zaid";
}


const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTrendTab, setActiveTrendTab] = useState<"yield" | "market" | "livestock">("yield");
  const [cropData, setCropData] = useState<CropYieldResponse | null>(null);
  const [riskData, setRiskData] = useState<RiskResponse | null>(null);
  const [livestockData, setLivestockData] = useState<LivestockResponse | null>(null);
  const [priceData, setPriceData] = useState<PriceIntelligenceResponse | null>(null);
  const [agroImpactData, setAgroImpactData] = useState<AgroImpactResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Loading states for each stat card
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [soilLoading, setSoilLoading] = useState(true);
  const [marketLoading, setMarketLoading] = useState(true);
  const [livestockLoading, setLivestockLoading] = useState(true);
  // Real-time location and season
  const [userLocation] = useState<string>("Detecting...");
  const [season] = useState<string>(getSeasonFromDate(new Date()));
  const [seasonYear] = useState<number>(new Date().getFullYear());
  // Use window.location.search for searchParams
  const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const selectedLocation = searchParams.get("location")?.trim() || userLocation;
  const latFromQuery = Number(searchParams.get("lat"));
  const lngFromQuery = Number(searchParams.get("lng"));
  const latitude = Number.isFinite(latFromQuery) ? latFromQuery : 30.901;
    const longitude = Number.isFinite(lngFromQuery) ? lngFromQuery : 75.857; // Fixed typo for longitude default value

  // Unified polling effect for all stat cards
  useEffect(() => {
    let isMounted = true;
    async function pollAll() {
      setWeatherLoading(true);
      setSoilLoading(true);
      setMarketLoading(true);
      setLivestockLoading(true);
      try {
        const [crop, risk, livestock, price, agroImpact] = await Promise.all([
          predictCropYield({
            Crop: "Wheat",
            Season: season,
            State: selectedLocation,
            Crop_Year: seasonYear,
            Area: 1.8,
            Production: 4.9,
            Annual_Rainfall: 620,
            fertilizer_per_area: 140,
            pesticide_per_area: 7,
            soil_type: "Loamy",
            rainfall_deviation: -0.08,
          }),
          predictRisk({
            weather_volatility: 0.42,
            price_fluctuation: 0.31,
            crop_sensitivity: 2,
          }),
          predictLivestock({
            movement: 0.61,
            feeding: 1,
            resting: 0.58,
            temperature: 101.2,
          }),
          getPriceIntelligence({
            crop: "Wheat",
            mandi: "Noida",
            days: 3,
          }),
          predictAgroImpactLite({
            latitude,
            longitude,
            crop: "wheat",
            sowing_date: `${seasonYear}-01-01`,
            pest_level: "Medium",
          }),
        ]);
        if (!isMounted) return;
        setCropData(crop);
        setRiskData(risk);
        setLivestockData(livestock);
        setPriceData(price);
        setAgroImpactData(agroImpact);
        setWeatherLoading(false);
        setSoilLoading(false);
        setMarketLoading(false);
        setLivestockLoading(false);
        setError(null);
      } catch (requestError) {
        if (!isMounted) return;
        setError(requestError instanceof Error ? requestError.message : "Failed to load dashboard data.");
        setWeatherLoading(false);
        setSoilLoading(false);
        setMarketLoading(false);
        setLivestockLoading(false);
      }
    }
    pollAll();
    const interval = setInterval(pollAll, 10000); // every 10s
    return () => { isMounted = false; clearInterval(interval); };
  }, [latitude, longitude, season, seasonYear, selectedLocation]);
// Removed duplicate/old predictCropYield and related calls with snake_case/PascalCase properties

  const latestPredictedPrice = useMemo(() => {
    if (!priceData?.forecast.length) {
      return null;
    }
    return Math.round(priceData.forecast[priceData.forecast.length - 1].predicted_price);
  }, [priceData]);

  const formattedRisk = riskData?.risk_level ?? "Unknown";
  const agroImpactText = agroImpactData?.impact?.replace(/_/g, " ") ?? "pending";
  const agroImpactConfidence = agroImpactData?.confidence;
  const trendValue =
    activeTrendTab === "yield"
      ? `${cropData?.adjusted_yield?.toFixed(2) ?? "--"} tons/hectare`
      : activeTrendTab === "market"
        ? `₹${latestPredictedPrice ?? 0}/qtl`
        : `${livestockData?.health_status ?? "Pending"} (${livestockData?.confidence_percent?.toFixed(0) ?? "--"}%)`;

  return (
    <div className="dash-page">

      {/* ── PROFILE BAR ── */}
      <div className="profile-bar">
        <div className="profile-left">
          <div className="avatar">KS</div>
          <div>
            <div className="farmer-name">Farmer Dashboard</div>
            <div className="farmer-meta">
              <span>📍 Location: {selectedLocation}</span>
              <span>👤 Livestock: {livestockData?.health_status ?? "Detecting..."}</span>
              <span>📅 Season: {season} {seasonYear}</span>
            </div>
          </div>
        </div>
        <div className="profile-right">
          <button className="btn-outline" onClick={() => navigate('/smart-advisory')}>🌱 Smart Agency &gt;</button>
          <button className="btn-solid" onClick={() => navigate('/market')}>📊 View Full Report</button>
        </div>
      </div>

      {(weatherLoading || soilLoading || marketLoading || livestockLoading) && <div className="profile-bar">Loading smart advisory insights...</div>}
      {error && <div className="profile-bar">{error}</div>}

      {/* ── STAT CARDS ── */}
      <div className="stat-row">
        <div className="stat-card">
          <div className="sc-label">☀️ Weather</div>
          <div className="sc-content">
            {weatherLoading ? <div className="sc-big">Loading...</div> : <div className="sc-big">{agroImpactText}</div>}
            <div className="sc-small">Agro impact confidence: {weatherLoading ? "--" : agroImpactConfidence?.toFixed(2) ?? "--"}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="sc-label">💧 Soil Health</div>
          <div className="sc-content">
            {soilLoading ? <div className="sc-big">Loading...</div> : <div className="sc-big">{formattedRisk}</div>}
            <div className="sc-small">Risk model status</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="sc-label"><FaChartLine size={11}/> Market Price</div>
          <div className="sc-content">
            {marketLoading ? <div className="sc-big">Loading...</div> : <div className="sc-big">₹{latestPredictedPrice ?? 0} <small>/qtl</small></div>}
            <div className="sc-small">{priceData?.selected_mandi ?? "Noida"}: live forecast</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="sc-label"><GiCow size={13}/> Livestock</div>
          <div className="sc-content">
            {livestockLoading ? <div className="sc-big">Loading...</div> : <div className="sc-big">{livestockData?.health_status ?? "Pending"}</div>}
            <div className="sc-small">
              <span className="pill py">Confidence</span>
              <span className="pill pr">{livestockLoading ? "--" : livestockData?.confidence_percent?.toFixed(0) ?? "--"}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="main-grid">

        {/* Crop Intelligence */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Crop Intelligence</span>
            <span className="dots">• • •</span>
          </div>
          <div className="card-body">
            <div className="crop-body">
              <div className="crop-left">
                <GiWheat size={28} color="#9e9e9e" />
                <div className="cn">Wheat</div>
                <div className="cs">Predicted Yield:</div>
                <div className="pbar"><div className="pfill" /></div>
                <div className="cbadge">🌾 Medium</div>
              </div>
              <div className="crop-right">
                <div className="cyield">{cropData?.adjusted_yield?.toFixed(2) ?? "--"} <small>tons /<br/>hectare</small></div>
                <div className="cconf">Confidence: <b>{cropData?.confidence?.toFixed(0) ?? "--"}%</b></div>
                <button className="gbtn" onClick={() => navigate('/market')}>View Detailed Analysis</button>
              </div>
            </div>
          </div>
        </div>

        {/* Livestock Health */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🐄 Livestock Health</span>
            <span className="dots">• • • •</span>
          </div>
          <div className="card-body">
            <div className="live-body">
              <svg viewBox="0 0 120 120" width="115" height="115">
                <circle cx="60" cy="60" r="50" fill="#f5f5f5"/>
                <circle cx="60" cy="60" r="36" fill="transparent" stroke="#2e7d32" strokeWidth="22" strokeDasharray="169 226" strokeDashoffset="56"/>
                <circle cx="60" cy="60" r="36" fill="transparent" stroke="#f9a825" strokeWidth="22" strokeDasharray="34 226" strokeDashoffset="-113"/>
                <circle cx="60" cy="60" r="36" fill="transparent" stroke="#e53935" strokeWidth="22" strokeDasharray="23 226" strokeDashoffset="-147"/>
                <circle cx="60" cy="60" r="22" fill="white"/>
                <text x="60" y="53" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#2e7d32">9</text>
                <text x="60" y="64" textAnchor="middle" fontSize="9" fill="#f9a825">2</text>
                <text x="60" y="74" textAnchor="middle" fontSize="9" fill="#e53935">1</text>
              </svg>
              <div className="live-legend">
                <div><span className="dot dg"/>Status: <b>{livestockData?.health_status ?? "Pending"}</b></div>
                <div><span className="dot dy"/>Action: <b>{livestockData?.recommended_action ?? "--"}</b></div>
                <div><span className="dot dr"/>Confidence: <b>{livestockData?.confidence_percent?.toFixed(0) ?? "--"}%</b></div>
                <button className="gbtn mt8" onClick={() => navigate('/livestock-care')}>Open Health Details</button>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Alerts */}
        <div className="card alerts-card">
          <div className="card-header">
            <span className="card-title">Smart Alerts &amp; Recommendations</span>
          </div>
          <div className="alerts-body">
            <div className="alert-item">
              <FaExclamationTriangle color="#c62828" size={13}/>
              <div>
                <div><span className="al-r">Agro</span> - Weather impact</div>
                <div className="al-sub">Model reports {agroImpactText} with confidence {agroImpactConfidence?.toFixed(2) ?? "--"}.</div>
              </div>
              <span className="al-arr">›</span>
            </div>
            <div className="alert-item">
              <FaExclamationTriangle color="#e65100" size={13}/>
              <div>
                <div><span className="al-y">Risk</span> - Crop risk status</div>
                <div className="al-sub">Model reports: {formattedRisk}.</div>
              </div>
              <span className="al-arr">›</span>
            </div>
            <div className="alert-item">
              <FaExclamationTriangle color="#2e7d32" size={13}/>
              <div>
                <div><span className="al-g">Market</span> - Wheat trend updated,</div>
                <div className="al-sub">forecasted mandi price: ₹{latestPredictedPrice ?? 0}/qtl.</div>
              </div>
              <span className="al-arr">›</span>
            </div>
            <button className="take-btn" onClick={() => navigate('/market')}>Take Action</button>
          </div>
        </div>

        {/* Trends & Analytics */}
        <div className="card trends-card">
          <div className="card-header">
            <span className="card-title">Trends &amp; Analytics</span>
            <div className="ttabs">
              <button
                className={`ttab ${activeTrendTab === "yield" ? "on" : ""}`}
                onClick={() => setActiveTrendTab("yield")}
              >
                Yield Trend
              </button>
              <button
                className={`ttab ${activeTrendTab === "market" ? "on" : ""}`}
                onClick={() => setActiveTrendTab("market")}
              >
                Market Trend
              </button>
              <button
                className={`ttab ${activeTrendTab === "livestock" ? "on" : ""}`}
                onClick={() => setActiveTrendTab("livestock")}
              >
                Livestock
              </button>
            </div>
            <span className="rtag">🌧 15 mm Next 24h</span>
          </div>
          <div className="trends-body">
            <div className="cconf" style={{ marginBottom: "8px" }}>
              Current {activeTrendTab} signal: <b>{trendValue}</b>
            </div>
            <svg viewBox="0 0 560 105" width="100%" style={{flex:1}} preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="yg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a5d6a7" stopOpacity="0.7"/>
                  <stop offset="100%" stopColor="#a5d6a7" stopOpacity="0.05"/>
                </linearGradient>
              </defs>
              {/* grid lines */}
              {[15,35,55,75,95].map((y,i)=>(
                <line key={i} x1="48" y1={y} x2="550" y2={y} stroke="#e8e8e8" strokeWidth="1"/>
              ))}
              {/* y-axis */}
              <line x1="48" y1="5" x2="48" y2="97" stroke="#ccc" strokeWidth="1"/>
              <line x1="48" y1="97" x2="550" y2="97" stroke="#ccc" strokeWidth="1"/>
              {/* y labels */}
              {[['4.1',15],['3.5',35],['2.6',55],['1.3',75]].map(([v,y],i)=>(
                <text key={i} x="42" y={Number(y)+4} textAnchor="end" fontSize="9" fill="#888">{v}</text>
              ))}
              {/* area */}
              <polygon points="48,97 48,84 162,72 295,58 415,38 540,15 540,97" fill="url(#yg)"/>
              {/* line */}
              <polyline points="48,84 162,72 295,58 415,38 540,15" fill="none" stroke="#43a047" strokeWidth="2.5" strokeLinejoin="round"/>
              {/* data dots */}
              {[[48,84],[162,72],[295,58],[415,38],[540,15]].map(([x,y],i)=>(
                <circle key={i} cx={x} cy={y} r="5" fill="#fff" stroke="#43a047" strokeWidth="2.2"/>
              ))}
              {/* x labels */}
              {['2022','2023','2024','2025','2026'].map((yr,i)=>(
                <text key={i} x={48+i*123} y="107" textAnchor="middle" fontSize="10" fill="#888">{yr}</text>
              ))}
              {/* y-axis title */}
              <text x="8" y="55" textAnchor="middle" fontSize="8" fill="#aaa" transform="rotate(-90,8,55)">Yield (tons/hectare)</text>
            </svg>
            {/* FULL LEGEND — exactly like screenshot */}
            <div className="tlegend">
              <div className="tlegend-item"><span className="tldot low"/><span>Low</span></div>
              <div className="tlegend-item"><span className="tldot med"/><span>Medium</span></div>
              <div className="tlegend-item"><span className="tldot high"/><span>High</span></div>
              <div className="tlegend-item"><span className="tldot med2"/><span>Medium</span></div>
              <div className="tlegend-item"><span className="tldot high2"/><span>High</span></div>
              <span className="air-tag">🌾 Air in future</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;