import { useEffect, useRef, useState, useCallback } from 'react';
import './css/Carousel.css'; // NEW: dedicated stylesheet for the carousel

// NEW: your 5 project cards — edit title/desc/tags/link to match your real projects
const PROJECTS = [
  {
    id: 1,
    title: 'Flood Risk Classifier',
    desc: 'Random Forest model predicting flood risk across 1,606 Philippine municipalities using NASA, PSA, and DOST-NOAH datasets.',
    tags: ['Python', 'scikit-learn', 'GeoPandas'],
    link: '/projects',
  },
  {
    id: 2,
    title: 'POS & Inventory System',
    desc: 'Full-stack point-of-sale system with role-based access control, automated reporting, and real-time inventory tracking.',
    tags: ['C#', 'SQL', 'WinForms'],
    link: '/projects',
  },
  {
    id: 3,
    title: 'React ML Dashboard',
    desc: 'Interactive web dashboard that integrates a trained ML model and visualises geospatial predictions in the browser.',
    tags: ['React', 'JavaScript', 'Python'],
    link: '/projects',
  },
  {
    id: 4,
    title: 'Spatial Data Pipeline',
    desc: 'ETL pipeline that ingests, cleans, and joins multi-source spatial datasets into a single analysis-ready GeoDataFrame.',
    tags: ['Python', 'GeoPandas', 'Pandas'],
    link: '/projects',
  },
  {
    id: 5,
    title: 'Algorithm Visualiser',
    desc: 'Browser-based tool that animates sorting and pathfinding algorithms step-by-step to support learning.',
    tags: ['JavaScript', 'React', 'CSS'],
    link: '/projects',
  },
];

// NEW: how many real cards exist — used throughout to keep index math clean
const TOTAL = PROJECTS.length;

// NEW: auto-advance interval in milliseconds
const AUTOPLAY_MS = 3000;

export default function Carousel() {
  // NEW: "real" index tracks which actual project card is in focus (0-based, 0..TOTAL-1)
  const [realIdx, setRealIdx] = useState(0);

  // NEW: "visual" index includes the cloned cards offset
  // The track actually holds: [clone-of-last, card0, card1, card2, card3, card4, clone-of-first]
  // So the visual positions are 1..TOTAL (real cards) with 0 and TOTAL+1 being clones
  // We start at visual position 1 (= real index 0)
  const [visualIdx, setVisualIdx] = useState(1);

  // NEW: controls whether CSS transition is active
  // We turn it OFF when we jump from a clone back to the real card (instant repositioning)
  const [animated, setAnimated] = useState(true);

  const trackRef    = useRef(null); // NEW: ref to the scrolling <div> so we can read its state
  const autoplayRef = useRef(null); // NEW: ref to the autoplay interval so we can clear it

  // NEW: moves the carousel forward by one real position
  // useCallback so it doesn't recreate on every render (needed for the useEffect dep array)
  const goNext = useCallback(() => {
    setVisualIdx(v => v + 1); // NEW: advance the visual position by 1
    setAnimated(true);         // NEW: ensure the CSS transition is on for this move
    setRealIdx(r => (r + 1) % TOTAL); // NEW: wrap real index around using modulo
  }, []);

  // NEW: moves the carousel backward by one real position
  const goPrev = useCallback(() => {
    setVisualIdx(v => v - 1); // NEW: retreat the visual position by 1
    setAnimated(true);
    setRealIdx(r => (r - 1 + TOTAL) % TOTAL); // NEW: +TOTAL before modulo prevents negative values
  }, []);

  // NEW: dot button clicked — jump directly to a specific real card
  const goTo = useCallback((idx) => {
    setRealIdx(idx);
    setVisualIdx(idx + 1); // NEW: +1 because visual slot 0 is the clone-of-last
    setAnimated(true);
    resetAutoplay();        // NEW: restart autoplay timer so it doesn't fire immediately after click
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // NEW: starts (or restarts) the autoplay interval
  // Declared before the useEffect that calls it
  const resetAutoplay = useCallback(() => {
    clearInterval(autoplayRef.current);            // NEW: kill any existing interval first
    autoplayRef.current = setInterval(goNext, AUTOPLAY_MS); // NEW: set a fresh interval
  }, [goNext]);

  // NEW: kick off autoplay on mount and clean up on unmount
  useEffect(() => {
    resetAutoplay();
    return () => clearInterval(autoplayRef.current); // NEW: prevent interval leaking after unmount
  }, [resetAutoplay]);

  // NEW: this is the infinite-loop trick
  // When a CSS transition ends, we check if we landed on a clone
  // If we did, we silently jump (no animation) to the matching real card
  const handleTransitionEnd = useCallback(() => {
    if (visualIdx === 0) {
      // NEW: we slid left past card 0 into the clone-of-last — jump to the real last card
      setAnimated(false);
      setVisualIdx(TOTAL); // NEW: TOTAL = last real card's visual position
    } else if (visualIdx === TOTAL + 1) {
      // NEW: we slid right past the last card into the clone-of-first — jump to real first card
      setAnimated(false);
      setVisualIdx(1);
    }
  }, [visualIdx]);

  // NEW: build the full slide list including the two clones
  // clone-of-last goes at the front; clone-of-first goes at the back
  // This is what makes the loop feel seamless — you never see a hard reset
  const slides = [
    PROJECTS[TOTAL - 1],  // NEW: clone of the last card placed at position 0
    ...PROJECTS,           // NEW: all real cards at positions 1..TOTAL
    PROJECTS[0],           // NEW: clone of the first card placed at position TOTAL+1
  ];

  return (
    <div className="carousel-root">

      {/* NEW: the outer viewport — overflow:hidden clips the off-screen cards */}
      {/* padding on the sides lets the adjacent cards peek in */}
      <div className="carousel-viewport">

        {/* NEW: the sliding track — translateX moves it left/right to show different cards */}
        {/* width is (number of slides * card width + gaps) — handled in CSS with flex */}
        <div
          ref={trackRef}
          className="carousel-track"
          style={{
            // NEW: each card slot is 100% of the visible area wide (CSS variable --card-w handles the math)
            // visualIdx * the slot width positions the correct card at center
            transform: `translateX(calc(-${visualIdx} * var(--carousel-slot-w)))`,
            // NEW: toggle the transition class so we can turn animation off for the clone-jump
            transition: animated ? 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          }}
          onTransitionEnd={handleTransitionEnd} // NEW: fires after every slide animation completes
        >
          {slides.map((project, i) => {
            // NEW: determine if this slot is the active (focused) card
            // visual slot i is active when i === visualIdx
            const isActive = i === visualIdx;

            return (
              // NEW: each slide slot — gets a data attribute so CSS can style active vs inactive
              <div
                key={`${project.id}-${i}`} // NEW: unique key; includes i because clones share project.id
                className={`carousel-slide ${isActive ? 'is-active' : ''}`}
              >
                {/* NEW: the visible card inside the slot */}
                <div className="c-card">
                  <div className="c-card-header">
                    {/* NEW: small index label, e.g. "01 / 05" — helps orientation */}
                    <span className="c-card-count">
                      {String(((i - 1 + TOTAL) % TOTAL) + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
                    </span>
                    <h3 className="c-card-title">{project.title}</h3>
                  </div>

                  <p className="c-card-desc">{project.desc}</p>

                  {/* NEW: tech stack tags row */}
                  <div className="c-card-tags">
                    {project.tags.map(tag => (
                      <span key={tag} className="c-tag">{tag}</span>
                    ))}
                  </div>

                  {/* NEW: link only active on the focused card so inactive cards don't accidentally get clicked */}
                  {isActive && (
                    <a href={project.link} className="c-card-link">
                      View project →
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NEW: controls row — prev button, dot indicators, next button */}
      <div className="carousel-controls">

        {/* NEW: prev arrow button — calls goPrev and also resets the autoplay timer */}
        <button
          className="carousel-btn"
          onClick={() => { goPrev(); resetAutoplay(); }}
          aria-label="Previous project"
        >
          ← {/* NEW: plain text arrow so no icon library needed */}
        </button>

        {/* NEW: one dot per real card — filled dot = active card */}
        <div className="carousel-dots">
          {PROJECTS.map((_, idx) => (
            <button
              key={idx}
              className={`carousel-dot ${idx === realIdx ? 'is-active' : ''}`}
              onClick={() => goTo(idx)}   // NEW: clicking a dot jumps directly to that card
              aria-label={`Go to project ${idx + 1}`}
            />
          ))}
        </div>

        {/* NEW: next arrow button */}
        <button
          className="carousel-btn"
          onClick={() => { goNext(); resetAutoplay(); }}
          aria-label="Next project"
        >
          →
        </button>

      </div>
    </div>
  );
}