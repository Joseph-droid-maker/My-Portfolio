import { Link, useLocation } from 'react-router-dom';
import './css/Nav.css';

export default function Nav() {
  const { pathname } = useLocation();
  const base = pathname === '/' ? 'home'
    : pathname.startsWith('/projects') ? 'projects'
    : pathname.slice(1);

  const links = [
    { to: '/',          label: 'Home',     key: 'home' },
    { to: '/projects',  label: 'Projects', key: 'projects' },
    { to: '/about',     label: 'About',    key: 'about' },
    { to: '/contact',   label: 'Contact',  key: 'contact' },
  ];

  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">
        <span>Morada</span>
        <span className="nav-logo-sep">/</span>
        <span className="nav-logo-sub">Portfolio</span>
      </Link>

      <div className="nav-links">
        {links.map(({ to, label, key }) => (
          <Link
            key={key}
            to={to}
            className={`nav-link${base === key ? ' active' : ''}`}
          >
            {label}
          </Link>
        ))}
        <Link to="/contact" className="nav-cta">Hire Me →</Link>
      </div>
    </nav>
  );
}