import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import './AdvancedSwimmers.css';

// Mock data for advanced swimmers
let MOCK_ADVANCED_SWIMMERS = [
  {
    id: 1,
    cursantId: 1,
    cursantNume: 'Popescu Alex',
    maxHeartRate: 195,
    restingHeartRate: 60,
    thresholdHeartRate: 170,
    groupId: 1,
    createdAt: '2024-09-15T10:00:00'
  },
  {
    id: 2,
    cursantId: 2,
    cursantNume: 'Ionescu David',
    maxHeartRate: 188,
    restingHeartRate: 65,
    thresholdHeartRate: 164,
    groupId: 1,
    createdAt: '2024-09-20T14:30:00'
  },
  {
    id: 3,
    cursantId: 3,
    cursantNume: 'Georgescu Sofia',
    maxHeartRate: 192,
    restingHeartRate: 58,
    thresholdHeartRate: 167,
    groupId: 2,
    createdAt: '2024-09-25T11:15:00'
  },
  {
    id: 4,
    cursantId: 5,
    cursantNume: 'Dumitrescu Ioana',
    maxHeartRate: 185,
    restingHeartRate: 62,
    thresholdHeartRate: 161,
    groupId: null,
    createdAt: '2024-10-01T09:45:00'
  },
  {
    id: 5,
    cursantId: 7,
    cursantNume: 'Marin Ana',
    maxHeartRate: 198,
    restingHeartRate: 55,
    thresholdHeartRate: 172,
    groupId: 2,
    createdAt: '2024-10-03T16:20:00'
  }
];

// Mock groups data
const MOCK_GROUPS = [
  { id: 1, name: 'Grupa A - Avansați', color: '#00d4ff' },
  { id: 2, name: 'Grupa B - Competiție', color: '#ff6b6b' },
  { id: 3, name: 'Grupa C - Performanță', color: '#4ecdc4' }
];

const AdvancedSwimmers = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();
  const [advancedSwimmers, setAdvancedSwimmers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [filters, setFilters] = useState({
    search: '',
    heartRateRange: '',
    groupId: ''
  });

  // Helper to check if mobile
  const isMobile = () => window.innerWidth <= 768;

  // Fetch with mock data loading
  useEffect(() => {
    const fetchAdvancedSwimmers = async () => {
      setIsLoading(true);
      
      // Simulate loading delay
      setTimeout(() => {
        setAdvancedSwimmers([...MOCK_ADVANCED_SWIMMERS]);
        setIsLoading(false);
      }, 500);
    };

    fetchAdvancedSwimmers();
  }, []);

  // Fetch groups with mock data
  useEffect(() => {
    const fetchGroups = async () => {
      setTimeout(() => {
        setGroups([...MOCK_GROUPS]);
      }, 300);
    };

    fetchGroups();
  }, []);

  // Calculate heart rate zones
  const calculateHeartRateZones = (maxHr, restingHr) => {
    if (!maxHr || !restingHr) return null;
    
    const hrReserve = maxHr - restingHr;
    return {
      zone1: { min: restingHr + Math.round(hrReserve * 0.5), max: restingHr + Math.round(hrReserve * 0.6) },
      zone2: { min: restingHr + Math.round(hrReserve * 0.6), max: restingHr + Math.round(hrReserve * 0.7) },
      zone3: { min: restingHr + Math.round(hrReserve * 0.7), max: restingHr + Math.round(hrReserve * 0.8) },
      zone4: { min: restingHr + Math.round(hrReserve * 0.8), max: restingHr + Math.round(hrReserve * 0.9) },
      zone5: { min: restingHr + Math.round(hrReserve * 0.9), max: maxHr }
    };
  };

  const toggleCardExpansion = (swimmerId) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(swimmerId)) {
        newSet.delete(swimmerId);
      } else {
        newSet.add(swimmerId);
      }
      return newSet;
    });
  };

  // Filter advanced swimmers based on current filters
  const filteredSwimmers = advancedSwimmers.filter(swimmer => {
    const matchesSearch = !filters.search || 
      swimmer.cursantNume?.toLowerCase().includes(filters.search.toLowerCase()) ||
      swimmer.cursantId?.toString().includes(filters.search);
    
    let matchesHeartRateRange = true;
    if (filters.heartRateRange) {
      const maxHr = swimmer.maxHeartRate;
      switch (filters.heartRateRange) {
        case 'LOW':
          matchesHeartRateRange = maxHr < 170;
          break;
        case 'MEDIUM':
          matchesHeartRateRange = maxHr >= 170 && maxHr < 190;
          break;
        case 'HIGH':
          matchesHeartRateRange = maxHr >= 190;
          break;
        default:
          matchesHeartRateRange = true;
      }
    }
    
    let matchesGroup = true;
    if (filters.groupId) {
      if (filters.groupId === 'NONE') {
        matchesGroup = !swimmer.groupId;
      } else {
        matchesGroup = swimmer.groupId === parseInt(filters.groupId);
      }
    }
    
    return matchesSearch && matchesHeartRateRange && matchesGroup;
  });
  
  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      heartRateRange: '',
      groupId: ''
    });
  };

  const AdvancedSwimmerCard = ({ swimmer }) => {
    const zones = calculateHeartRateZones(swimmer.maxHeartRate, swimmer.restingHeartRate);
    const isExpanded = expandedCards.has(swimmer.id);
    
    // Handle card header click - navigate on mobile, expand on desktop
    const handleCardHeaderClick = () => {
      if (isMobile()) {
        navigate(`/${lang}/admin/advanced-swimmers/${swimmer.id}/details`);
      } else {
        toggleCardExpansion(swimmer.id);
      }
    };
    
    return (
      <div className={`planificare-swimmer-card ${isExpanded ? 'expanded' : ''}`}>
        <div 
          className="swimmer-card-header"
          onClick={handleCardHeaderClick}
          style={{ cursor: 'pointer' }}
        >
          <h3 className="swimmer-title">{swimmer.cursantNume || `${t('advancedSwimmers.card.studentId')}: ${swimmer.cursantId}`}</h3>
          <span className="swimmer-id-badge">ID: {swimmer.id}</span>
          <span className="expand-indicator">▼</span>
        </div>
        
        <div className="swimmer-quick-info">
          <div className="quick-stat">
            <span className="quick-stat-icon">❤️</span>
            <span className="quick-stat-value">{swimmer.maxHeartRate}</span>
            <span className="quick-stat-label">{t('advancedSwimmers.card.max')}</span>
          </div>
          <div className="quick-stat">
            <span className="quick-stat-icon">💤</span>
            <span className="quick-stat-value">{swimmer.restingHeartRate}</span>
            <span className="quick-stat-label">{t('advancedSwimmers.card.resting')}</span>
          </div>
          <div className="quick-stat">
            <span className="quick-stat-icon">🎯</span>
            <span className="quick-stat-value">{swimmer.thresholdHeartRate}</span>
            <span className="quick-stat-label">{t('advancedSwimmers.card.threshold')}</span>
          </div>
        </div>
        
        <div className="swimmer-expandable-content">
          <div className="swimmer-expandable-inner">
            <div className="swimmer-meta">
              <span className="swimmer-created">{t('advancedSwimmers.card.created')}: {new Date(swimmer.createdAt).toLocaleDateString('ro-RO')}</span>
            </div>
            
            {swimmer.groupId && (
              <div className="swimmer-group">
                <span className="group-badge" style={{ 
                  backgroundColor: (groups.find(g => g.id === swimmer.groupId)?.color || '#00d4ff') + '20',
                  border: `1px solid ${groups.find(g => g.id === swimmer.groupId)?.color || '#00d4ff'}`,
                  color: groups.find(g => g.id === swimmer.groupId)?.color || '#00d4ff'
                }}>
                  <span style={{ color: groups.find(g => g.id === swimmer.groupId)?.color || '#00d4ff' }}>
                    👥 {groups.find(g => g.id === swimmer.groupId)?.name || t('advancedSwimmers.card.group')}
                  </span>
                </span>
              </div>
            )}
            
            <div className="swimmer-stats">
              <div className="stat-item">
                <span className="stat-icon">❤️</span>
                <div className="stat-content">
                  <span className="stat-value">{swimmer.maxHeartRate}</span>
                  <span className="stat-label">{t('advancedSwimmers.card.hrMax')}</span>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">💤</span>
                <div className="stat-content">
                  <span className="stat-value">{swimmer.restingHeartRate}</span>
                  <span className="stat-label">{t('advancedSwimmers.card.hrResting')}</span>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🎯</span>
                <div className="stat-content">
                  <span className="stat-value">{swimmer.thresholdHeartRate}</span>
                  <span className="stat-label">{t('advancedSwimmers.card.hrThreshold')}</span>
                </div>
              </div>
            </div>
            
            {zones && (
              <div className="swimmer-zones">
                <h4>{t('advancedSwimmers.card.trainingZones')}</h4>
                <div className="zones-grid">
                  <span className="zone-tag zone-1">Z1: {zones.zone1.min}-{zones.zone1.max}</span>
                  <span className="zone-tag zone-2">Z2: {zones.zone2.min}-{zones.zone2.max}</span>
                  <span className="zone-tag zone-3">Z3: {zones.zone3.min}-{zones.zone3.max}</span>
                  <span className="zone-tag zone-4">Z4: {zones.zone4.min}-{zones.zone4.max}</span>
                  <span className="zone-tag zone-5">Z5: {zones.zone5.min}-{zones.zone5.max}</span>
                </div>
              </div>
            )}
            
            <div className="swimmer-actions">
              <button 
                className="action-btn view-more-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/${lang}/admin/advanced-swimmers/${swimmer.id}/details`);
                }}
              >
                <span className="btn-icon">👁️</span>
                {t('advancedSwimmers.card.viewMore')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="swimmers-container">
      {/* Header */}
      <div className="swimmers-header">
        <div className="header-content">
          <h1 className="page-title">{t('advancedSwimmers.pageTitle')}</h1>
          <p className="page-subtitle">{t('advancedSwimmers.pageSubtitle')}</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-secondary"
           onClick={() => navigate(`/${lang}/admin/swimming-times`)}
          >
            <span className="btn-icon">⏱️</span>
            {t('advancedSwimmers.buttons.swimmingTimes')}
          </button>
          <button 
            className="btn-primary"
            onClick={() => navigate(`/${lang}/admin/advanced-swimmers/create`)}

          >
            <span className="btn-icon">➕</span>
            {t('advancedSwimmers.buttons.addSwimmer')}
          </button>
        </div>
      </div>
      
      {/* Stats Summary */}
      <div className="swimmers-stats">
        <div className="stat-card">
          <span className="stat-icon">🏊‍♂️</span>
          <div className="stat-content">
            <span className="stat-value">{filteredSwimmers.length}</span>
            <span className="stat-label">{t('advancedSwimmers.stats.totalSwimmers')}</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <div className="stat-content">
            <span className="stat-value">
              {advancedSwimmers.filter(s => s.groupId).length}
            </span>
            <span className="stat-label">{t('advancedSwimmers.stats.inGroups')}</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📊</span>
          <div className="stat-content">
            <span className="stat-value">{groups.length}</span>
            <span className="stat-label">{t('advancedSwimmers.stats.activeGroups')}</span>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="swimmers-filters">
        <div className="filters-row">
          <div className="filter-group">
            <label className="filter-label">{t('advancedSwimmers.filters.hrMaxZone')}:</label>
            <select 
              className="filter-select"
              value={filters.heartRateRange}
              onChange={(e) => handleFilterChange('heartRateRange', e.target.value)}
            >
              <option value="">{t('advancedSwimmers.filters.allZones')}</option>
              <option value="LOW">{t('advancedSwimmers.filters.lowZone')}</option>
              <option value="MEDIUM">{t('advancedSwimmers.filters.mediumZone')}</option>
              <option value="HIGH">{t('advancedSwimmers.filters.highZone')}</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">{t('advancedSwimmers.filters.group')}:</label>
            <select 
              className="filter-select"
              value={filters.groupId}
              onChange={(e) => handleFilterChange('groupId', e.target.value)}
            >
              <option value="">{t('advancedSwimmers.filters.noFilter')}</option>
              <option value="NONE">{t('advancedSwimmers.filters.noGroup')}</option>
              {groups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group search-group">
            <label className="filter-label">{t('advancedSwimmers.filters.search')}:</label>
            <input 
              type="text" 
              className="filter-input" 
              placeholder={t('advancedSwimmers.filters.searchPlaceholder')}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          
          <button 
            className="clear-filters-btn"
            onClick={clearFilters}
            disabled={!filters.heartRateRange && !filters.search && !filters.groupId}
          >
            <span className="btn-icon">🗑️</span>
            {t('advancedSwimmers.filters.clearFilters')}
          </button>
        </div>
        
        {/* Active filters display */}
        {(filters.heartRateRange || filters.search || filters.groupId) && (
          <div className="active-filters">
            <span className="active-filters-label">{t('advancedSwimmers.filters.activeFilters')}:</span>
            {filters.heartRateRange && (
              <span className="filter-tag">
                {t('advancedSwimmers.filters.hrMaxZone')}: {
                  filters.heartRateRange === 'LOW' ? t('advancedSwimmers.filters.low') :
                  filters.heartRateRange === 'MEDIUM' ? t('advancedSwimmers.filters.medium') : 
                  t('advancedSwimmers.filters.high')
                }
                <button onClick={() => handleFilterChange('heartRateRange', '')}>×</button>
              </span>
            )}
            {filters.groupId && (
              <span className="filter-tag">
                {t('advancedSwimmers.filters.group')}: {filters.groupId === 'NONE' ? t('advancedSwimmers.filters.noGroup') : groups.find(g => g.id === parseInt(filters.groupId))?.name}
                <button onClick={() => handleFilterChange('groupId', '')}>×</button>
              </span>
            )}
            {filters.search && (
              <span className="filter-tag">
                {t('advancedSwimmers.filters.search')}: "{filters.search}"
                <button onClick={() => handleFilterChange('search', '')}>×</button>
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Swimmers Grid */}
      <div className="swimmers-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner">🔄</div>
            <p>{t('advancedSwimmers.loading')}</p>
          </div>
        ) : filteredSwimmers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏊‍♂️</div>
            <h3>{t('advancedSwimmers.emptyState.title')}</h3>
            <p>
              {advancedSwimmers.length === 0 
                ? t('advancedSwimmers.emptyState.noSwimmers')
                : t('advancedSwimmers.emptyState.noResults')
              }
            </p>
            <button 
              className="btn-primary"
              onClick={() => navigate(`/${lang}/admin/advanced-swimmers/create`)}
            >
              <span className="btn-icon">➕</span>
              {t('advancedSwimmers.emptyState.addFirst')}
            </button>
          </div>
        ) : (
          <div className="swimmers-grid">
            {filteredSwimmers.map(swimmer => (
                <AdvancedSwimmerCard key={swimmer.id} swimmer={swimmer} />
            ))}
          </div>
        )}
      </div>
      
      {/* Results info */}
      {!isLoading && filteredSwimmers.length > 0 && (
        <div className="results-info">
          <p>
            {t('advancedSwimmers.resultsInfo', {
              showing: filteredSwimmers.length,
              total: advancedSwimmers.length
            })}
            {(filters.heartRateRange || filters.search || filters.groupId) && ` ${t('advancedSwimmers.filtered')}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdvancedSwimmers;