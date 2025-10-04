import React, { useEffect, useState} from 'react';
import UserCard from './UserCard';
import Notification from './Notification';
import ConfirmationModal from '../../components/ConfrimationAlert/ConfirmationModal';
// DELETED: import { API_BASE_URL } from '../../utils/config';
import './AdminUsersPage.css';
import './Notification.css';  
import '../../components/ConfrimationAlert/ConfirmationModal.css'; 
import { useLocation } from 'react-router-dom';

// ADD: Mock data for users
const MOCK_INSCRIERI = [
  {
    cursant: {
      id: 1,
      numeComplet: 'Popescu Ion',
      numeCopil: 'Popescu Alex',
      email: 'ion.popescu@email.com',
      telefon: '0722111222',
      dataInregistrarii: '2024-10-01T10:30:00',
      dataExpirarii: '2024-11-01T10:30:00',
      expired: false
    },
    program: [
      { zi: 'Luni', ora: '15:30' },
      { zi: 'Miercuri', ora: '15:30' }
    ]
  },
  {
    cursant: {
      id: 2,
      numeComplet: 'Ionescu Maria',
      numeCopil: 'Ionescu David',
      email: 'maria.ionescu@email.com',
      telefon: '0733222333',
      dataInregistrarii: '2024-09-28T14:20:00',
      dataExpirarii: '2024-10-28T14:20:00',
      expired: false
    },
    program: [
      { zi: 'Marți', ora: '16:30' },
      { zi: 'Joi', ora: '16:30' }
    ]
  },
  {
    cursant: {
      id: 3,
      numeComplet: 'Georgescu Andrei',
      numeCopil: 'Georgescu Sofia',
      email: 'andrei.georgescu@email.com',
      telefon: '0744333444',
      dataInregistrarii: '2024-09-25T09:15:00',
      dataExpirarii: '2024-10-25T09:15:00',
      expired: false
    },
    program: [
      { zi: 'Luni', ora: '17:30' },
      { zi: 'Vineri', ora: '17:30' }
    ]
  },
  {
    cursant: {
      id: 4,
      numeComplet: 'Popa Elena',
      numeCopil: 'Popa Mihai',
      email: 'elena.popa@email.com',
      telefon: '0755444555',
      dataInregistrarii: '2024-09-20T16:45:00',
      dataExpirarii: '2024-09-30T16:45:00',
      expired: true
    },
    program: [
      { zi: 'Miercuri', ora: '18:30 (avansați)' }
    ]
  },
  {
    cursant: {
      id: 5,
      numeComplet: 'Dumitrescu Alex',
      numeCopil: 'Dumitrescu Ioana',
      email: 'alex.dumitrescu@email.com',
      telefon: '0766555666',
      dataInregistrarii: '2024-09-18T11:00:00',
      dataExpirarii: '2024-10-18T11:00:00',
      expired: false
    },
    program: [
      { zi: 'Luni', ora: '19:30' },
      { zi: 'Joi', ora: '19:30' }
    ]
  },
  {
    cursant: {
      id: 6,
      numeComplet: 'Stan Cristina',
      numeCopil: 'Stan Gabriel',
      email: 'cristina.stan@email.com',
      telefon: '0777666777',
      dataInregistrarii: '2024-08-15T13:30:00',
      dataExpirarii: '2024-09-15T13:30:00',
      expired: true
    },
    program: [
      { zi: 'Marți', ora: '15:30' }
    ]
  },
  {
    cursant: {
      id: 7,
      numeComplet: 'Marin Gabriel',
      numeCopil: 'Marin Ana',
      email: 'gabriel.marin@email.com',
      telefon: '0788777888',
      dataInregistrarii: '2024-09-10T10:00:00',
      dataExpirarii: '2024-10-10T10:00:00',
      expired: false
    },
    program: [
      { zi: 'Vineri', ora: '16:30' }
    ]
  },
  {
    cursant: {
      id: 8,
      numeComplet: 'Radu Ioana',
      numeCopil: 'Radu Andrei',
      email: 'ioana.radu@email.com',
      telefon: '0799888999',
      dataInregistrarii: '2024-08-05T15:20:00',
      dataExpirarii: '2024-09-05T15:20:00',
      expired: true
    },
    program: [
      { zi: 'Luni', ora: '16:30' },
      { zi: 'Miercuri', ora: '16:30' }
    ]
  }
];

const AdminUsersPage = () => {
  const [inscrieri, setInscrieri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const location = useLocation();
  const [filterDay, setFilterDay] = useState('all');
  const [filterHour, setFilterHour] = useState('all');

  useEffect(() => {
    if (location.state?.filterStatus) {
      setFilterStatus(location.state.filterStatus);
    }
  }, [location.state]);

  // Notification state
  const [notification, setNotification] = useState({
    show: false,
    type: 'info',
    title: '',
    message: ''
  });

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: null
  });

  const showNotification = (type, title, message) => {
    setNotification({
      show: true,
      type,
      title,
      message
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  // REPLACED: Export function with mock alert
  const handleExport = async (format = 'csv') => {
    setExportLoading(true);

    // Simulate export delay
    setTimeout(() => {
      // Create mock CSV content
      const headers = 'Nume Cursant,Nume Copil,Telefon,Email,Data Inregistrarii,Status\n';
      const rows = inscrieri.map(i => 
        `${i.cursant.numeComplet},${i.cursant.numeCopil || 'N/A'},${i.cursant.telefon},${i.cursant.email},${i.cursant.dataInregistrarii},${i.cursant.expired ? 'Expirat' : 'Activ'}`
      ).join('\n');
      
      const csvContent = headers + rows;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filename = `cursanti_export_${new Date().toISOString().slice(0, 10)}.${format}`;
      
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showNotification('success', 'Export Realizat', `Fișierul ${filename} a fost descărcat cu succes (date mock).`);
      setExportLoading(false);
    }, 800);
  };

  // REPLACED: Fetch with mock data loading
  const fetchInscrieri = async () => {
    setLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      setInscrieri(MOCK_INSCRIERI);
      
      // Show success notification only if it was a manual refresh
      if (inscrieri.length > 0) {
        showNotification('success', 'Actualizare completă', 'Lista de cursanți a fost actualizată cu succes (date mock).');
      }
      
      setLoading(false);
    }, 500);
  };

  // REPLACED: Delete with mock implementation
  const handleDelete = async (id) => {
    const student = inscrieri.find(i => i.cursant.id === id);
    const studentName = student ? student.cursant.numeComplet : 'acest cursant';
    
    setConfirmModal({
      show: true,
      title: 'Confirmare ștergere',
      message: `Sigur doriți să ștergeți pe ${studentName}? Această acțiune nu poate fi anulată și toate datele asociate vor fi pierdute permanent.`,
      onConfirm: () => performDelete(id, studentName)
    });
  };

  // SIMPLIFIED: No API call - persists until refresh
  const performDelete = async (id, studentName) => {
    setConfirmModal({ show: false, title: '', message: '', onConfirm: null });

    // Simulate deletion delay
    setTimeout(() => {
      // Remove from state
      setInscrieri(prev => prev.filter(c => c.cursant.id !== id));
      
      // Remove from mock data source so it persists until refresh
      const mockIndex = MOCK_INSCRIERI.findIndex(m => m.cursant.id === id);
      if (mockIndex !== -1) {
        MOCK_INSCRIERI.splice(mockIndex, 1);
      }
      
      showNotification('success', 'Cursant șters', `${studentName} a fost șters cu succes. Modificarea va persista până la refresh.`);
    }, 300);
  };

  // DISABLED: Status update does nothing in demo mode
  const handleStatusUpdate = (cursantId, newExpiredStatus, newDataExpirarii, newDataInregistrarii) => {
    // Do nothing - button is disabled in demo mode
    return;
  };

  // Filter and sort inscriptions
  const getFilteredAndSortedInscrieri = () => {
    let filtered = [...inscrieri];
  
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(inscriere => {
        const nume = inscriere.cursant.numeComplet || '';
        const telefon = inscriere.cursant.telefon || '';
        
        return nume.toLowerCase().includes(searchTerm.toLowerCase()) ||
               telefon.includes(searchTerm);
      });
    }
  
    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(inscriere =>
        filterStatus === 'active' ? !inscriere.cursant.expired : inscriere.cursant.expired
      );
    }
  
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.cursant.dataInregistrarii || 0) - new Date(b.cursant.dataInregistrarii || 0);
        case 'name':
          const nameA = a.cursant.numeComplet || '';
          const nameB = b.cursant.numeComplet || '';
          return nameA.localeCompare(nameB);
        case 'newest':
        default:
          return new Date(b.cursant.dataInregistrarii || 0) - new Date(a.cursant.dataInregistrarii || 0);
      }
    });

    // Filter by day
    if (filterDay !== 'all') {
      filtered = filtered.filter(inscriere =>
        inscriere.program?.some(p => p.zi === filterDay)
      );
    }

    // Filter by hour
    if (filterHour !== 'all') {
      filtered = filtered.filter(inscriere =>
        inscriere.program?.some(p => p.ora === filterHour)
      );
    }
  
    return filtered;
  };

  useEffect(() => {
    fetchInscrieri();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredInscrieri = getFilteredAndSortedInscrieri();

  // Export buttons component
  const ExportButtons = () => (
    <div className="export-section">
      <h3>Export Date (Mock)</h3>
      <div className="export-buttons">
        <button
          onClick={() => handleExport('csv')}
          disabled={exportLoading}
          className="export-btn csv-btn"
        >
          {exportLoading ? 'Se exportă...' : '📊 Export CSV'}
        </button>
      </div>
      <p className="export-info">
        Exportul conține: Nume Cursant, Nume Părinte, Telefon (date demonstrative)
      </p>
    </div>
  );

  if (loading) return <div className="loading">Se încarcă cursanții...</div>;

  return (
    <div className="admin-users-page">

      {/* Notification Component */}
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isVisible={notification.show}
        onClose={hideNotification}
        autoClose={5000}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.show}
        title={confirmModal.title}
        message={confirmModal.message}
        type="danger"
        confirmText="Șterge"
        cancelText="Anulează"
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ show: false, title: '', message: '', onConfirm: null })}
      />

      {/* Desktop Page Header - becomes mobile filter buttons */}
      <div className="page-header">
        <h1>Gestiune Cursanți (Demo)</h1>
        <div className="stats">
          <span 
            className={`stat ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            Total: {inscrieri.length}
          </span>
          <span 
            className={`stat ${filterStatus === 'active' ? 'active' : ''}`}
            onClick={() => setFilterStatus('active')}
          >
            Activi: {inscrieri.filter(i => !i.cursant.expired).length}
          </span>
          <span 
            className={`stat ${filterStatus === 'expired' ? 'active' : ''}`}
            onClick={() => setFilterStatus('expired')}
          >
            Expirați: {inscrieri.filter(i => i.cursant.expired).length}
          </span>
        </div>
      </div>

      {/* Desktop Filters Section */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Caută după nume sau telefon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">Toți cursanții</option>
            <option value="active">Doar activi</option>
            <option value="expired">Doar expirați</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Cei mai noi</option>
            <option value="oldest">Cei mai vechi</option>
            <option value="name">Sortare alfabetică</option>
          </select>

          <select
            value={filterDay}
            onChange={(e) => setFilterDay(e.target.value)}
            className="filter-select"
          >
            <option value="all">Toate zilele</option>
            <option value="Luni">Luni</option>
            <option value="Marți">Marți</option>
            <option value="Miercuri">Miercuri</option>
            <option value="Joi">Joi</option>
            <option value="Vineri">Vineri</option>
          </select>

          <select
            value={filterHour}
            onChange={(e) => setFilterHour(e.target.value)}
            className="filter-select"
          >
            <option value="all">Toate orele</option>
            <option value="15:30">15:30</option>
            <option value="16:30">16:30</option>
            <option value="17:30">17:30</option>
            <option value="18:30 (avansați)">18:30 (avansați)</option>
            <option value="19:30">19:30</option>
          </select>

          <button
            onClick={fetchInscrieri}
            className="refresh-btn"
            disabled={loading}
          >
            {loading ? 'Se încarcă...' : 'Reîmprospătează'}
          </button>
        </div>
      </div>

      {/* Export Section */}
      <ExportButtons />

      <div className="results-info">
        Se afișează {filteredInscrieri.length} din {inscrieri.length} cursanți
      </div>

      <div className="users-grid">
        {filteredInscrieri.length > 0 ? (
          filteredInscrieri.map((inscriere, index) => (
            <React.Fragment key={inscriere.cursant.id || index}>
              {/* Desktop Card - will be hidden on mobile via CSS */}
              <UserCard
                inscriere={inscriere}
                onDelete={handleDelete}
                onStatusUpdate={handleStatusUpdate}
              />
            </React.Fragment>
          ))
        ) : (
          <div className="no-results">
            {searchTerm || filterStatus !== 'all' 
              ? 'Nu s-au găsit cursanți care să corespundă criteriilor de căutare.'
              : 'Nu există cursanți înregistrați în sistem.'
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;