import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import UserCard from './UserCard';
import Notification from './Notification';
import ConfirmationModal from '../../components/ConfrimationAlert/ConfirmationModal';
import './AdminUsersPage.css';
import './Notification.css';  
import '../../components/ConfrimationAlert/ConfirmationModal.css'; 
import { useLocation } from 'react-router-dom';

const MOCK_REGISTRATIONS = [
  {
    student: {
      id: 1,
      fullName: 'Popescu Ion',
      childName: 'Popescu Alex',
      email: 'ion.popescu@email.com',
      phone: '0722111222',
      registrationDate: '2024-10-01T10:30:00',
      expirationDate: '2025-10-10T10:30:00',
      expired: false
    },
    schedule: [
      { day: 'Luni', time: '15:30' },
      { day: 'Miercuri', time: '15:30' }
    ]
  },
  {
    student: {
      id: 2,
      fullName: 'Ionescu Maria',
      childName: 'Ionescu David',
      email: 'maria.ionescu@email.com',
      phone: '0733222333',
      registrationDate: '2024-09-28T14:20:00',
      expirationDate: '2024-10-28T14:20:00',
      expired: false
    },
    schedule: [
      { day: 'Marți', time: '16:30' },
      { day: 'Joi', time: '16:30' }
    ]
  },
  {
    student: {
      id: 3,
      fullName: 'Georgescu Andrei',
      childName: 'Georgescu Sofia',
      email: 'andrei.georgescu@email.com',
      phone: '0744333444',
      registrationDate: '2024-09-25T09:15:00',
      expirationDate: '2025-10-25T09:15:00',
      expired: false
    },
    schedule: [
      { day: 'Luni', time: '17:30' },
      { day: 'Vineri', time: '17:30' }
    ]
  },
  {
    student: {
      id: 4,
      fullName: 'Popa Elena',
      childName: 'Popa Mihai',
      email: 'elena.popa@email.com',
      phone: '0755444555',
      registrationDate: '2024-09-20T16:45:00',
      expirationDate: '2024-09-30T16:45:00',
      expired: true
    },
    schedule: [
      { day: 'Miercuri', time: '18:30 (avansați)' }
    ]
  },
  {
    student: {
      id: 5,
      fullName: 'Dumitrescu Alex',
      childName: 'Dumitrescu Ioana',
      email: 'alex.dumitrescu@email.com',
      phone: '0766555666',
      registrationDate: '2024-09-18T11:00:00',
      expirationDate: '2024-10-18T11:00:00',
      expired: false
    },
    schedule: [
      { day: 'Luni', time: '19:30' },
      { day: 'Joi', time: '19:30' }
    ]
  },
  {
    student: {
      id: 6,
      fullName: 'Stan Cristina',
      childName: 'Stan Gabriel',
      email: 'cristina.stan@email.com',
      phone: '0777666777',
      registrationDate: '2024-08-15T13:30:00',
      expirationDate: '2024-09-15T13:30:00',
      expired: true
    },
    schedule: [
      { day: 'Marți', time: '15:30' }
    ]
  },
  {
    student: {
      id: 7,
      fullName: 'Marin Gabriel',
      childName: 'Marin Ana',
      email: 'gabriel.marin@email.com',
      phone: '0788777888',
      registrationDate: '2024-09-10T10:00:00',
      expirationDate: '2024-10-10T10:00:00',
      expired: false
    },
    schedule: [
      { day: 'Vineri', time: '16:30' }
    ]
  },
  {
    student: {
      id: 8,
      fullName: 'Radu Ioana',
      childName: 'Radu Andrei',
      email: 'ioana.radu@email.com',
      phone: '0799888999',
      registrationDate: '2024-08-05T15:20:00',
      expirationDate: '2024-09-05T15:20:00',
      expired: true
    },
    schedule: [
      { day: 'Luni', time: '16:30' },
      { day: 'Miercuri', time: '16:30' }
    ]
  }
];

const AdminUsersPage = () => {
  const { t } = useTranslation();
  const [registrations, setRegistrations] = useState([]);
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

  const [notification, setNotification] = useState({
    show: false,
    type: 'info',
    title: '',
    message: ''
  });

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

  const handleExport = async (format = 'csv') => {
    setExportLoading(true);

    setTimeout(() => {
      const headers = `${t('adminUsers.export.headers.studentName')},${t('adminUsers.export.headers.childName')},${t('adminUsers.export.headers.phone')},${t('adminUsers.export.headers.email')},${t('adminUsers.export.headers.registrationDate')},${t('adminUsers.export.headers.status')}\n`;
      const rows = registrations.map(reg => 
        `${reg.student.fullName},${reg.student.childName || 'N/A'},${reg.student.phone},${reg.student.email},${reg.student.registrationDate},${reg.student.expired ? t('adminUsers.status.expired') : t('adminUsers.status.active')}`
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

      showNotification('success', t('adminUsers.notifications.exportSuccess.title'), t('adminUsers.notifications.exportSuccess.message', { filename }));
      setExportLoading(false);
    }, 800);
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    
    setTimeout(() => {
      setRegistrations(MOCK_REGISTRATIONS);
      
      if (registrations.length > 0) {
        showNotification('success', t('adminUsers.notifications.updateSuccess.title'), t('adminUsers.notifications.updateSuccess.message'));
      }
      
      setLoading(false);
    }, 500);
  };

  const handleDelete = async (id) => {
    const studentData = registrations.find(reg => reg.student.id === id);
    const studentName = studentData ? studentData.student.fullName : t('adminUsers.deleteModal.defaultStudentName');
    
    setConfirmModal({
      show: true,
      title: t('adminUsers.deleteModal.title'),
      message: t('adminUsers.deleteModal.message', { studentName }),
      onConfirm: () => performDelete(id, studentName)
    });
  };

  const performDelete = async (id, studentName) => {
    setConfirmModal({ show: false, title: '', message: '', onConfirm: null });

    setTimeout(() => {
      setRegistrations(prev => prev.filter(reg => reg.student.id !== id));
      
      const mockIndex = MOCK_REGISTRATIONS.findIndex(mock => mock.student.id === id);
      if (mockIndex !== -1) {
        MOCK_REGISTRATIONS.splice(mockIndex, 1);
      }
      
      showNotification('success', t('adminUsers.notifications.deleteSuccess.title'), t('adminUsers.notifications.deleteSuccess.message', { studentName }));
    }, 300);
  };

  const handleStatusUpdate = (studentId, newExpiredStatus, newExpirationDate, newRegistrationDate) => {
    return;
  };

  const getFilteredAndSortedRegistrations = () => {
    let filtered = [...registrations];
  
    if (searchTerm) {
      filtered = filtered.filter(registration => {
        const name = registration.student.fullName || '';
        const phone = registration.student.phone || '';
        
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               phone.includes(searchTerm);
      });
    }
  
    if (filterStatus !== 'all') {
      filtered = filtered.filter(registration =>
        filterStatus === 'active' ? !registration.student.expired : registration.student.expired
      );
    }
  
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.student.registrationDate || 0) - new Date(b.student.registrationDate || 0);
        case 'name':
          const nameA = a.student.fullName || '';
          const nameB = b.student.fullName || '';
          return nameA.localeCompare(nameB);
        case 'newest':
        default:
          return new Date(b.student.registrationDate || 0) - new Date(a.student.registrationDate || 0);
      }
    });

    if (filterDay !== 'all') {
      filtered = filtered.filter(registration =>
        registration.schedule?.some(scheduleItem => scheduleItem.day === filterDay)
      );
    }

    if (filterHour !== 'all') {
      filtered = filtered.filter(registration =>
        registration.schedule?.some(scheduleItem => scheduleItem.time === filterHour)
      );
    }
  
    return filtered;
  };

  useEffect(() => {
    fetchRegistrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredRegistrations = getFilteredAndSortedRegistrations();

  const ExportButtons = () => (
    <div className="export-section">
      <h3>{t('adminUsers.export.title')}</h3>
      <div className="export-buttons">
        <button
          onClick={() => handleExport('csv')}
          disabled={exportLoading}
          className="export-btn csv-btn"
        >
          {exportLoading ? t('adminUsers.export.exporting') : t('adminUsers.export.csvButton')}
        </button>
      </div>
      <p className="export-info">
        {t('adminUsers.export.info')}
      </p>
    </div>
  );

  if (loading) return <div className="loading">{t('adminUsers.loading')}</div>;

  return (
    <div className="admin-users-page">

      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isVisible={notification.show}
        onClose={hideNotification}
        autoClose={5000}
      />

      <ConfirmationModal
        isOpen={confirmModal.show}
        title={confirmModal.title}
        message={confirmModal.message}
        type="danger"
        confirmText={t('adminUsers.deleteModal.confirmButton')}
        cancelText={t('adminUsers.deleteModal.cancelButton')}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ show: false, title: '', message: '', onConfirm: null })}
      />

      <div className="page-header">
        <h1>{t('adminUsers.pageTitle')}</h1>
        <div className="stats">
          <span 
            className={`stat ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            {t('adminUsers.stats.total')}: {registrations.length}
          </span>
          <span 
            className={`stat ${filterStatus === 'active' ? 'active' : ''}`}
            onClick={() => setFilterStatus('active')}
          >
            {t('adminUsers.stats.active')}: {registrations.filter(reg => !reg.student.expired).length}
          </span>
          <span 
            className={`stat ${filterStatus === 'expired' ? 'active' : ''}`}
            onClick={() => setFilterStatus('expired')}
          >
            {t('adminUsers.stats.expired')}: {registrations.filter(reg => reg.student.expired).length}
          </span>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder={t('adminUsers.searchPlaceholder')}
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
            <option value="all">{t('adminUsers.filters.allStudents')}</option>
            <option value="active">{t('adminUsers.filters.activeOnly')}</option>
            <option value="expired">{t('adminUsers.filters.expiredOnly')}</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">{t('adminUsers.sort.newest')}</option>
            <option value="oldest">{t('adminUsers.sort.oldest')}</option>
            <option value="name">{t('adminUsers.sort.alphabetical')}</option>
          </select>

          <select
            value={filterDay}
            onChange={(e) => setFilterDay(e.target.value)}
            className="filter-select"
          >
            <option value="all">{t('adminUsers.filters.allDays')}</option>
            <option value="Luni">{t('adminUsers.days.monday')}</option>
            <option value="Marți">{t('adminUsers.days.tuesday')}</option>
            <option value="Miercuri">{t('adminUsers.days.wednesday')}</option>
            <option value="Joi">{t('adminUsers.days.thursday')}</option>
            <option value="Vineri">{t('adminUsers.days.friday')}</option>
          </select>

          <select
            value={filterHour}
            onChange={(e) => setFilterHour(e.target.value)}
            className="filter-select"
          >
            <option value="all">{t('adminUsers.filters.allHours')}</option>
            <option value="15:30">15:30</option>
            <option value="16:30">16:30</option>
            <option value="17:30">17:30</option>
            <option value="18:30 (avansați)">18:30 (avansați)</option>
            <option value="19:30">19:30</option>
          </select>

          <button
            onClick={fetchRegistrations}
            className="refresh-btn"
            disabled={loading}
          >
            {loading ? t('adminUsers.refreshing') : t('adminUsers.refreshButton')}
          </button>
        </div>
      </div>

      <ExportButtons />

      <div className="results-info">
        {t('adminUsers.resultsInfo', { 
          showing: filteredRegistrations.length, 
          total: registrations.length 
        })}
      </div>

      <div className="users-grid">
        {filteredRegistrations.length > 0 ? (
          filteredRegistrations.map((registration, index) => {
            // Transform back to old format for UserCard compatibility
            const inscriereFormat = {
              cursant: {
                id: registration.student.id,
                numeComplet: registration.student.fullName,
                numeCopil: registration.student.childName,
                email: registration.student.email,
                telefon: registration.student.phone,
                dataInregistrarii: registration.student.registrationDate,
                dataExpirarii: registration.student.expirationDate,
                expired: registration.student.expired
              },
              program: registration.schedule.map(s => ({
                zi: s.day,
                ora: s.time
              }))
            };
            
            return (
              <React.Fragment key={registration.student.id || index}>
                <UserCard
                  inscriere={inscriereFormat}
                  onDelete={handleDelete}
                  onStatusUpdate={handleStatusUpdate}
                />
              </React.Fragment>
            );
          })
        ) : (
          <div className="no-results">
            {searchTerm || filterStatus !== 'all' 
              ? t('adminUsers.noResultsFiltered')
              : t('adminUsers.noResultsEmpty')
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;