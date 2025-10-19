import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import './CreateSwimmingTimes.css';

// ADD: Mock cursant info
const MOCK_CURSANTS = {
  '1': { id: 1, nume: 'Popescu Alex', advancedSwimmerId: 1 },
  '2': { id: 2, nume: 'Ionescu David', advancedSwimmerId: 2 },
  '3': { id: 3, nume: 'Georgescu Sofia', advancedSwimmerId: 3 },
  '4': { id: 4, nume: 'Popa Mihai', advancedSwimmerId: null },
  '5': { id: 5, nume: 'Dumitrescu Ioana', advancedSwimmerId: 4 }
};

const CreateSwimmingTimes = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cursantIdFromUrl = searchParams.get('cursantId');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { lang } = useParams();
  const [success, setSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOnlyFilled, setShowOnlyFilled] = useState(false);

  const [formData, setFormData] = useState({
    cursantId: cursantIdFromUrl || '',
    recordedDate: new Date().toISOString().split('T')[0],
    poolLength: 25,
    competitionName: '',
    notes: '',
    freestyle50m: '',
    freestyle100m: '',
    freestyle200m: '',
    freestyle400m: '',
    freestyle800m: '',
    freestyle1500m: '',
    backstroke50m: '',
    backstroke100m: '',
    backstroke200m: '',
    breaststroke50m: '',
    breaststroke100m: '',
    breaststroke200m: '',
    butterfly50m: '',
    butterfly100m: '',
    butterfly200m: '',
    im100m: '',
    im200m: ''
  });
  
  const [cursantInfo, setCursantInfo] = useState(null);
  const [advancedSwimmerId, setAdvancedSwimmerId] = useState(null);

  const swimmingEvents = [
    { key: 'freestyle50m', label: t('createTimes.events.freestyle50'), category: t('createTimes.categories.freestyle'), distance: '50m' },
    { key: 'freestyle100m', label: t('createTimes.events.freestyle100'), category: t('createTimes.categories.freestyle'), distance: '100m' },
    { key: 'freestyle200m', label: t('createTimes.events.freestyle200'), category: t('createTimes.categories.freestyle'), distance: '200m' },
    { key: 'freestyle400m', label: t('createTimes.events.freestyle400'), category: t('createTimes.categories.freestyle'), distance: '400m' },
    { key: 'freestyle800m', label: t('createTimes.events.freestyle800'), category: t('createTimes.categories.freestyle'), distance: '800m' },
    { key: 'freestyle1500m', label: t('createTimes.events.freestyle1500'), category: t('createTimes.categories.freestyle'), distance: '1500m' },
    { key: 'backstroke50m', label: t('createTimes.events.backstroke50'), category: t('createTimes.categories.backstroke'), distance: '50m' },
    { key: 'backstroke100m', label: t('createTimes.events.backstroke100'), category: t('createTimes.categories.backstroke'), distance: '100m' },
    { key: 'backstroke200m', label: t('createTimes.events.backstroke200'), category: t('createTimes.categories.backstroke'), distance: '200m' },
    { key: 'breaststroke50m', label: t('createTimes.events.breaststroke50'), category: t('createTimes.categories.breaststroke'), distance: '50m' },
    { key: 'breaststroke100m', label: t('createTimes.events.breaststroke100'), category: t('createTimes.categories.breaststroke'), distance: '100m' },
    { key: 'breaststroke200m', label: t('createTimes.events.breaststroke200'), category: t('createTimes.categories.breaststroke'), distance: '200m' },
    { key: 'butterfly50m', label: t('createTimes.events.butterfly50'), category: t('createTimes.categories.butterfly'), distance: '50m' },
    { key: 'butterfly100m', label: t('createTimes.events.butterfly100'), category: t('createTimes.categories.butterfly'), distance: '100m' },
    { key: 'butterfly200m', label: t('createTimes.events.butterfly200'), category: t('createTimes.categories.butterfly'), distance: '200m' },
    { key: 'im100m', label: t('createTimes.events.im100'), category: t('createTimes.categories.im'), distance: '100m' },
    { key: 'im200m', label: t('createTimes.events.im200'), category: t('createTimes.categories.im'), distance: '200m' }
  ];

  const categories = [
    'all',
    t('createTimes.categories.freestyle'),
    t('createTimes.categories.backstroke'),
    t('createTimes.categories.breaststroke'),
    t('createTimes.categories.butterfly'),
    t('createTimes.categories.im')
  ];

  // Filter events based on search and category
  const filteredEvents = swimmingEvents.filter(event => {
    const matchesSearch = event.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.distance.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesFilled = !showOnlyFilled || (formData[event.key] && formData[event.key].trim() !== '');
    
    return matchesSearch && matchesCategory && matchesFilled;
  });

  // Convert time from MM:SS.CC format to seconds
  const parseTime = (timeString) => {
    if (!timeString || timeString.trim() === '') return null;
    
    try {
      const parts = timeString.split(':');
      if (parts.length !== 2) return null;
      
      const minutes = parseInt(parts[0]);
      const secondsParts = parts[1].split('.');
      const seconds = parseInt(secondsParts[0]);
      const centiseconds = secondsParts.length > 1 ? parseInt(secondsParts[1].padEnd(2, '0')) : 0;
      
      return minutes * 60 + seconds + centiseconds / 100;
    } catch (error) {
      return null;
    }
  };

  // Validate time format (MM:SS.CC)
  const isValidTimeFormat = (timeString) => {
    if (!timeString || timeString.trim() === '') return true;
    const timeRegex = /^([0-9]{1,2}):([0-5][0-9])(\.[0-9]{1,2})?$/;
    return timeRegex.test(timeString);
  };

  // Format time input with improved logic
  const formatTimeInput = (value) => {
    const digits = value.replace(/[^\d]/g, '');
    
    if (digits.length === 0) return '';
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) {
      return `${digits.substring(0, 2)}:${digits.substring(2)}`;
    }
    if (digits.length <= 6) {
      return `${digits.substring(0, 2)}:${digits.substring(2, 4)}.${digits.substring(4)}`;
    }
    
    return `${digits.substring(0, 2)}:${digits.substring(2, 4)}.${digits.substring(4, 6)}`;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (error) setError(null);
  };

  const handleTimeInputChange = (eventKey, value) => {
    const formattedTime = formatTimeInput(value);
    handleInputChange(eventKey, formattedTime);
  };

  // REPLACED: Fetch cursant info with mock data
  useEffect(() => {
    const fetchCursantInfo = () => {
      if (cursantIdFromUrl) {
        setTimeout(() => {
          const mockCursant = MOCK_CURSANTS[cursantIdFromUrl];
          if (mockCursant) {
            setCursantInfo({ 
              id: mockCursant.id, 
              nume: mockCursant.nume 
            });
            setAdvancedSwimmerId(mockCursant.advancedSwimmerId);
          } else {
            setCursantInfo({ 
              id: cursantIdFromUrl, 
              nume: `${t('createTimes.student')} ${cursantIdFromUrl}` 
            });
          }
        }, 300);
      }
    };

    fetchCursantInfo();
  }, [cursantIdFromUrl, t]);

  // REPLACED: Submit with mock implementation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.cursantId) {
      setError(t('createTimes.validation.studentRequired'));
      return;
    }

    if (!formData.recordedDate) {
      setError(t('createTimes.validation.dateRequired'));
      return;
    }

    const hasAtLeastOneTime = swimmingEvents.some(event => 
      formData[event.key] && formData[event.key].trim() !== ''
    );

    if (!hasAtLeastOneTime) {
      setError(t('createTimes.validation.atLeastOneTime'));
      return;
    }

    // Validate all filled times
    for (const event of swimmingEvents) {
      const timeValue = formData[event.key];
      if (timeValue && timeValue.trim() !== '') {
        if (!isValidTimeFormat(timeValue)) {
          setError(t('createTimes.validation.invalidFormat', { event: event.label }));
          return;
        }
      }
    }

    setIsLoading(true);

    // Simulate save delay
    setTimeout(() => {
      setSuccess(true);
      setIsLoading(false);
      
      setTimeout(() => {
        if (advancedSwimmerId) {
          navigate(`/${lang}/admin/advanced-swimmers/${advancedSwimmerId}/details`);
        } else {
          navigate(`/${lang}/admin/swimming-times`);
        }
      }, 1500);
    }, 800);
  };

  const clearAllTimes = () => {
    const clearedData = { ...formData };
    swimmingEvents.forEach(event => {
      clearedData[event.key] = '';
    });
    setFormData(clearedData);
  };

  const filledTimesCount = swimmingEvents.filter(event => 
    formData[event.key] && formData[event.key].trim() !== ''
  ).length;

  return (
    <div className="create-times-container">
      {/* Header */}
      <div className="create-times-header">
        <button 
          className="back-btn" 
          onClick={() => {
            if (advancedSwimmerId) {
              navigate(`/${lang}/admin/advanced-swimmers/${advancedSwimmerId}/details`);
            } else {
              navigate(`/${lang}/admin/swimming-times`);
            }
          }}
        >
          ← {t('createTimes.backButton')}
        </button>
        <div className="header-content">
          <h1 className="page-title">{t('createTimes.pageTitle')}</h1>
          <p className="page-subtitle">
            {t('createTimes.pageSubtitle')}
            {filledTimesCount > 0 && <span className="times-counter">({filledTimesCount} {t('createTimes.timesCompleted')})</span>}
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-text">{error}</span>
          <button onClick={() => setError(null)} className="error-close">×</button>
        </div>
      )}

      {success && (
        <div className="success-message">
          <span className="success-text">{t('createTimes.successMessage')}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="create-times-form">
        {/* Basic Information */}
        <div className="form-section">
          <div className="section-header">
            <h2>{t('createTimes.basicInfo.title')}</h2>
            <p>{t('createTimes.basicInfo.description')}</p>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">{t('createTimes.basicInfo.student')}</label>
              <div className="cursant-display">
                <span className="cursant-name">{cursantInfo?.nume || t('createTimes.basicInfo.loading')}</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('createTimes.basicInfo.recordDate')} *</label>
              <input
                type="date"
                className="form-input"
                value={formData.recordedDate}
                onChange={(e) => handleInputChange('recordedDate', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('createTimes.basicInfo.poolLength')}</label>
              <select
                className="form-select"
                value={formData.poolLength}
                onChange={(e) => handleInputChange('poolLength', e.target.value)}
              >
                <option value={25}>{t('createTimes.basicInfo.meters25')}</option>
                <option value={50}>{t('createTimes.basicInfo.meters50')}</option>
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">{t('createTimes.basicInfo.competitionName')}</label>
              <input
                type="text"
                className="form-input"
                value={formData.competitionName}
                onChange={(e) => handleInputChange('competitionName', e.target.value)}
                placeholder={t('createTimes.basicInfo.competitionPlaceholder')}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('createTimes.basicInfo.notes')}</label>
              <textarea
                className="form-textarea"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder={t('createTimes.basicInfo.notesPlaceholder')}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="form-section">
          <div className="section-header">
            <h2>{t('createTimes.search.title')}</h2>
            <p>{t('createTimes.search.description')}</p>
          </div>

          <div className="search-controls">
            <div className="search-bar">
              <input
                type="text"
                className="search-input"
                placeholder={t('createTimes.search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>

            <div className="filter-controls">
              <select
                className="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">{t('createTimes.search.allCategories')}</option>
                {categories.slice(1).map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <label className="checkbox-control">
                <input
                  type="checkbox"
                  checked={showOnlyFilled}
                  onChange={(e) => setShowOnlyFilled(e.target.checked)}
                />
                <span>{t('createTimes.search.onlyFilled')}</span>
              </label>

              <button
                type="button"
                className="clear-all-btn"
                onClick={clearAllTimes}
                disabled={filledTimesCount === 0}
              >
                {t('createTimes.search.clearAll')}
              </button>
            </div>
          </div>

          <div className="search-results-info">
            <span>
              {t('createTimes.search.showingResults', { 
                showing: filteredEvents.length, 
                total: swimmingEvents.length 
              })}
              {filledTimesCount > 0 && ` • ${filledTimesCount} ${t('createTimes.timesCompleted')}`}
            </span>
          </div>
        </div>

        {/* Swimming Times */}
        <div className="form-section">
          <div className="section-header">
            <h2>{t('createTimes.times.title')}</h2>
            <p>{t('createTimes.times.formatInfo')}</p>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="no-events-message">
              <p>{t('createTimes.times.noEvents')}</p>
              <button 
                type="button" 
                className="reset-filters-btn"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setShowOnlyFilled(false);
                }}
              >
                {t('createTimes.times.resetFilters')}
              </button>
            </div>
          ) : (
            <div className="times-grid">
              {filteredEvents.map(event => (
                <div key={event.key} className="time-input-group">
                  <label className="time-label">
                    <span className="event-icon">{event.icon}</span>
                    <span className="event-name">{event.label}</span>
                    {formData[event.key] && <span className="filled-indicator">✓</span>}
                  </label>
                  <input
                    type="text"
                    className={`time-input ${formData[event.key] ? 'has-value' : ''}`}
                    value={formData[event.key]}
                    onChange={(e) => handleTimeInputChange(event.key, e.target.value)}
                    placeholder="00:00.00"
                    maxLength="9"
                  />
                  {formData[event.key] && (
                    <button
                      type="button"
                      className="clear-time-btn"
                      onClick={() => handleInputChange(event.key, '')}
                      title={t('createTimes.times.clearTime')}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => {
              if (advancedSwimmerId) {
                navigate(`/${lang}/admin/advanced-swimmers/${advancedSwimmerId}/details`);
              } else {
                navigate(`/${lang}/admin/swimming-times`);
              }
            }}
            disabled={isLoading}
          >
            {t('createTimes.cancelButton')}
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isLoading || success || filledTimesCount === 0}
          >
            {isLoading ? t('createTimes.saving') : success ? t('createTimes.saved') : t('createTimes.saveButton', { count: filledTimesCount })}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSwimmingTimes;