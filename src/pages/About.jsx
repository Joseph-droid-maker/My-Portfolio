import './css/About.css';


const SKILL_CATS = [
  { label: 'Languages',       items: ['C#', 'Python', 'C/C++', 'SQL', 'Java'] },
  { label: 'Web / Frontend',  items: ['HTML', 'CSS', 'JavaScript', 'React'] },
  { label: 'Tools & OS',      items: ['Linux (Ubuntu)', 'Windows', 'PhpMyAdmin', 'Git'] },
  { label: 'Data / ML',       items: ['scikit-learn', 'GeoPandas', 'Random Forest', 'Pandas'] },
  { label: 'Productivity',    items: ['MS Word', 'MS Excel', 'Canva'] },
  { label: 'Spoken Languages',items: ['English', 'Filipino'] },
];


export default function About() {
  return (
    <div className="page">
      <div className="container">
        <div className="about-layout">

          {/* ── Left: Profile card ── */}
            <div className="about-card">
              <img src="/My-Profile.jpg" alt="Profile" className="avatar" />
              <div className="about-card-name">Morada, Mark Joseph O.</div>
              <div className="about-card-role">CS Student · Internship Seeker</div>

              <div className="divider" />

              <div className="about-links">
                <a href="mailto:josephmorada08@email.com" className="about-link">✉️ josephmorada08@email.com</a>
                <a href=" https://www.linkedin.com/in/markjoseph-morada-7934ab360" target="_blank" rel="noreferrer" className="about-link">🔗 LinkedIn</a>
                <a href="https://github.com/Joseph-droid-maker" target="_blank" rel="noreferrer" className="about-link">⌥ GitHub</a>
                <div className="about-link about-link-loc">📍 Manila, Philippines</div>
                  <a href="/Morada_CV.pdf" download className="cv-download-btn">
                    ⬇ Download CV
                  </a>
              </div>
            </div>
          

          {/* ── Right: Content ── */}
          <div className="about-right">

            {/* Background */}
            <div className="about-section">
              <div className="section-label">About Me</div>
              <h2 className="about-section-title">Background</h2>
              <p className="about-para">
                I'm a Computer Science student at Arellano University, passionate about building
                software that solves real, meaningful problems.
              </p>
              <p className="about-para">
                My work spans machine learning, full-stack systems development, and data
                engineering — from training Random Forest classifiers on geospatial datasets to
                building inventory management systems from the ground up.
              </p>
              <p className="about-para">
                I enjoy the full development cycle: understanding a problem deeply, designing a
                clean solution, and shipping something that actually works.
              </p>
            </div>

            {/* Objective */}
            <div className="about-section">
              <div className="section-label">Career Goal</div>
              <h2 className="about-section-title">Objective</h2>
              <div className="objective-box">
                <p>
                  Seeking a software development or data engineering internship where I can
                  contribute meaningfully, learn from experienced engineers, and grow my
                  technical skills in a real-world environment.
                </p>
              </div>
            </div>

            {/* Education */}
            <div className="about-section">
              <div className="section-label">Education</div>
              <h2 className="about-section-title">Academic Background</h2>

              <div className="edu-item">
                <div>
                  <div className="edu-school">Arellano University – Juan Sumulong Campus</div>
                  <div className="edu-degree">B.S. Computer Science · Manila, Philippines</div>
                </div>
                <div className="edu-year">2023 – Present</div>
              </div>

              <div className="edu-item">
                <div>
                  <div className="edu-school">Dipaculao National High School</div>
                  <div className="edu-degree">Senior High School – STEM Track · Dipaculao, Philippines</div>
                </div>
                <div className="edu-year">2022 – 2023</div>
              </div>
            </div>

            {/* Skills */}
            <div className="about-section">
              <div className="section-label">Skills</div>
              <h2 className="about-section-title">Technical Skills</h2>
              <div className="skills-categories">
                {SKILL_CATS.map(cat => (
                  <div key={cat.label} className="skill-cat">
                    <div className="skill-cat-title">{cat.label}</div>
                    <div className="skill-cat-items">
                      {cat.items.map(i => <span key={i} className="skill-pill">{i}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );

  
}