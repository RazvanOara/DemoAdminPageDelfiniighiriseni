import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
// DELETED: import { API_BASE_URL } from '../../utils/config';
import './AdminLayout.css';


const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const hamburgerRef = useRef(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target) &&
        mobileMenuOpen
      ) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [mobileMenuOpen]);

  // SIMPLIFIED: Remove API call, just show alert
  const handleLogout = () => {
    if (window.confirm('Aceasta este o versiune demo. Logout-ul nu este funcțional.')) {
      // In demo mode, just reload the page
      window.location.reload();
    }
  };

  const handleNavigation = (path) => {
    setMobileMenuOpen(false);
  };

  // Get page title based on current route
  const getPageTitle = () => {
    switch(location.pathname) {
      case '/admin': 
        return 'Dashboard Admin';
      case '/admin/traininghub/sessionManager': 
        return 'Sesiune de antrenament';
      case '/admin/users': 
        return 'Gestiune Cursanți';
      case '/admin/traininghub': 
        return 'Centru de Antrenament';
      case '/admin/advanced-swimmers': 
        return 'Înotători Avansați';
      case '/admin/groups':
        return 'Gestionare Grupuri';
      case '/admin/consimtamant': 
        return 'Consimțământ GDPR';
      case '/admin/system': 
        return 'Informații Sistem';
      case '/admin/announcements': 
        return 'Evenimente';
      default: 
        if (location.pathname.startsWith('/admin/traininghub')) {
          return 'Centru de Antrenament';
        }
        return 'Admin Panel';
    }
  };

  return (
    <div className="admin-layout">
      {/* Mobile Header */}
      <div className="mobile-admin-header">
        <div className="mobile-admin-header-content">
          <h1 className="mobile-admin-title">{getPageTitle()}</h1>
          <button 
            ref={hamburgerRef}
            className="mobile-admin-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
        </div>
        
        {/* Mobile Navigation Menu */}
        <div 
          ref={mobileMenuRef}
          className={`mobile-admin-menu ${mobileMenuOpen ? 'active' : ''}`}
        >

<Link 
  to="/admin/about-demo" 
  className={`mobile-nav-link about-demo-link ${location.pathname === '/admin/about-demo' ? 'active' : ''}`}
  onClick={() => handleNavigation('/admin/about-demo')}
>
  ℹ️ Despre Demo
</Link>


          <div className="mobile-nav-links">
            <Link 
              to="/admin" 
              className={`mobile-nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
              onClick={() => handleNavigation('/admin')}  
            >
              📊 Dashboard
            </Link>
            <Link 
              to="/admin/users" 
              className={`mobile-nav-link ${location.pathname === '/admin/users' ? 'active' : ''}`}
              onClick={() => handleNavigation('/admin/users')}
            >
              👥 Cursanți
            </Link>
            <Link 
              to="/admin/traininghub/sessionManager"
              className={`mobile-nav-link ${location.pathname === '/admin/traininghub/sessionManager' ? 'active' : ''}`}
              onClick={() => handleNavigation('/admin/traininghub/sessionManager')}
            >
              📅 Sesiune de antrenament
            </Link>
            <Link 
              to="/admin/traininghub"
              className={`mobile-nav-link ${location.pathname === '/admin/traininghub' ? 'active' : ''}`}
              onClick={() => handleNavigation('/admin/traininghub')}
            >
              📅 Centru Antrenament
            </Link>
            <Link 
              to="/admin/advanced-swimmers" 
              className={`mobile-nav-link ${location.pathname === '/admin/advanced-swimmers' ? 'active' : ''}`}
              onClick={() => handleNavigation('/admin/advanced-swimmers')}
            >
              🏊‍♂️ Înotători Avansați
            </Link>
            <Link 
              to="/admin/groups" 
              className={`mobile-nav-link ${location.pathname === '/admin/groups' ? 'active' : ''}`}
              onClick={() => handleNavigation('/admin/groups')}
            >
              👥 Grupuri
            </Link>
            <Link 
              to="/admin/announcements" 
              className={`mobile-nav-link ${location.pathname === '/admin/announcements' ? 'active' : ''}`}
              onClick={() => handleNavigation('/admin/announcements')}
            >
              📢 Evenimente
            </Link>
            <Link 
              to="/admin/consimtamant" 
              className={`mobile-nav-link ${location.pathname === '/admin/consimtamant' ? 'active' : ''}`}
              onClick={() => handleNavigation('/admin/consimtamant')}
            >
              📜 Consimțământ GDPR
            </Link>
            <Link 
              to="/admin/system" 
              className={`mobile-nav-link ${location.pathname === '/admin/system' ? 'active' : ''}`}
              onClick={() => handleNavigation('/admin/system')}
            >
              ⚙️ Sistem
            </Link>
          </div>
          
          <button 
            className="mobile-logout-btn" 
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
          >
            🚪 Logout (Demo)
          </button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="admin-nav">
        <div className="admin-nav-header">
          <h2>Admin Panel (Demo)</h2>
        </div>
        <ul className="admin-nav-menu">

        <li>
  <Link 
    to="/admin/about-demo" 
    className={`about-demo-link ${location.pathname === '/admin/about-demo' ? 'active' : ''}`}
  >
    ℹ️ Despre Demo
  </Link>
</li>

          <li>
            <Link 
              to="/admin" 
              className={location.pathname === '/admin' ? 'active' : ''}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/users" 
              className={location.pathname === '/admin/users' ? 'active' : ''}
            >
              Cursanți
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/traininghub/sessionManager"
              className={location.pathname === '/admin/traininghub/sessionManager' ? 'active' : ''}
            >
              Sesiune de antrenament
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/traininghub"
              className={location.pathname === '/admin/traininghub' ? 'active' : ''}
            >
              Centru de Antrenament
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/advanced-swimmers" 
              className={location.pathname === '/admin/advanced-swimmers' ? 'active' : ''}
            >
              Înotători Avansați
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/groups" 
              className={location.pathname === '/admin/groups' ? 'active' : ''}
            >
              Grupuri
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/announcements" 
              className={location.pathname === '/admin/announcements' ? 'active' : ''}
            >
              Evenimente
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/consimtamant" 
              className={location.pathname === '/admin/consimtamant' ? 'active' : ''}
            >
              Consimțământ GDPR
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/system" 
              className={location.pathname === '/admin/system' ? 'active' : ''}
            >
              Informații Sistem
            </Link>
          </li>
        </ul>
        <div className="admin-nav-footer">
          <button className="logout-btn" onClick={handleLogout}>
            Logout (Demo)
          </button>
        </div>
      </nav>
      
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;