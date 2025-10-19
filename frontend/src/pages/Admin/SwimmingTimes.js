import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import './SwimmingTimes.css';

const SwimmingTimes = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [swimmingTimes, setSwimmingTimes] = useState([]);
  const { lang } = useParams();
  const [personalBests, setPersonalBests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCursant, setSelectedCursant] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    poolLength: '',
    dateRange: ''
  });

  // Swimming events configuration
  const swimmingEvents = [
    { key: 'freestyle50m', label: t('swimmingTimes.events.freestyle50'), icon: '🏊‍♂️' },
    { key: 'freestyle100m', label: t('swimmingTimes.events.freestyle100'), icon: '🏊‍♂️' },
    { key: 'freestyle200m', label: t('swimmingTimes.events.freestyle200'), icon: '🏊‍♂️' },
    { key: 'freestyle400m', label: t('swimmingTimes.events.freestyle400'), icon: '🏊‍♂️' },
    { key: 'freestyle800m', label: t('swimmingTimes.events.freestyle800'), icon: '🏊‍♂️' },
    { key: 'freestyle1500m', label: t('swimmingTimes.events.freestyle1500'), icon: '🏊‍♂️' },
    { key: 'backstroke50m', label: t('swimmingTimes.events.backstroke50'), icon: '🏊‍♀️' },
    { key: 'backstroke100m', label: t('swimmingTimes.events.backstroke100'), icon: '🏊‍♀️' },
    { key: 'backstroke200m', label: t('swimmingTimes.events.backstroke200'), icon: '🏊‍♀️' },
    { key: 'breaststroke50m', label: t('swimmingTimes.events.breaststroke50'), icon: '🤽‍♂️' },
    { key: 'breaststroke100m', label: t('swimmingTimes.events.breaststroke100'), icon: '🤽‍♂️' },
    { key: 'breaststroke200m', label: t('swimmingTimes.events.breaststroke200'), icon: '🤽‍♂️' },
    { key: 'butterfly50m', label: t('swimmingTimes.events.butterfly50'), icon: '🦋' },
    { key: 'butterfly100m', label: t('swimmingTimes.events.butterfly100'), icon: '🦋' },
    { key: 'butterfly200m', label: t('swimmingTimes.events.butterfly200'), icon: '🦋' },
    { key: 'im100m', label: t('swimmingTimes.events.im100'), icon: '🏆' },
    { key: 'im200m', label: t('swimmingTimes.events.im200'), icon: '🏆' }
  ];

  // Format time from seconds to MM:SS.cc
  const formatTime = (seconds) => {
    if (!seconds) return '--:--';
    const totalSeconds = parseFloat(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    const sec = Math.floor(remainingSeconds);
    const centiseconds = Math.round((remainingSeconds - sec) * 100);
    return `${minutes.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  // Fetch swimming times from API
  useEffect(() => {
    const fetchSwimmingTimes = async () => {
      try {
        setIsLoading(true);
        const csrfResponse = await fetch('/csrf', {
          credentials: 'include'
        });
        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.token;
        
        // For now, we'll fetch all cursants and their times
        // In a real app, you might want to fetch by specific cursant
        const response = await fetch('/api/swimming-times', {
          credentials: 'include',
          headers: {
            'X-XSRF-TOKEN': csrfToken
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setSwimmingTimes(Array.isArray(data) ? data : []);
        } else {
          console.error('Response status:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch swimming times:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSwimmingTimes();
  }, []);

  // Group times by cursant and get personal bests
  const groupedByCursant = swimmingTimes.reduce((acc, time) => {
    const cursantId = time.cursantId;
    if (!acc[cursantId]) {
      acc[cursantId] = {
        cursantInfo: {
          id: cursantId,
          nume: time.cursantNume || `${t('swimmingTimes.student')} ${cursantId}`,
          email: time.cursantEmail
        },
        times: [],
        personalBests: {}
      };
    }
    acc[cursantId].times.push(time);
    
    // Calculate personal bests for each event
    swimmingEvents.forEach(event => {
      if (time[event.key]) {
        const currentBest = acc[cursantId].personalBests[event.key];
        if (!currentBest || parseFloat(time[event.key]) < parseFloat(currentBest.time)) {
          acc[cursantId].personalBests[event.key] = {
            time: time[event.key],
            date: time.recordedDate,
            recordId: time.id
          };
        }
      }
    });
    
    return acc;
  }, {});

  const cursantsList = Object.values(groupedByCursant);

  // Filter cursants based on search
  const filteredCursants = cursantsList.filter(cursant => {
    const matchesSearch = !filters.search || 
      cursant.cursantInfo.nume?.toLowerCase().includes(filters.search.toLowerCase()) ||
      cursant.cursantInfo.id?.toString().includes(filters.search);
    
    return matchesSearch;
  });

  const CursantCard = ({ cursant }) => {
    const personalBestsCount = Object.keys(cursant.personalBests).length;
    const totalRecords = cursant.times.length;
    
    return (
      <div className="planificare-swimmer-card">
        <div className="swimmer-card-header">
          <h3 className="swimmer-title">{cursant.cursantInfo.nume}</h3>
          <span className="swimmer-id-badge">ID: {cursant.cursantInfo.id}</span>
        </div>
        
        <div className="swimmer-stats">
          <div className="stat-item">
            <span className="stat-icon">🏆</span>
            <div className="stat-content">
              <span className="stat-value">{personalBestsCount}</span>
              <span className="stat-label">{t('swimmingTimes.card.personalRecords')}</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">📊</span>
            <div className="stat-content">
              <span className="stat-value">{totalRecords}</span>
              <span className="stat-label">{t('swimmingTimes.card.totalRecords')}</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">📅</span>
            <div className="stat-content">
              <span className="stat-value">
                {cursant.times.length > 0 
                  ? new Date(Math.max(...cursant.times.map(t => new Date(t.recordedDate)))).toLocaleDateString('ro-RO')
                  : 'N/A'
                }
              </span>
              <span className="stat-label">{t('swimmingTimes.card.lastTime')}</span>
            </div>
          </div>
        </div>
        
        {/* Personal Bests Preview */}
        <div className="personal-bests-preview">
          <h4>{t('swimmingTimes.card.personalBestsTop4')}</h4>
          <div className="bests-grid">
            {Object.entries(cursant.personalBests)
              .slice(0, 4)
              .map(([eventKey, best]) => {
                const event = swimmingEvents.find(e => e.key === eventKey);
                return (
                  <div key={eventKey} className="best-item">
                    <span className="best-event">{event?.label}</span>
                    <span className="best-time">{formatTime(best.time)}</span>
                  </div>
                );
              })}
          </div>
          {Object.keys(cursant.personalBests).length > 4 && (
            <p className="more-bests">
              {t('swimmingTimes.card.moreRecords', { count: Object.keys(cursant.personalBests).length - 4 })}
            </p>
          )}
        </div>
        
        <div className="swimmer-actions">
          <button 
            className="action-btn view-btn"
            onClick={() => navigate(`/${lang}/admin/swimming-times/cursant/${cursant.cursantInfo.id}/details`)}
          >
            <span className="btn-icon">👁️</span>
            {t('swimmingTimes.card.viewAllTimes')}
          </button>
          <button 
            className="action-btn edit-btn"
            onClick={() => navigate(`/${lang}/admin/swimming-times/cursant/${cursant.cursantInfo.id}/statistics`)}
          >
            <span className="btn-icon">📊</span>
            {t('swimmingTimes.card.statistics')}
          </button>
          <button 
            className="action-btn primary-btn"
            onClick={() => navigate(`/${lang}/admin/swimming-times/create?cursantId=${cursant.cursantInfo.id}`)}
          >
            <span className="btn-icon">➕</span>
            {t('swimmingTimes.card.addNewTime')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="swimmers-container">
      {/* Header */}
      <div className="swimmers-header">
        <div className="header-content">
          <h1 className="page-title">{t('swimmingTimes.pageTitle')}</h1>
          <p className="page-subtitle">{t('swimmingTimes.pageSubtitle')}</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => navigate(`/${lang}/admin/swimming-times/create`)}
          >
            <span className="btn-icon">➕</span>
            {t('swimmingTimes.addNewTime')}
          </button>
        </div>
      </div>
      
      {/* Stats Summary */}
      <div className="swimmers-stats">
        <div className="stat-card">
          <span className="stat-icon">🏊‍♂️</span>
          <div className="stat-content">
            <span className="stat-value">{filteredCursants.length}</span>
            <span className="stat-label">{t('swimmingTimes.stats.swimmersWithTimes')}</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🏆</span>
          <div className="stat-content">
            <span className="stat-value">
              {filteredCursants.reduce((sum, c) => sum + Object.keys(c.personalBests).length, 0)}
            </span>
            <span className="stat-label">{t('swimmingTimes.stats.totalPersonalRecords')}</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📊</span>
          <div className="stat-content">
            <span className="stat-value">
              {filteredCursants.reduce((sum, c) => sum + c.times.length, 0)}
            </span>
            <span className="stat-label">{t('swimmingTimes.stats.totalRecords')}</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🗓️</span>
          <div className="stat-content">
            <span className="stat-value">
              {swimmingTimes.length > 0 
                ? new Date(Math.max(...swimmingTimes.map(t => new Date(t.recordedDate)))).toLocaleDateString('ro-RO')
                : 'N/A'
              }
            </span>
            <span className="stat-label">{t('swimmingTimes.stats.lastRecord')}</span>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="swimmers-filters">
        <div className="filters-row">
          <div className="filter-group search-group">
            <label className="filter-label">{t('swimmingTimes.filters.searchSwimmer')}:</label>
            <input 
              type="text" 
              className="filter-input" 
              placeholder={t('swimmingTimes.filters.searchPlaceholder')}
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          
          <button 
            className="clear-filters-btn"
            onClick={() => setFilters({ search: '', poolLength: '', dateRange: '' })}
            disabled={!filters.search && !filters.poolLength && !filters.dateRange}
          >
            <span className="btn-icon">🗑️</span>
            {t('swimmingTimes.filters.clearFilters')}
          </button>
        </div>
        
        {/* Active filters display */}
        {filters.search && (
          <div className="active-filters">
            <span className="active-filters-label">{t('swimmingTimes.filters.activeFilters')}:</span>
            <span className="filter-tag">
              {t('swimmingTimes.filters.search')}: "{filters.search}"
              <button onClick={() => setFilters(prev => ({ ...prev, search: '' }))}>×</button>
            </span>
          </div>
        )}
      </div>
      
      {/* Swimming Times Grid */}
      <div className="swimmers-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner">🔄</div>
            <p>{t('swimmingTimes.loading')}</p>
          </div>
        ) : filteredCursants.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⏱️</div>
            <h3>{t('swimmingTimes.emptyState.noTimes')}</h3>
            <p>
              {cursantsList.length === 0 
                ? t('swimmingTimes.emptyState.noTimesDescription')
                : t('swimmingTimes.emptyState.modifyFilters')
              }
            </p>
            <button 
              className="btn-primary"
              onClick={() => navigate(`/${lang}/admin/swimming-times/create`)}
            >
              <span className="btn-icon">➕</span>
              {t('swimmingTimes.emptyState.addFirst')}
            </button>
          </div>
        ) : (
          <div className="swimmers-grid">
            {filteredCursants.map(cursant => (
              <CursantCard key={cursant.cursantInfo.id} cursant={cursant} />
            ))}
          </div>
        )}
      </div>
      
      {/* Results info */}
      {!isLoading && filteredCursants.length > 0 && (
        <div className="results-info">
          <p>
            {t('swimmingTimes.resultsInfo', { 
              showing: filteredCursants.length, 
              total: cursantsList.length 
            })}
            {filters.search && ` ${t('swimmingTimes.filtered')}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default SwimmingTimes;