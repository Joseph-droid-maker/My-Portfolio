import { useParams, useNavigate, Link } from 'react-router-dom';
import { projects } from '../data/projects';
import './css/ProjectDetail.css';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="page">
        <div className="container">
          <div className="detail-notfound">
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p>Project not found.</p>
            <button className="btn-ghost" onClick={() => navigate('/projects')}>← Back to Projects</button>
          </div>
        </div>
      </div>
    );
  }

  const p = project;

  return (
    <div className="page">
      <div className="container">

        <button className="back-btn" onClick={() => navigate('/projects')}>
          ← Back to Projects
        </button>

        {/* Header */}
        <div className="detail-header">
          <div className="section-label">{p.year}</div>
          <h1 className="detail-title">{p.title}</h1>
          <div className="tech-tags">
            {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        </div>

        {/* Hero Banner */}
        <div className="detail-hero" style={{ background: p.bannerGrad }}>
          <span className="detail-hero-emoji">{p.emoji}</span>
        </div>

        {/* Main content + Sidebar */}
        <div className="detail-grid">
          <div className="detail-card">
            <div className="detail-card-title">Overview</div>
            {p.description.map((d, i) => (
              <p key={i} className="detail-para">{d}</p>
            ))}
          </div>

          <div className="detail-card">
            <div className="detail-card-title">Tech Stack</div>
            <div className="stack-list">
              {p.stack.map(s => (
                <div key={s} className="stack-item">
                  <div className="stack-dot" />
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="detail-card" style={{ marginBottom: 24 }}>
          <div className="detail-card-title">Features & Functionality</div>
          <ul className="feature-list">
            {p.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="detail-actions">
          {p.liveLink ? (
            <Link to={p.liveLink} state={{ fromProjectId: p.id }} className="btn-primary">🚀 Live Demo </Link>
          ) : p.demo ? (
            <a href={`${p.demo}?from=${p.id}`} target="_blank" rel="noreferrer" className="btn-primary"> 🚀 Live Demo </a>
          ) : (
            <button className="btn-ghost disabled" disabled>Live Demo (N/A)</button>
          )}

          <a
            href={p.github}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
          >
            ⌥ GitHub Repository
          </a>
        </div>

      </div>
    </div>
  );
}