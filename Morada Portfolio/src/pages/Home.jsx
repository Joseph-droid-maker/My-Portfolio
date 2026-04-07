import { useNavigate } from 'react-router-dom';
import './css/Home.css';

const SKILLS = ['C#', 'Python', 'SQL', 'Java', 'C/C++', 'JavaScript', 'React', 'Linux', 'scikit-learn', 'GeoPandas'];

const HIGHLIGHTS = [
  { icon: '🤖', title: 'Machine Learning', text: 'Built a Random Forest classifier with 95% accuracy on real geospatial data across 1,606 Philippine municipalities.' },
  { icon: '🗄️', title: 'Systems Development', text: 'Developed a full-stack POS and inventory management system with role-based access control and automated reporting.' },
  { icon: '🌐', title: 'Web Development', text: 'Building interactive React applications that integrate ML models and real-world datasets for meaningful outcomes.' },
  { icon: '📊', title: 'Data Engineering', text: 'Experienced in spatial data processing with GeoPandas, integrating multi-source datasets from NASA, PSA, and DOST-NOAH.' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="page">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Available for Internship · 2025
            </div>

            <h1 className="hero-name">
              Hello, I'm {' '}
              <span className="hero-accent">Morada</span>
            </h1>

            <p className="hero-title">
              Computer Science Student &nbsp;·&nbsp; Arellano University
            </p>

            <p className="hero-bio">
              I build things that solve real problems — from ML-powered flood risk systems to
              full-featured inventory management tools. Currently seeking an internship to apply
              and grow my skills in software development.
            </p>

            <div className="hero-actions">
              <button className="btn-primary" onClick={() => navigate('/projects')}>
                View Projects →
              </button>
              <button className="btn-ghost" onClick={() => navigate('/about')}>
                About Me
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Skills Strip ── */}
      <div className="skills-strip">
        <div className="container">
          <div className="skills-grid">
            {SKILLS.map(s => (
              <div key={s} className="skill-chip">
                <span className="skill-chip-dot">◆</span>
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Highlights ── */}
      <section className="highlights">
        <div className="container">
          <div className="section-label">What I Do</div>
          <h2 className="section-title">Building with purpose,<br />learning every step.</h2>
          <div className="highlight-grid">
            {HIGHLIGHTS.map(c => (
              <div key={c.title} className="h-card">
                <div className="h-card-icon">{c.icon}</div>
                <div className="h-card-title">{c.title}</div>
                <p className="h-card-text">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}