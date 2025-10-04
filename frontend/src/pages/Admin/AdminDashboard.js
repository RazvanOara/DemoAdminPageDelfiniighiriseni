import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// DELETED: import { API_BASE_URL } from '../../utils/config';
import './AdminDashboard.css';

// ADD: Mock data
const MOCK_USERS = [
  {
    cursant: {
      id: 1,
      numeComplet: 'Popescu Ion',
      email: 'ion.popescu@email.com',
      dataInregistrarii: '2024-10-01T10:30:00',
      expired: false
    }
  },
  {
    cursant: {
      id: 2,
      numeComplet: 'Ionescu Maria',
      email: 'maria.ionescu@email.com',
      dataInregistrarii: '2024-09-28T14:20:00',
      expired: false
    }
  },
  {
    cursant: {
      id: 3,
      numeComplet: 'Georgescu Andrei',
      email: 'andrei.georgescu@email.com',
      dataInregistrarii: '2024-09-25T09:15:00',
      expired: false
    }
  },
  {
    cursant: {
      id: 4,
      numeComplet: 'Popa Elena',
      email: 'elena.popa@email.com',
      dataInregistrarii: '2024-09-20T16:45:00',
      expired: true
    }
  },
  {
    cursant: {
      id: 5,
      numeComplet: 'Dumitrescu Alex',
      email: 'alex.dumitrescu@email.com',
      dataInregistrarii: '2024-09-18T11:00:00',
      expired: false
    }
  },
  {
    cursant: {
      id: 6,
      numeComplet: 'Stan Cristina',
      email: 'cristina.stan@email.com',
      dataInregistrarii: '2024-08-15T13:30:00',
      expired: true
    }
  },
  {
    cursant: {
      id: 7,
      numeComplet: 'Marin Gabriel',
      email: 'gabriel.marin@email.com',
      dataInregistrarii: '2024-09-10T10:00:00',
      expired: false
    }
  },
  {
    cursant: {
      id: 8,
      numeComplet: 'Radu Ioana',
      email: 'ioana.radu@email.com',
      dataInregistrarii: '2024-08-05T15:20:00',
      expired: true
    }
  }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    expiredUsers: 0,
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);

  // REPLACED: fetchStats with mock data loading
  const loadMockStats = () => {
    // Simulate loading delay
    setTimeout(() => {
      const data = MOCK_USERS;

      // Calculate stats
      const totalUsers = data.length;
      const activeUsers = data.filter(i => !i.cursant.expired).length;
      const expiredUsers = data.filter(i => i.cursant.expired).length;
      
      // Get recent users (last 5)
      const recentUsers = data
        .sort((a, b) => new Date(b.cursant.dataInregistrarii || 0) - new Date(a.cursant.dataInregistrarii || 0))
        .slice(0, 5);

      setStats({
        totalUsers,
        activeUsers,
        expiredUsers,
        recentUsers
      });

      setLoading(false);
    }, 500); // Simulate network delay
  };

  useEffect(() => {
    loadMockStats();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('ro-RO');
  };

  // Handle navigation with state instead of URL parameters
  const handleQuickNavigation = (filter) => {
    navigate('/admin/users', { 
      state: { filterStatus: filter },
      replace: false
    });
  };

  if (loading) return <div className="loading">Se încarcă dashboard-ul...</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Admin (Demo)</h1>
        <p>Bun venit în panoul de administrare al cursurilor de înot - Versiune demonstrativă cu date mock</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-number">{stats.totalUsers}</div>
          <div className="stat-label">Total Cursanți</div>
        </div>
        
        <div className="stat-card active">
          <div className="stat-number">{stats.activeUsers}</div>
          <div className="stat-label">Cursanți Activi</div>
        </div>
        
        <div className="stat-card expired">
          <div className="stat-number">{stats.expiredUsers}</div>
          <div className="stat-label">Cursanți Expirați</div>
        </div>

        <div className="stat-card percentage">
          <div className="stat-number">
            {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
          </div>
          <div className="stat-label">Rata de Activitate</div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Acțiuni Rapide</h2>
        <div className="action-buttons">
          <button 
            onClick={() => handleQuickNavigation('all')}
            className="action-btn primary"
          >
            Vizualizează Toți Cursanții
          </button>
          <button 
            onClick={() => handleQuickNavigation('active')}
            className="action-btn secondary"
          >
            Cursanți Activi
          </button>
          <button 
            onClick={() => handleQuickNavigation('expired')}
            className="action-btn secondary"
          >
            Cursanți Expirați
          </button>
        </div>
      </div>

      <div className="recent-registrations">
        <h2>Înscrieri Recente</h2>
        {stats.recentUsers.length > 0 ? (
          <div className="recent-users-list">
            {stats.recentUsers.map((inscriere, index) => (
              <div key={index} className="recent-user-item">
                <div className="user-info">
                  <span className="user-name">{inscriere.cursant.numeComplet}</span>
                  <span className="user-email">{inscriere.cursant.email}</span>
                </div>
                <div className="registration-date">
                  {formatDate(inscriere.cursant.dataInregistrarii)}
                </div>
                <div className={`user-status ${inscriere.cursant.expired ? 'expired' : 'active'}`}>
                  {inscriere.cursant.expired ? 'Expirat' : 'Activ'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Nu există înscrieri recente.</p>
        )}
        <div className="view-all">
          <button onClick={() => handleQuickNavigation('all')}>
            Vezi toate înscrierile →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;