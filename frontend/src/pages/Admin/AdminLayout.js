import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const hamburgerRef = useRef(null);

  // Helper function to create language-aware links
  const createLink = (path) => `/${lang || i18n.language || 'ro'}${path}`;

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

  const handleLogout = () => {
    if (window.confirm(t('adminLayout.logout.confirmDemo'))) {
      window.location.reload();
    }
  };

  const handleNavigation = (path) => {
    setMobileMenuOpen(false);
  };

  // Helper function to check if path is active
  const isActive = (path) => {
    const pathParts = location.pathname.split('/').filter(p => p);
    if (pathParts.length > 0 && (pathParts[0] === 'ro' || pathParts[0] === 'en')) {
      pathParts.shift();
    }
    const currentPath = '/' + pathParts.join('/');
    return currentPath === path;
  };

  const getPageTitle = () => {
    const pathParts = location.pathname.split('/').filter(p => p);
    if (pathParts.length > 0 && (pathParts[0] === 'ro' || pathParts[0] === 'en')) {
      pathParts.shift();
    }
    const pathWithoutLang = '/' + pathParts.join('/');
    
    switch(pathWithoutLang) {
      case '/admin': 
        return t('adminLayout.pageTitle.dashboard');
      case '/admin/traininghub/sessionManager': 
        return t('adminLayout.pageTitle.trainingSession');
      case '/admin/users': 
        return t('adminLayout.pageTitle.students');
      case '/admin/traininghub': 
        return t('adminLayout.pageTitle.trainingHub');
      case '/admin/advanced-swimmers': 
        return t('adminLayout.pageTitle.advancedSwimmers');
      case '/admin/groups':
        return t('adminLayout.pageTitle.groups');
      case '/admin/consimtamant': 
        return t('adminLayout.pageTitle.gdprConsent');
      case '/admin/system': 
        return t('adminLayout.pageTitle.systemInfo');
      case '/admin/announcements': 
        return t('adminLayout.pageTitle.announcements');
      case '/admin/about-demo':
        return t('adminLayout.pageTitle.aboutDemo');
      default: 
        if (pathWithoutLang.startsWith('/admin/traininghub')) {
          return t('adminLayout.pageTitle.trainingHub');
        }
        return t('adminLayout.pageTitle.adminPanel');
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
            to={createLink('/admin/about-demo')}
            className={`mobile-nav-link about-demo-link ${isActive('/admin/about-demo') ? 'active' : ''}`}
            onClick={() => handleNavigation('/admin/about-demo')}
          >
            ℹ️ {t('adminLayout.nav.aboutDemo')}
          </Link>

          <div className="mobile-nav-links">
            <Link 
              to={createLink('/admin')}
              className={`mobile-nav-link ${isActive('/admin') ? 'active' : ''}`}
              onClick={() => handleNavigation('/admin')}  
            >
              📊 {t('adminLayout.nav.dashboard')}
            </Link>
            <Link 
              to={createLink('/admin/users')}
              className={`mobile-nav-link ${isActive('/admin/users') ? 'active' : ''}`}
              onClick={() => handleNavigation('/admin/users')}
            >
              👥 {t('adminLayout.nav.students')}
            </Link>
            <Link 
              to={createLink('/admin/traininghub/sessionManager')}
              className={`mobile-nav-link ${isActive('/admin/traininghub/sessionManager') ? 'active' : ''}`}
              onClick={() => handleNavigation('/admin/traininghub/sessionManager')}
            >
              📅 {t('adminLayout.nav.trainingSession')}
            </Link>
            <Link 
              to={createLink('/admin/traininghub')}
              className={`mobile-nav-link ${isActive('/admin/traininghub') ? 'active' : ''}`}
              onClick={() => handleNavigation('/admin/traininghub')}
            >
              📅 {t('adminLayout.nav.trainingHub')}
            </Link>
            <Link 
              to={createLink('/admin/advanced-swimmers')}
              className={`mobile-nav-link ${isActive('/admin/advanced-swimmers') ? 'active' : ''}`}
              onClick={() => handleNavigation('/admin/advanced-swimmers')}
            >
              🏊‍♂️ {t('adminLayout.nav.advancedSwimmers')}
            </Link>
            <Link 
              to={createLink('/admin/groups')}
              className={`mobile-nav-link ${isActive('/admin/groups') ? 'active' : ''}`}
              onClick={() => handleNavigation('/admin/groups')}
            >
              👥 {t('adminLayout.nav.groups')}
            </Link>
            <Link 
              to={createLink('/admin/announcements')}
              className={`mobile-nav-link ${isActive('/admin/announcements') ? 'active' : ''}`}
              onClick={() => handleNavigation('/admin/announcements')}
            >
              📢 {t('adminLayout.nav.announcements')}
            </Link>
            <Link 
              to={createLink('/admin/consimtamant')}
              className={`mobile-nav-link ${isActive('/admin/consimtamant') ? 'active' : ''}`}
              onClick={() => handleNavigation('/admin/consimtamant')}
            >
              📜 {t('adminLayout.nav.gdprConsent')}
            </Link>
            <Link 
              to={createLink('/admin/system')}
              className={`mobile-nav-link ${isActive('/admin/system') ? 'active' : ''}`}
              onClick={() => handleNavigation('/admin/system')}
            >
              ⚙️ {t('adminLayout.nav.system')}
            </Link>
          </div>
          
          <button 
            className="mobile-logout-btn" 
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
          >
            🚪 {t('adminLayout.logout.button')}
          </button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="admin-nav">
        <div className="admin-nav-header">
          <h2>{t('adminLayout.header.title')}</h2>
        </div>
        <ul className="admin-nav-menu">
          <li>
            <Link 
              to={createLink('/admin/about-demo')}
              className={`about-demo-link ${isActive('/admin/about-demo') ? 'active' : ''}`}
            >
              ℹ️ {t('adminLayout.nav.aboutDemo')}
            </Link>
          </li>

          <li>
            <Link 
              to={createLink('/admin')}
              className={isActive('/admin') ? 'active' : ''}
            >
              {t('adminLayout.nav.dashboard')}
            </Link>
          </li>
          <li>
            <Link 
              to={createLink('/admin/users')}
              className={isActive('/admin/users') ? 'active' : ''}
            >
              {t('adminLayout.nav.students')}
            </Link>
          </li>
          <li>
            <Link 
              to={createLink('/admin/traininghub/sessionManager')}
              className={isActive('/admin/traininghub/sessionManager') ? 'active' : ''}
            >
              {t('adminLayout.nav.trainingSession')}
            </Link>
          </li>
          <li>
            <Link 
              to={createLink('/admin/traininghub')}
              className={isActive('/admin/traininghub') ? 'active' : ''}
            >
              {t('adminLayout.nav.trainingHub')}
            </Link>
          </li>
          <li>
            <Link 
              to={createLink('/admin/advanced-swimmers')}
              className={isActive('/admin/advanced-swimmers') ? 'active' : ''}
            >
              {t('adminLayout.nav.advancedSwimmers')}
            </Link>
          </li>
          <li>
            <Link 
              to={createLink('/admin/groups')}
              className={isActive('/admin/groups') ? 'active' : ''}
            >
              {t('adminLayout.nav.groups')}
            </Link>
          </li>
          <li>
            <Link 
              to={createLink('/admin/announcements')}
              className={isActive('/admin/announcements') ? 'active' : ''}
            >
              {t('adminLayout.nav.announcements')}
            </Link>
          </li>
          <li>
            <Link 
              to={createLink('/admin/consimtamant')}
              className={isActive('/admin/consimtamant') ? 'active' : ''}
            >
              {t('adminLayout.nav.gdprConsent')}
            </Link>
          </li>
          <li>
            <Link 
              to={createLink('/admin/system')}
              className={isActive('/admin/system') ? 'active' : ''}
            >
              {t('adminLayout.nav.systemInfo')}
            </Link>
          </li>
        </ul>
        <div className="admin-nav-footer">
          <button className="logout-btn" onClick={handleLogout}>
            {t('adminLayout.logout.button')}
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