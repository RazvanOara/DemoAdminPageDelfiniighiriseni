

//TODO fix cardBar main button being non visible in the mobile, after presses
// 
// // CardNav.jsx - Updated with correct navigation links
import React, { useLayoutEffect, useRef, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import './CardNav.css';

const CardNav = () => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);
  const navigate = useNavigate();

  // Updated navigation items with correct links
  const items = [
    {
      label: "Cursuri",
      bgColor: "rgba(0, 212, 255, 0.1)",
      textColor: "#ffffff",
      links: [
        { label: "Înscrie-te Acum", href: "/inscriere", ariaLabel: "Înscrie-te la cursuri" },
        { label: "Program Detaliat", href: "/contact#location", ariaLabel: "Vezi programul cursurilor" },
        { label: "Anunțuri", href: "/evenimente", ariaLabel: "Vezi anunțurile" }
      ]
    },
    {
      label: "Despre Noi", 
      bgColor: "rgba(0, 153, 204, 0.1)",
      textColor: "#ffffff",
      links: [
        { label: "Echipa Noastră", href: "/contact#instructors", ariaLabel: "Cunoaște echipa noastră" },
        { label: "Facilități", href: "/contact#facilities", ariaLabel: "Bazinul și facilitățile" },
        { label: "Galerie Foto", href: "/galerie", ariaLabel: "Vezi galeria foto" }
      ]
    },
    {
      label: "Contact",
      bgColor: "rgba(0, 255, 255, 0.1)", 
      textColor: "#ffffff",
      links: [
        { label: "Instructori", href: "/contact#instructors", ariaLabel: "Cunoaște instructorii" },
        { label: "Programări", href: "/contact#contact-methods", ariaLabel: "Modalități de contact și programări" },
        { label: "Locație", href: "/contact#location", ariaLabel: "Unde ne găsești" }
      ]
    }
  ];

  const calculateHeight = useCallback(() => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const contentEl = navEl.querySelector('.card-nav-content');
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = 'visible';
        contentEl.style.pointerEvents = 'auto';
        contentEl.style.position = 'static';
        contentEl.style.height = 'auto';

        // Force reflow
        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  }, []);

  const createTimeline = useCallback(() => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease: 'power3.out'
    });

    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.08 }, '-=0.1');

    return tl;
  }, [calculateHeight]);

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      if (tl) {
        tl.kill();
      }
      tlRef.current = null;
    };
  }, [createTimeline]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isExpanded, calculateHeight, createTimeline]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = (i) => (el) => {
    if (el) cardsRef.current[i] = el;
  };

  const handleCTAClick = () => {
    navigate('/inscriere');
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    if (isExpanded) {
      toggleMenu();
    }
  };

  const handleLinkClick = (href) => {
    if (href.startsWith('/')) {
      if (href.includes('#')) {
        // Handle hash navigation
        const [path, hash] = href.split('#');
        navigate(path);
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      } else {
        navigate(href);
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
      }
    }
    if (isExpanded) {
      toggleMenu();
    }
  };

  return (
    <div className="card-nav-container">
      <nav ref={navRef} className={`card-nav ${isExpanded ? 'open' : ''}`}>
        <div className="card-nav-top">
          <div
            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? 'Close menu' : 'Open menu'}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
              }
            }}
          >
            <div className="hamburger-line" />
            <div className="hamburger-line" />
          </div>

          <Link to="/" className="logo-container">
            <span className="logo-text">🏊‍♀️ Delfinii Ghirișeni</span>
          </Link>

          <button
            type="button"
            className="card-nav-cta-button"
            onClick={handleCTAClick}
          >
            Înscrie-te
          </button>
        </div>

        <div className="card-nav-content" aria-hidden={!isExpanded}>
          {items.slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label">{item.label}</div>
              <div className="nav-card-links">
                {item.links?.map((lnk, i) => {
                  if (lnk.href.startsWith('/')) {
                    return (
                      <button
                        key={`${lnk.label}-${i}`}
                        type="button"
                        className="nav-card-link"
                        onClick={() => handleLinkClick(lnk.href)}
                        aria-label={lnk.ariaLabel}
                      >
                        <span className="nav-card-link-icon">→</span>
                        {lnk.label}
                      </button>
                    );
                  }
                  return (
                    <a 
                      key={`${lnk.label}-${i}`} 
                      className="nav-card-link" 
                      href={lnk.href}
                      aria-label={lnk.ariaLabel}
                    >
                      <span className="nav-card-link-icon">→</span>
                      {lnk.label}
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;