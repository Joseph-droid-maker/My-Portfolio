import { useNavigate } from 'react-router-dom';
import { projects } from '../data/projects';
import "./css/Project.css";

export default function Projects() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="container">

        <div className="projects-header">
          <div className="section-label">My Work</div>
          <h1 className="section-title">Projects</h1>
          <p className="projects-sub">
            A collection of projects built with real-world datasets and practical goals.
            More coming soon.
          </p>
        </div>

        <div className="projects-grid">

          {projects.map(p => (
            <div
              key={p.id}
              className="proj-card"
              onClick={() => navigate(`/projects/${p.id}`)}
            >
              <div
                className="proj-card-banner"
                style={{ background: p.bannerGrad }}
              >
                <span className="proj-card-emoji">{p.emoji}</span>
              </div>

              <div className="proj-card-body">
                <div className="proj-card-year">{p.year}</div>
                <h2 className="proj-card-title">{p.title}</h2>
                <p className="proj-card-desc">{p.short}</p>
                <div className="tech-tags" style={{ marginBottom: 16 }}>
                  {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                <button className="proj-card-link">View Project →</button>
              </div>
            </div>
          ))}

          {/* Coming Soon */}
          <div className="proj-card coming-soon">
            <div className="proj-card-banner" style={{ background: 'var(--surface2)' }}>
              <span style={{ fontSize: 44, opacity: 0.25 }}>⏳</span>
            </div>
            <div className="proj-card-body">
              <div className="proj-card-year">Upcoming</div>
              <h2 className="proj-card-title" style={{ color: 'var(--text-dim)' }}>New Project</h2>
              <p className="proj-card-desc" style={{ color: 'var(--text-dim)' }}>
                Currently in development. Stay tuned for updates on the next build.
              </p>
              <div className="tech-tags">
                <span className="tag gray">Coming Soon</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}