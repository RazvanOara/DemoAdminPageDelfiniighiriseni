import React, { useState, useEffect } from 'react';
import './GroupsManagement.css';

// ADD: Mock groups data
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

// ADD: Mock swimmers (reuse from AdvancedSwimmers)
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

  // REPLACED: Fetch with mock data loading
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

  // REPLACED: Create group with mock implementation
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

  // REPLACED: Update group with mock implementation
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

  // REPLACED: Delete group with mock implementation
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
    <div className="groups-list-view">
      <div className="list-header">
        <h2 className="page-title">Gestionare Grupuri (Demo)</h2>
        <button className="btn btn-primary" onClick={() => setActiveView('create')}>
          + Creează Grup Nou
        </button>
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : groups.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>Nu există grupuri create</h3>
          <p>Creează primul grup pentru a organiza înotătorii avansați</p>
          <button className="btn btn-primary" onClick={() => setActiveView('create')}>
            Creează Primul Grup
          </button>
        </div>
      ) : (
        <div className="groups-grid">
          {groups.map(group => (
            <div key={group.id} className="group-card" style={{ borderLeftColor: group.color }}>
              <div className="group-header">
                <div className="group-color" style={{ backgroundColor: group.color }}></div>
                <div className="group-info">
                  <h3 className="group-name">{group.name}</h3>
                  {group.description && (
                    <p className="group-description">{group.description}</p>
                  )}
                </div>
              </div>

              <div className="group-stats">
                <div className="stat">
                  <span className="stat-label">Înotători</span>
                  <span className="stat-value">{group.swimmerCount || 0}</span>
                </div>
              </div>

              {group.swimmerNames && group.swimmerNames.length > 0 && (
                <div className="group-swimmers">
                  <h4>Membri:</h4>
                  <div className="swimmer-tags">
                    {group.swimmerNames.slice(0, 3).map((name, idx) => (
                      <span key={idx} className="swimmer-tag">{name}</span>
                    ))}
                    {group.swimmerNames.length > 3 && (
                      <span className="swimmer-tag more">+{group.swimmerNames.length - 3}</span>
                    )}
                  </div>
                </div>
              )}

              <div className="group-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => handleEditGroup(group)}
                >
                  Editează
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => handleDeleteGroup(group.id)}
                >
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
    <div className="groups-form-view">
      <div className="form-header">
        <button className="back-button" onClick={() => { resetForm(); setActiveView('list'); }}>
          ← Înapoi
        </button>
        <h2 className="page-title">
          {activeView === 'create' ? 'Creează Grup Nou (Demo)' : 'Editează Grup (Demo)'}
        </h2>
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <form onSubmit={activeView === 'create' ? handleCreateGroup : handleUpdateGroup} className="group-form">
        <div className="form-section">
          <h3 className="section-title">Informații Grup</h3>
          
          <div className="form-group">
            <label className="form-label">Nume Grup *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="ex. Grup Performanță"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Descriere</label>
            <textarea
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descriere grup..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Culoare Grup</label>
            <div className="color-picker-wrapper">
              <input
                type="color"
                className="color-picker"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              />
              <span className="color-preview" style={{ backgroundColor: formData.color }}></span>
              <span className="color-value">{formData.color}</span>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Selectează Înotători</h3>
          
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Caută înotător..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="swimmers-selection">
            {filteredSwimmers.filter(swimmer => 
              !swimmer.groupId || (selectedGroup && swimmer.groupId === selectedGroup.id)
            ).length === 0 ? (
              <p className="no-swimmers">Nu există înotători disponibili</p>
            ) : (
              <div className="swimmers-list">
                {filteredSwimmers
                  .filter(swimmer => !swimmer.groupId || (selectedGroup && swimmer.groupId === selectedGroup.id))
                  .map(swimmer => (
                    <div 
                      key={swimmer.id} 
                      className={`swimmer-item ${formData.swimmerIds.includes(swimmer.id) ? 'selected' : ''}`}
                      onClick={() => toggleSwimmer(swimmer.id)}
                    >
                      <div className="swimmer-info">
                        <span className="swimmer-name">{swimmer.cursantNume || `Cursant ${swimmer.cursantId}`}</span>
                        {swimmer.groupId && selectedGroup && swimmer.groupId === selectedGroup.id && (
                          <span className="current-group-badge">În acest grup</span>
                        )}
                      </div>
                      <div className="swimmer-checkbox">
                        {formData.swimmerIds.includes(swimmer.id) && '✓'}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="selected-count">
            Selectați: {formData.swimmerIds.length} înotători
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button"
            className="btn btn-secondary"
            onClick={() => { resetForm(); setActiveView('list'); }}
          >
            Anulează
          </button>
          <button 
            type="submit"
            className="btn btn-primary"
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