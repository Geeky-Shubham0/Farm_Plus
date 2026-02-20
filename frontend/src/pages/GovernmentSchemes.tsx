import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GovernmentSchemes.css';
import farmBg from '../assets/farm-bg.jpeg';

const schemes = [
  {
    icon: '🛡️',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    category: 'Insurance',
    type: 'insurance',
    description: 'Provides crop insurance coverage to farmers against natural calamities.',
  },
  {
    icon: '🌱',
    name: 'PM Kisan Samman Nidhi',
    category: 'Income Support',
    type: 'subsidy',
    description: 'Direct income support of ₹6,6000 annually to farmers.',
  },
  {
    icon: '💳',
    name: 'Kisan Credit Card',
    category: 'Agriculture Loan',
    type: 'loan',
    description: 'Credit facilities for farmers at affordable interest rates.',
  },
  {
    icon: '💧',
    name: 'PM Krishi Sinchai Yojana',
    category: 'Irrigation Subsidy',
    type: 'subsidy',
    description: 'Provides irrigation support to ensure water availability for crops.',
  },
  {
    icon: '🏦',
    name: 'Agriculture Infrastructure Fund',
    category: 'Agriculture Loan',
    type: 'loan',
    description: 'Financing for post-harvest management and agriculture infrastructure.',
  },
  {
    icon: '🌾',
    name: 'National Food Security Mission',
    category: 'Crop Subsidy',
    type: 'subsidy',
    description: 'Enhances production of rice, wheat and pulses through area expansion.',
  },
];

const filters = ['All', 'Subsidy', 'Insurance', 'Loan'];

const GovernmentSchemes: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = schemes.filter(s => {
    const matchFilter = activeFilter === 'All' || s.type === activeFilter.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                        s.category.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="gs-root">
      {/* Hero */}
      <div className="gs-hero" style={{ backgroundImage: `url(${farmBg})` }}>
        <div className="gs-hero-overlay" />
        <div className="gs-hero-content">
          <nav className="gs-breadcrumb">
            <span className="gs-bc-link" onClick={() => navigate('/')}>Home</span>
            <span className="gs-bc-sep">|</span>
            <span className="gs-bc-current">Government Schemes</span>
            <span className="gs-bc-sep">›</span>
          </nav>
          <h1>Government Schemes</h1>
          <p>Stay informed about agricultural subsidies, grants and support programs</p>

          <div className="gs-search-bar">
            <input
              type="text"
              placeholder="Search by keyword or category"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button>Search</button>
          </div>

          <div className="gs-filters">
            {filters.map(f => (
              <button
                key={f}
                className={`gs-filter-btn ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f === 'Subsidy' && '🌿 '}
                {f === 'Insurance' && '✅ '}
                {f === 'Loan' && '+ '}
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Schemes List */}
      <div className="gs-body">
        <div className="gs-list">
          {filtered.map((s, i) => (
            <div className="gs-card" key={i}>
              <div className="gs-card-left">
                <div className="gs-card-icon">{s.icon}</div>
                <div className="gs-card-info">
                  <h3>{s.name}</h3>
                  <span className="gs-category">{s.category}</span>
                  <p>{s.description}</p>
                </div>
              </div>
              <button className="gs-apply-btn">Apply</button>
            </div>
          ))}
        </div>

        <div className="gs-read-all">
          <button className="gs-read-btn">Read All Schemes ›</button>
        </div>
      </div>
    </div>
  );
};

export default GovernmentSchemes;