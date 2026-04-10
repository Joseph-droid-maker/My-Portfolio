import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

// Portfolio pages
import Home          from './pages/Home';
import Projects      from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import About         from './pages/About';
import Contact       from './pages/Contact';

// Shared layout components
import Nav    from './component/Nav';
import Footer from './component/Footer';

// Global styles
import './styles/portfolio.css';

// ── Your existing flood app (renamed from App.jsx → FloodApp.jsx) ──
import FloodApp from './FloodApp';


// Layout wrapper for portfolio pages
function PortfolioLayout() {
  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Flood app lives at /flood — no portfolio nav */}
        <Route path="/flood" element={<FloodApp />} />

        {/* All portfolio pages share the Nav + Footer layout */}
        <Route element={<PortfolioLayout />}>
          <Route path="/"               element={<Home />} />
          <Route path="/projects"       element={<Projects />} />
          <Route path="/projects/:id"   element={<ProjectDetail />} />
          <Route path="/about"          element={<About />} />
          <Route path="/contact"        element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}