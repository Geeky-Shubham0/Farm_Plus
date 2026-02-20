import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './KnowledgeHub.css';
import farmBg from '../assets/farm-bg.jpeg';

const articles = [
  {
    category: 'Soil Health',
    icon: '🌱',
    title: 'How to Improve Soil Fertility Naturally',
    desc: 'Learn organic methods to enhance your soil quality and boost crop yield without chemicals.',
    time: '5 min read',
    type: 'article',
  },
  {
    category: 'Crop Guide',
    icon: '🌾',
    title: 'Best Practices for Wheat Cultivation',
    desc: 'A complete guide to sowing, irrigation and harvesting wheat for maximum productivity.',
    time: '8 min read',
    type: 'article',
  },
  {
    category: 'Livestock',
    icon: '🐄',
    title: 'Preventive Care for Dairy Cattle',
    desc: 'Essential vaccinations, nutrition tips and health checkups to keep your cattle healthy.',
    time: '6 min read',
    type: 'article',
  },
  {
    category: 'Weather',
    icon: '🌦️',
    title: 'Understanding Monsoon Patterns for Farming',
    desc: 'How to plan your crop calendar around monsoon forecasts for better yield.',
    time: '4 min read',
    type: 'article',
  },
  {
    category: 'Technology',
    icon: '🤖',
    title: 'AI Tools Every Modern Farmer Should Know',
    desc: 'Explore how artificial intelligence is transforming agriculture and crop management.',
    time: '7 min read',
    type: 'article',
  },
  {
    category: 'Finance',
    icon: '💰',
    title: 'How to Apply for Kisan Credit Card',
    desc: 'Step-by-step process to get a Kisan Credit Card and manage your farm finances.',
    time: '5 min read',
    type: 'article',
  },
];

const videos = [
  { icon: '▶️', title: 'Organic Farming Basics', duration: '12:30', category: 'Farming' },
  { icon: '▶️', title: 'Drip Irrigation Setup Guide', duration: '18:45', category: 'Irrigation' },
  { icon: '▶️', title: 'Pesticide Safety Tips', duration: '9:20', category: 'Safety' },
  { icon: '▶️', title: 'Soil Testing at Home', duration: '14:10', category: 'Soil Health' },
];

const tips = [
  { icon: '💡', tip: 'Water crops early morning to reduce evaporation.' },
  { icon: '💡', tip: 'Rotate crops every season to maintain soil nutrients.' },
  { icon: '💡', tip: 'Use neem-based pesticides for organic pest control.' },
  { icon: '💡', tip: 'Test soil pH before selecting crops for the season.' },
];

const tabs = ['All', 'Articles', 'Videos', 'Soil Tips', 'Farm Updates'];

const KnowledgeHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredArticles = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="kh-root">
      {/* Hero */}
      <div className="kh-hero" style={{ backgroundImage: `url(${farmBg})` }}>
        <div className="kh-hero-overlay" />
        <div className="kh-hero-content">
          <nav className="kh-breadcrumb">
            <span className="kh-bc-link" onClick={() => navigate('/')}>Home</span>
            <span className="kh-bc-sep">|</span>
            <span className="kh-bc-current">Knowledge Hub</span>
          </nav>
          <h1>Knowledge Hub</h1>
          <p>Your go-to resource for farming guides, videos, soil tips and expert advice</p>

          <div className="kh-search-bar">
            <input
              type="text"
              placeholder="Search articles, videos, tips..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button>Search</button>
          </div>

          {/* Tabs */}
          <div className="kh-tabs">
            {tabs.map(t => (
              <button
                key={t}
                className={`kh-tab-btn ${activeTab === t ? 'active' : ''}`}
                onClick={() => setActiveTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="kh-body">

        {/* Articles */}
        {(activeTab === 'All' || activeTab === 'Articles') && (
          <div className="kh-section">
            <div className="kh-section-header">
              <h2>📰 Latest Articles</h2>
              <button className="kh-see-all">See All ›</button>
            </div>
            <div className="kh-articles-grid">
              {filteredArticles.map((a, i) => (
                <div className="kh-article-card" key={i}>
                  <div className="kh-article-top">
                    <span className="kh-article-icon">{a.icon}</span>
                    <span className="kh-article-category">{a.category}</span>
                  </div>
                  <h3>{a.title}</h3>
                  <p>{a.desc}</p>
                  <div className="kh-article-footer">
                    <span className="kh-read-time">🕐 {a.time}</span>
                    <button className="kh-read-btn">Read More →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Videos */}
        {(activeTab === 'All' || activeTab === 'Videos') && (
          <div className="kh-section">
            <div className="kh-section-header">
              <h2>▶️ Video Guides</h2>
              <button className="kh-see-all">See All ›</button>
            </div>
            <div className="kh-videos-grid">
              {videos.map((v, i) => (
                <div className="kh-video-card" key={i}>
                  <div className="kh-video-thumb">
                    <div className="kh-play-btn">▶</div>
                  </div>
                  <div className="kh-video-info">
                    <span className="kh-video-category">{v.category}</span>
                    <h4>{v.title}</h4>
                    <span className="kh-duration">⏱ {v.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two column: Soil Tips + Farm Updates */}
        <div className="kh-bottom-row">
          {(activeTab === 'All' || activeTab === 'Soil Tips') && (
            <div className="kh-section kh-tips-section">
              <div className="kh-section-header">
                <h2>🌱 Soil Health Tips</h2>
                <button className="kh-see-all">See All ›</button>
              </div>
              <div className="kh-tips-list">
                {tips.map((t, i) => (
                  <div className="kh-tip-card" key={i}>
                    <span className="kh-tip-icon">{t.icon}</span>
                    <p>{t.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'All' || activeTab === 'Farm Updates') && (
            <div className="kh-section kh-updates-section">
              <div className="kh-section-header">
                <h2>🚜 Farm Updates</h2>
                <button className="kh-see-all">See All ›</button>
              </div>
              <div className="kh-updates-list">
                {[
                  { date: 'Feb 20', title: 'MSP for Rabi crops increased by 5%', tag: 'Policy' },
                  { date: 'Feb 18', title: 'New drought-resistant wheat variety released', tag: 'Research' },
                  { date: 'Feb 15', title: 'Kharif sowing season begins next month', tag: 'Calendar' },
                  { date: 'Feb 12', title: 'Subsidy for solar pumps extended till March', tag: 'Subsidy' },
                ].map((u, i) => (
                  <div className="kh-update-card" key={i}>
                    <div className="kh-update-date">{u.date}</div>
                    <div className="kh-update-info">
                      <h4>{u.title}</h4>
                      <span className="kh-update-tag">{u.tag}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default KnowledgeHubPage;