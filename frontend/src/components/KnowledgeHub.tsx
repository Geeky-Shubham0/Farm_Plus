import './KnowledgeHub.css';

const KnowledgeHub = () => {
  return (
    <section className="knowledge-section">
      <div className="knowledge-header">
        <h2>Knowledge Hub for Farmers</h2>
        <button className="browse-btn">Browse More</button>
      </div>

      <div className="knowledge-grid">
        <div className="knowledge-card">
          <span className="k-icon">▶️</span>
          <span className="k-label">Video Guide</span>
          <span className="k-arrow">›</span>
        </div>
        <div className="knowledge-card">
          <span className="k-icon">📰</span>
          <span className="k-label">Latest Articles</span>
          <span className="k-arrow">›</span>
        </div>
        <div className="knowledge-card">
          <span className="k-icon">🌱</span>
          <span className="k-label">Soil Health Tips</span>
          <span className="k-arrow">›</span>
        </div>
        <div className="knowledge-card">
          <span className="k-icon">🚜</span>
          <span className="k-label">Farm Updates</span>
          <span className="k-arrow">›</span>
        </div>
      </div>
    </section>
  );
};

export default KnowledgeHub;