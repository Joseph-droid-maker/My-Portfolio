import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'; // NEW: useState for open/close, useEffect to close on route change
import './css/Nav.css';

export default function Nav() {
  const { pathname } = useLocation();
  const base = pathname === '/' ? 'home'
    : pathname.startsWith('/projects') ? 'projects'
    : pathname.slice(1);

  const [menuOpen, setMenuOpen] = useState(false); // NEW: tracks whether the mobile menu is open or closed

  // NEW: close the menu automatically whenever the user navigates to a different page
  // without this, the menu stays open after clicking a link
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // NEW: close the menu if the user resizes the window back above 740px
  // prevents the menu from being "stuck open" on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 740) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize); // NEW: cleanup on unmount
  }, []);

  const links = [
    { to: '/',         label: 'Home',     key: 'home' },
    { to: '/projects', label: 'Projects', key: 'projects' },
    { to: '/about',    label: 'About',    key: 'about' },
    { to: '/contact',  label: 'Contact',  key: 'contact' },
  ];

  return (
    <>
      <nav className="nav">
        <Link to="/" className="nav-logo">
          <img src="/My-Portfolio.png" alt="Logo" className="nav-logo-img" />
          <span className="nav-logo-sep">My </span>
          <span className="nav-logo-sub">Portfolio</span>
        </Link>

        {/* NEW: desktop link row — hidden below 740px via CSS */}
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

        {/* NEW: hamburger button — only visible below 740px via CSS */}
        {/* aria-label gives screen readers a meaningful description */}
        {/* aria-expanded tells screen readers whether the menu is open */}
        <button
          className={`hamburger ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen(prev => !prev)} // NEW: toggle open/closed on each click
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {/* NEW: three spans = the three bars of the hamburger icon */}
          {/* CSS animates them into an X when .is-open is added */}
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* NEW: mobile dropdown menu — sits below the nav bar */}
      {/* rendered outside <nav> so it doesn't affect the nav's fixed height */}
      {/* the .is-open class triggers the slide-down animation in CSS */}
      <div className={`mobile-menu ${menuOpen ? 'is-open' : ''}`}>
        {links.map(({ to, label, key }) => (
          <Link
            key={key}
            to={to}
            className={`mobile-link ${base === key ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)} // NEW: clicking a link closes the menu
          >
            {label}
          </Link>
        ))}
        {/* NEW: Hire Me CTA gets its own styled row at the bottom of the mobile menu */}
        <Link
          to="/contact"
          className="mobile-cta"
          onClick={() => setMenuOpen(false)}
        >
          Hire Me →
        </Link>
      </div>

      {/* NEW: dark overlay behind the open menu */}
      {/* clicking it closes the menu — same UX as most mobile navs */}
      {menuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}