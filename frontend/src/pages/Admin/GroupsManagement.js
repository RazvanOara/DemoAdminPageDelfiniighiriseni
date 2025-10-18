import React, { useState, useEffect } from 'react';
import './GroupsManagement.css';

// Mock groups data
let MOCK_GROUPS = [
  {
    id: 1,
    name: 'Grupa A - Avansați',
    description: 'Grup pentru înotători avansați cu experiență competițională',
    color: '#00d4ff',
    swimmerIds: [1, 2],
    swimmerCount: 2,
    swimmerNames: ['Popescu Alex', 'Ionescu David']
  },
  {
    id: 2,
    name: 'Grupa B - Competiție',
    description: 'Înotători de performanță pregătiți pentru competiții',
    color: '#ff6b6b',
    swimmerIds: [3, 5],
    swimmerCount: 2,
    swimmerNames: ['Georgescu Sofia', 'Marin Ana']
  },
  {
    id: 3,
    name: 'Grupa C - Performanță',
    description: 'Grup de înaltă performanță',
    color: '#4ecdc4',
    swimmerIds: [],
    swimmerCount: 0,
    swimmerNames: []
  }
];

// Mock swimmers (reuse from AdvancedSwimmers)
const MOCK_SWIMMERS = [
  { id: 1, cursantId: 1, cursantNume: 'Popescu Alex', groupId: 1 },
  { id: 2, cursantId: 2, cursantNume: 'Ionescu David', groupId: 1 },
  { id: 3, cursantId: 3, cursantNume: 'Georgescu Sofia', groupId: 2 },
  { id: 4, cursantId: 5, cursantNume: 'Dumitrescu Ioana', groupId: null },
  { id: 5, cursantId: 7, cursantNume: 'Marin Ana', groupId: 2 }
];

const GroupsManagement = () => {
  const [groups, setGroups] = useState([]);
  const [availableSwimmers, setAvailableSwimmers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState('list');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#00d4ff',
    swimmerIds: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGroups();
    fetchAvailableSwimmers();
  }, []);

  const fetchGroups = () => {
    setIsLoading(true);
    setTimeout(() => {
      setGroups([...MOCK_GROUPS]);
      setIsLoading(false);
    }, 300);
  };

  const fetchAvailableSwimmers = () => {
    setTimeout(() => {
      setAvailableSwimmers([...MOCK_SWIMMERS]);
    }, 300);
  };

  const handleCreateGroup = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const newId = Math.max(...MOCK_GROUPS.map(g => g.id), 0) + 1;
      const swimmerNames = MOCK_SWIMMERS
        .filter(s => formData.swimmerIds.includes(s.id))
        .map(s => s.cursantNume);

      const newGroup = {
        id: newId,
        name: formData.name,
        description: formData.description,
        color: formData.color,
        swimmerIds: formData.swimmerIds,
        swimmerCount: formData.swimmerIds.length,
        swimmerNames
      };

      MOCK_GROUPS.push(newGroup);

      // Update swimmers' groupId
      formData.swimmerIds.forEach(swimmerId => {
        const swimmer = MOCK_SWIMMERS.find(s => s.id === swimmerId);
        if (swimmer) swimmer.groupId = newId;
      });

      fetchGroups();
      fetchAvailableSwimmers();
      resetForm();
      setActiveView('list');
      setIsLoading(false);
    }, 500);
  };

  const handleUpdateGroup = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const groupIndex = MOCK_GROUPS.findIndex(g => g.id === selectedGroup.id);
      if (groupIndex !== -1) {
        const swimmerNames = MOCK_SWIMMERS
          .filter(s => formData.swimmerIds.includes(s.id))
          .map(s => s.cursantNume);

        MOCK_GROUPS[groupIndex] = {
          ...MOCK_GROUPS[groupIndex],
          name: formData.name,
          description: formData.description,
          color: formData.color,
          swimmerIds: formData.swimmerIds,
          swimmerCount: formData.swimmerIds.length,
          swimmerNames
        };

        // Update all swimmers: remove from old group, add to new
        MOCK_SWIMMERS.forEach(swimmer => {
          if (swimmer.groupId === selectedGroup.id) {
            swimmer.groupId = null;
          }
        });

        formData.swimmerIds.forEach(swimmerId => {
          const swimmer = MOCK_SWIMMERS.find(s => s.id === swimmerId);
          if (swimmer) swimmer.groupId = selectedGroup.id;
        });
      }

      fetchGroups();
      fetchAvailableSwimmers();
      resetForm();
      setActiveView('list');
      setIsLoading(false);
    }, 500);
  };

  const handleDeleteGroup = (groupId) => {
    if (!window.confirm('Sigur vrei să ștergi acest grup? (Mock)')) return;

    setIsLoading(true);

    setTimeout(() => {
      const groupIndex = MOCK_GROUPS.findIndex(g => g.id === groupId);
      if (groupIndex !== -1) {
        MOCK_GROUPS.splice(groupIndex, 1);
        
        // Remove groupId from swimmers
        MOCK_SWIMMERS.forEach(swimmer => {
          if (swimmer.groupId === groupId) {
            swimmer.groupId = null;
          }
        });
      }

      fetchGroups();
      fetchAvailableSwimmers();
      setIsLoading(false);
    }, 300);
  };

  const handleEditGroup = (group) => {
    setSelectedGroup(group);
    setFormData({
      name: group.name,
      description: group.description || '',
      color: group.color || '#00d4ff',
      swimmerIds: group.swimmerIds || []
    });
    setActiveView('edit');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#00d4ff',
      swimmerIds: []
    });
    setSelectedGroup(null);
    setError(null);
  };

  const toggleSwimmer = (swimmerId) => {
    setFormData(prev => ({
      ...prev,
      swimmerIds: prev.swimmerIds.includes(swimmerId)
        ? prev.swimmerIds.filter(id => id !== swimmerId)
        : [...prev.swimmerIds, swimmerId]
    }));
  };

  const filteredSwimmers = availableSwimmers.filter(swimmer =>
    swimmer.cursantNume?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderListView = () => (
    <div className="gm-list-view">
      <div className="gm-header">
        <div className="gm-header-content">
          <h1 className="gm-title">Gestionare Grupuri (Demo)</h1>
          <p className="gm-subtitle">{groups.length} {groups.length === 1 ? 'grup' : 'grupuri'}</p>
        </div>
        <button className="gm-btn gm-btn-primary gm-btn-icon" onClick={() => setActiveView('create')}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Grup Nou</span>
        </button>
      </div>

      {error && (
        <div className="gm-alert gm-alert-error">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="gm-alert-close">×</button>
        </div>
      )}

      {isLoading ? (
        <div className="gm-loading">
          <div className="gm-spinner"></div>
        </div>
      ) : groups.length === 0 ? (
        <div className="gm-empty">
          <div className="gm-empty-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="24" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M20 44C20 38.4772 24.4772 34 30 34H34C39.5228 34 44 38.4772 44 44V48H20V44Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h3>Nu există grupuri</h3>
          <p>Creează primul grup pentru a organiza înotătorii avansați</p>
          <button className="gm-btn gm-btn-primary" onClick={() => setActiveView('create')}>
            Creează Primul Grup
          </button>
        </div>
      ) : (
        <div className="gm-grid">
          {groups.map(group => (
            <div key={group.id} className="gm-card">
              <div className="gm-card-color" style={{ backgroundColor: group.color }}></div>
              
              <div className="gm-card-header">
                <div className="gm-card-info">
                  <h3 className="gm-card-name">{group.name}</h3>
                  {group.description && (
                    <p className="gm-card-desc">{group.description}</p>
                  )}
                </div>
              </div>

              <div className="gm-card-stat">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M3 14C3 11.7909 4.79086 10 7 10H9C11.2091 10 13 11.7909 13 14" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                <span>{group.swimmerCount || 0} înotători</span>
              </div>

              {group.swimmerNames && group.swimmerNames.length > 0 && (
                <div className="gm-card-members">
                  {group.swimmerNames.slice(0, 2).map((name, idx) => (
                    <span key={idx} className="gm-member-tag">{name}</span>
                  ))}
                  {group.swimmerNames.length > 2 && (
                    <span className="gm-member-more">+{group.swimmerNames.length - 2}</span>
                  )}
                </div>
              )}

              <div className="gm-card-actions">
                <button className="gm-btn gm-btn-edit" onClick={() => handleEditGroup(group)}>
                  Editează
                </button>
                <button className="gm-btn gm-btn-delete" onClick={() => handleDeleteGroup(group.id)}>
                  Șterge
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderFormView = () => (
    <div className="gm-form-view">
      <div className="gm-form-header">
        <button className="gm-back-btn" onClick={() => { resetForm(); setActiveView('list'); }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div>
          <h1 className="gm-form-title">
            {activeView === 'create' ? 'Grup Nou (Demo)' : 'Editează Grup (Demo)'}
          </h1>
          <p className="gm-form-subtitle">
            {activeView === 'create' ? 'Creează un nou grup pentru înotători' : 'Modifică detaliile grupului'}
          </p>
        </div>
      </div>

      {error && (
        <div className="gm-alert gm-alert-error">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="gm-alert-close">×</button>
        </div>
      )}

      <form onSubmit={activeView === 'create' ? handleCreateGroup : handleUpdateGroup} className="gm-form">
        <div className="gm-form-section">
          <div className="gm-form-group">
            <label className="gm-label">Nume Grup *</label>
            <input
              type="text"
              className="gm-input"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="ex. Grup Performanță"
              required
            />
          </div>

          <div className="gm-form-group">
            <label className="gm-label">Descriere</label>
            <textarea
              className="gm-textarea"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descriere grup..."
              rows="3"
            />
          </div>

          <div className="gm-form-group">
            <label className="gm-label">Culoare Grup</label>
            <div className="gm-color-picker">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="gm-color-input"
              />
              <div className="gm-color-preview" style={{ backgroundColor: formData.color }}></div>
              <span className="gm-color-value">{formData.color.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="gm-form-section">
          <div className="gm-section-header">
            <h3 className="gm-section-title">Înotători</h3>
            <span className="gm-section-badge">{formData.swimmerIds.length} selectați</span>
          </div>
          
          <div className="gm-form-group">
            <div className="gm-search">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                className="gm-search-input"
                placeholder="Caută înotător..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="gm-swimmers">
            {filteredSwimmers.filter(swimmer => 
              !swimmer.groupId || (selectedGroup && swimmer.groupId === selectedGroup.id)
            ).length === 0 ? (
              <div className="gm-swimmers-empty">
                <p>Nu există înotători disponibili</p>
              </div>
            ) : (
              <div className="gm-swimmers-list">
                {filteredSwimmers
                  .filter(swimmer => !swimmer.groupId || (selectedGroup && swimmer.groupId === selectedGroup.id))
                  .map(swimmer => (
                    <label key={swimmer.id} className="gm-swimmer-item">
                      <div className="gm-swimmer-info">
                        <span className="gm-swimmer-name">
                          {swimmer.cursantNume || `Cursant ${swimmer.cursantId}`}
                        </span>
                        {swimmer.groupId && selectedGroup && swimmer.groupId === selectedGroup.id && (
                          <span className="gm-swimmer-badge">În acest grup</span>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.swimmerIds.includes(swimmer.id)}
                        onChange={() => toggleSwimmer(swimmer.id)}
                        className="gm-checkbox"
                      />
                    </label>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className="gm-form-actions">
          <button 
            type="button"
            className="gm-btn gm-btn-secondary"
            onClick={() => { resetForm(); setActiveView('list'); }}
          >
            Anulează
          </button>
          <button 
            type="submit"
            className="gm-btn gm-btn-primary"
            disabled={isLoading || !formData.name.trim()}
          >
            {isLoading ? 'Se salvează...' : (activeView === 'create' ? 'Creează Grup' : 'Actualizează Grup')}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="groups-management-container">
      {activeView === 'list' && renderListView()}
      {(activeView === 'create' || activeView === 'edit') && renderFormView()}
    </div>
  );
};

export default GroupsManagement;