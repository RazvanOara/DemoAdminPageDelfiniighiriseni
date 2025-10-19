import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const mockData = [
  {
    cursant: {
      numeComplet: 'Popescu Andrei',
      dataInregistrarii: '2025-09-15T10:30:00',
      expired: false
    }
  },
  {
    cursant: {
      numeComplet: 'Ionescu Maria',
      dataInregistrarii: '2025-09-20T14:45:00',
      expired: false
    }
  },
  {
    cursant: {
      numeComplet: 'Georgescu Alex',
      dataInregistrarii: '2025-09-01T09:00:00',
      expired: false
    }
  },
  {
    cursant: {
      numeComplet: 'Marinescu Elena',
      dataInregistrarii: '2025-09-25T16:20:00',
      expired: false
    }
  },
  {
    cursant: {
      numeComplet: 'Dumitrescu Radu',
      dataInregistrarii: '2025-07-10T11:15:00',
      expired: true
    }
  },
  {
    cursant: {
      numeComplet: 'Constantin Ana',
      dataInregistrarii: '2025-09-28T08:30:00',
      expired: false
    }
  },
  {
    cursant: {
      numeComplet: 'Stanescu Mihai',
      dataInregistrarii: '2025-09-30T13:00:00',
      expired: false
    }
  },
  {
    cursant: {
      numeComplet: 'Vasilescu Ioana',
      dataInregistrarii: '2025-06-15T10:00:00',
      expired: true
    }
  }
];

const AdminDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    expiredUsers: 0,
    expiringUsers: [],
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const data = mockData;

      const totalUsers = data.length;
      const activeUsers = data.filter(i => !i.cursant.expired).length;
      const expiredUsers = data.filter(i => i.cursant.expired).length;
      
      const now = new Date();
      const expiringUsers = data.filter(i => {
        if (i.cursant.expired) return false;
        const regDate = new Date(i.cursant.dataInregistrarii);
        const expiryDate = new Date(regDate.getTime() + 45 * 24 * 60 * 60 * 1000);
        const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
      });

      const recentUsers = data
        .sort((a, b) => new Date(b.cursant.dataInregistrarii) - new Date(a.cursant.dataInregistrarii))
        .slice(0, 5);

      setStats({
        totalUsers,
        activeUsers,
        expiredUsers,
        expiringUsers,
        recentUsers
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const QuickNavCard = ({ title, icon, value, subtitle, color, onClick }) => (
    <div 
      className="quick-nav-card"
      style={{ '--card-color': color }}
      onClick={onClick}
    >
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <div className="card-value">{value}</div>
        <div className="card-title">{title}</div>
        {subtitle && <div className="card-subtitle">{subtitle}</div>}
      </div>
      <div className="card-arrow">→</div>
    </div>
  );

  const ActivityItem = ({ user, type }) => {
    const timeAgo = (date) => {
      const seconds = Math.floor((new Date() - new Date(date)) / 1000);
      if (seconds < 3600) return t('dashboard.timeAgo.minutes', { count: Math.floor(seconds / 60) });
      if (seconds < 86400) return t('dashboard.timeAgo.hours', { count: Math.floor(seconds / 3600) });
      return t('dashboard.timeAgo.days', { count: Math.floor(seconds / 86400) });
    };

    return (
      <div className="activity-item">
        <div className="activity-avatar">
          {user.cursant.numeComplet.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div className="activity-details">
          <div className="activity-name">{user.cursant.numeComplet}</div>
          <div className="activity-action">
            {type === 'new' ? t('dashboard.activity.newRegistration') : t('dashboard.activity.expiringNear')}
          </div>
        </div>
        <div className="activity-time">{timeAgo(user.cursant.dataInregistrarii)}</div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>{t('dashboard.loading')}</p>
      </div>
    );
  }

  return (
    <div className="mission-control">
      <style>{`
        .mission-control {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          animation: fadeIn 0.6s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dashboard-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 1rem;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(0, 212, 255, 0.1);
          border-top-color: #00d4ff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .hero-section {
          text-align: center;
          margin-bottom: 3rem;
          padding: 3rem 2rem;
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 153, 204, 0.05));
          border-radius: 24px;
          border: 1px solid rgba(0, 212, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
          animation: pulse 8s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.5; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
        }

        .hero-content {
          position: relative;
          z-index: 1;
        }

        .hero-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 800;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #ffffff, #00d4ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 2rem;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          flex-wrap: wrap;
        }

        .hero-stat {
          text-align: center;
        }

        .hero-stat-value {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          color: #00d4ff;
          display: block;
          line-height: 1;
        }

        .hero-stat-label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 0.5rem;
        }

        .alerts-section {
          margin-bottom: 2rem;
        }

        .alert-card {
          background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.05));
          border: 1px solid rgba(255, 193, 7, 0.3);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .alert-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 193, 7, 0.2);
          border-color: rgba(255, 193, 7, 0.5);
        }

        .alert-icon {
          font-size: 2rem;
          animation: alertPulse 2s ease-in-out infinite;
        }

        @keyframes alertPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .alert-content {
          flex: 1;
        }

        .alert-title {
          font-weight: 600;
          color: #ffc107;
          margin-bottom: 0.25rem;
        }

        .alert-description {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .quick-nav-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .quick-nav-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2rem;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .quick-nav-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--card-color, #00d4ff) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .quick-nav-card:hover {
          transform: translateY(-8px);
          border-color: var(--card-color, #00d4ff);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3),
                      0 0 0 1px var(--card-color, #00d4ff);
        }

        .quick-nav-card:hover::before {
          opacity: 0.1;
        }

        .card-icon {
          font-size: 3rem;
          transition: transform 0.4s ease;
          position: relative;
          z-index: 1;
        }

        .quick-nav-card:hover .card-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .card-content {
          flex: 1;
          position: relative;
          z-index: 1;
        }

        .card-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--card-color, #00d4ff);
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .card-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 0.25rem;
        }

        .card-subtitle {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .card-arrow {
          font-size: 1.5rem;
          color: rgba(255, 255, 255, 0.3);
          transition: all 0.4s ease;
          position: relative;
          z-index: 1;
        }

        .quick-nav-card:hover .card-arrow {
          color: var(--card-color, #00d4ff);
          transform: translateX(5px);
        }

        .activity-feed {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.9);
        }

        .view-all-btn {
          background: none;
          border: none;
          color: #00d4ff;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          padding: 0.5rem 1rem;
          border-radius: 8px;
        }

        .view-all-btn:hover {
          background: rgba(0, 212, 255, 0.1);
          transform: translateX(5px);
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }

        .activity-item:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
          transform: translateX(5px);
        }

        .activity-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00d4ff, #0099cc);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #0f0f23;
          flex-shrink: 0;
        }

        .activity-details {
          flex: 1;
        }

        .activity-name {
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 0.25rem;
        }

        .activity-action {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .activity-time {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.4);
          white-space: nowrap;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .empty-state-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.3;
        }

        @media (max-width: 768px) {
          .mission-control {
            padding: 1rem;
          }

          .hero-section {
            padding: 2rem 1rem;
            margin-bottom: 2rem;
          }

          .hero-stats {
            gap: 2rem;
          }

          .hero-stat-value {
            font-size: 2rem;
          }

          .quick-nav-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .quick-nav-card {
            padding: 1.5rem;
          }

          .card-icon {
            font-size: 2.5rem;
          }

          .card-value {
            font-size: 2rem;
          }

          .activity-feed {
            padding: 1.5rem;
          }

          .section-title {
            font-size: 1.25rem;
          }

          .activity-item {
            flex-wrap: wrap;
          }

          .activity-time {
            width: 100%;
            text-align: right;
            margin-top: 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .hero-stats {
            flex-direction: column;
            gap: 1.5rem;
          }

          .alert-card {
            flex-direction: column;
            text-align: center;
          }

          .quick-nav-card {
            flex-direction: column;
            text-align: center;
          }

          .card-arrow {
            transform: rotate(90deg);
          }

          .quick-nav-card:hover .card-arrow {
            transform: rotate(90deg) translateX(5px);
          }
        }
      `}</style>

      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">{t('dashboard.hero.title')}</h1>
          <p className="hero-subtitle">{t('dashboard.hero.subtitle')}</p>
          
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">{stats.totalUsers}</span>
              <span className="hero-stat-label">{t('dashboard.hero.totalStudents')}</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">{stats.activeUsers}</span>
              <span className="hero-stat-label">{t('dashboard.hero.active')}</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">
                {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
              </span>
              <span className="hero-stat-label">{t('dashboard.hero.activityRate')}</span>
            </div>
          </div>
        </div>
      </div>

      {stats.expiringUsers && stats.expiringUsers.length > 0 && (
        <div className="alerts-section">
          <div 
            className="alert-card"
            onClick={() => navigate(`/${lang}/admin/users`, { state: { filterStatus: 'expiring' } })}
          >
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
              <div className="alert-title">{t('dashboard.alert.title')}</div>
              <div className="alert-description">
                {t('dashboard.alert.description', { count: stats.expiringUsers.length })}
              </div>
            </div>
            <div className="card-arrow">→</div>
          </div>
        </div>
      )}

      <div className="quick-nav-grid">
        <QuickNavCard
          icon="🏊"
          value={stats.activeUsers}
          title={t('dashboard.quickNav.activeStudents.title')}
          subtitle={t('dashboard.quickNav.activeStudents.subtitle')}
          color="#00d4ff"
          onClick={() => navigate(`/${lang}/admin/users`)}
        />
        
        <QuickNavCard
          icon="📋"
          value={t('dashboard.quickNav.trainingHub.value')}
          title={t('dashboard.quickNav.trainingHub.title')}
          subtitle={t('dashboard.quickNav.trainingHub.subtitle')}
          color="#00ff88"
          onClick={() => navigate(`/${lang}/admin/traininghub`)}
        />
        
        <QuickNavCard
          icon="📅"
          value={t('dashboard.quickNav.trainingSessions.value')}
          title={t('dashboard.quickNav.trainingSessions.title')}
          subtitle={t('dashboard.quickNav.trainingSessions.subtitle')}
          color="#ff6b6b"
          onClick={() => navigate(`/${lang}/admin/traininghub/sessionManager`)}
        />
        
        <QuickNavCard
          icon="📢"
          value={t('dashboard.quickNav.announcements.value')}
          title={t('dashboard.quickNav.announcements.title')}
          subtitle={t('dashboard.quickNav.announcements.subtitle')}
          color="#ffd93d"
          onClick={() => navigate(`/${lang}/admin/announcements`)}


        />
      </div>

      <div className="activity-feed">
        <div className="section-header">
          <h2 className="section-title">{t('dashboard.recentActivity.title')}</h2>
          <button 
            className="view-all-btn"
            onClick={() => navigate(`/${lang}/admin/users`)}
          >
            {t('dashboard.recentActivity.viewAll')} →
          </button>
        </div>

        <div className="activity-list">
          {stats.recentUsers && stats.recentUsers.length > 0 ? (
            stats.recentUsers.slice(0, 6).map((user, idx) => (
              <ActivityItem key={idx} user={user} type="new" />
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <p>{t('dashboard.recentActivity.empty')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;