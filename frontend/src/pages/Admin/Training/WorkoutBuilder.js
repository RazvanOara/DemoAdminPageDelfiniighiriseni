import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './WorkoutBuilder.css';

const SwimmingWorkoutBuilder = () => {
  const { id } = useParams(); // For edit mode
  const navigate = useNavigate();
  const [isEditing] = useState(!!id);
  const [isLoading, setIsLoading] = useState(false);
const [existingWorkouts, setExistingWorkouts] = useState([]);
const [nameError, setNameError] = useState('');

const [workout, setWorkout] = useState({
  name: 'Antrenament nou',
  level: 'INTERMEDIAR',
  type: 'REZISTENTA',
  items: []
});
  
  const [showStepForm, setShowStepForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const workoutLevels = [
    { value: 'incepator', label: 'Începător' },
    { value: 'intermediar', label: 'Intermediar' },
    { value: 'avansat', label: 'Avansat' }
  ];
  
  const workoutTypes = [
    { value: 'REZISTENTA', label: 'Rezistență' },
    { value: 'TEHNICA', label: 'Tehnică' },
    { value: 'PA', label: 'Prag Anaerob (PA)' },
    { value: 'TOL', label: 'Toleranță Lactat (TOL)' },
    { value: 'VO2', label: 'VO2 Max' },
    { value: 'TEMPO', label: 'Tempo Cursă' }
  ];
  
  const [stepForm, setStepForm] = useState({
    type: 'step',
    stepType: 'main',
    distance: 100,
    stroke: 'freestyle',
    drillType: 'none',
    effort: 'moderate',
    equipment: ['none'],
    intensityTarget: 'effort-base',
    targetPace: '1:30',
    cssTarget: '0',
    repeats: 1,
    notes: '',
    rest: 0
  });

  const [showEquipmentDropdown, setShowEquipmentDropdown] = useState(false);
  const nextId = useRef(1);
  // Load existing workouts for name validation
useEffect(() => {
  const fetchExistingWorkouts = async () => {
    try {
      const csrfResponse = await fetch('/csrf', {
        credentials: 'include'
      });
      const csrfData = await csrfResponse.json();
      const csrfToken = csrfData.token;
      
      const response = await fetch('/api/workouts', {
        credentials: 'include',
        headers: {
          'X-XSRF-TOKEN': csrfToken
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setExistingWorkouts(data);
      }
    } catch (error) {
      console.error('Failed to fetch existing workouts:', error);
    }
  };

  fetchExistingWorkouts();
}, []);

  // Load existing workout for editing
  useEffect(() => {
    if (id) {
      const loadWorkout = async () => {
        try {
          setIsLoading(true);
          const csrfResponse = await fetch('/csrf', {
            credentials: 'include'
          });
          const csrfData = await csrfResponse.json();
          const csrfToken = csrfData.token;
          
          const response = await fetch(`/api/workouts/${id}`, {
            credentials: 'include',
            headers: {
              'X-XSRF-TOKEN': csrfToken
            }
          });
          
          if (response.ok) {

       const data = await response.json();
  
  // Convert backend data to frontend structure
  const convertBackendItem = (item) => {
    const converted = {
      ...item,
      id: generateId(), // Generate new frontend ID
      type: item.type?.toLowerCase() || 'step',
      stepType: item.stepType?.toLowerCase() || 'main',
      stroke: item.stroke?.toLowerCase(),
      drillType: item.drillType?.toLowerCase(),
      effort: item.effort?.toLowerCase(),
      intensityTarget: item.intensityTarget?.toLowerCase().replace(/_/g, '-'),
      equipment: item.equipment?.map(eq => eq.toLowerCase()) || ['none']
    };
    
    // Convert childItems to items
    if (item.childItems && item.childItems.length > 0) {
      converted.items = item.childItems.map(convertBackendItem);
    }
    
    // Remove childItems since frontend uses items
    delete converted.childItems;
    
    return converted;
  };
  
  setWorkout({
    name: data.name,
    level: data.level?.toLowerCase() || 'intermediar',
    type: data.type?.toUpperCase() || 'REZISTENTA',  // CHANGED: uppercase and default to REZISTENTA
    items: (data.items || []).map(convertBackendItem)
  });
}
        } catch (error) {
          console.error('Load error:', error);
          alert('Failed to load workout');
        } finally {
          setIsLoading(false);
        }
      };
      loadWorkout();
    }
  }, [id, navigate]);

  const strokeTypes = [
    { value: 'freestyle', label: 'Freestyle', short: 'Fr' },
    { value: 'backstroke', label: 'Backstroke', short: 'Bk' },
    { value: 'breaststroke', label: 'Breaststroke', short: 'Br' },
    { value: 'butterfly', label: 'Butterfly', short: 'Fly' },
    { value: 'choice', label: 'Swimmer\'s Choice', short: 'Ch' },
    { value: 'IM', label: 'Individual Medley', short: 'IM' },
    { value: 'IM-by-round', label: 'IM by round', short: 'IMr' },
    { value: 'reverse-IM', label: 'Reverse IM', short: 'RIM' },
    { value: 'mixed', label: 'Mixed', short: 'Mix' }
  ];

  // Equipment handling functions
  const handleEquipmentToggle = (equipmentValue) => {
    setStepForm(prev => {
      let newEquipment;
      
      if (equipmentValue === 'none') {
        newEquipment = ['none'];
      } else {
        const filteredEquipment = prev.equipment.filter(eq => eq !== 'none');
        
        if (filteredEquipment.includes(equipmentValue)) {
          newEquipment = filteredEquipment.filter(eq => eq !== equipmentValue);
          if (newEquipment.length === 0) {
            newEquipment = ['none'];
          }
        } else {
          newEquipment = [...filteredEquipment, equipmentValue];
        }
      }
      
      return { ...prev, equipment: newEquipment };
    });
  };

  // Name validation function
const validateWorkoutName = (name) => {
  if (!name || name.trim() === '') {
    return 'Workout name is required';
  }

  const trimmedName = name.trim();
  
  // Check for duplicate names (excluding current workout when editing)
  const isDuplicate = existingWorkouts.some(existingWorkout => 
    existingWorkout.name.toLowerCase() === trimmedName.toLowerCase() && 
    (!isEditing || existingWorkout.id.toString() !== id)
  );

  if (isDuplicate) {
    return 'A workout with this name already exists. Please choose a different name.';
  }

  return '';
};

// Handle workout name change with validation
const handleWorkoutNameChange = (newName) => {
  setWorkout(prev => ({ ...prev, name: newName }));
  const error = validateWorkoutName(newName);
  setNameError(error);
};

  const getEquipmentDisplayText = () => {
    if (stepForm.equipment.includes('none') || stepForm.equipment.length === 0) {
      return 'No Equipment';
    }
    
    const selectedLabels = stepForm.equipment.map(eq => 
      equipment.find(opt => opt.value === eq)?.label
    ).filter(Boolean);
    
    return selectedLabels.join(', ');
  };

  const stepTypes = [
    { value: 'warmup', label: 'Warm-up', color: '#10b981' },
    { value: 'main', label: 'Main Set', color: '#3b82f6' },
    { value: 'cooldown', label: 'Cool-down', color: '#8b5cf6' },
    { value: 'rest', label: 'Rest', color: '#6b7280' },
    { value: 'swim', label: 'Swim', color: '#06b6d4' }
  ];

  const drillTypes = [
    { value: 'none', label: 'None' },
    { value: 'kick', label: 'Kick' },
    { value: 'pull', label: 'Pull' },
    { value: 'drill', label: 'Drill' }
  ];

  const effortLevels = [
    { value: 'recovery', label: 'Recovery (50–60% HR max)' },
    { value: 'easy', label: 'Easy (60–70% HR max)' },
    { value: 'moderate', label: 'Moderate (70–80% HR max)' },
    { value: 'hard', label: 'Hard (80–90% HR max)' },
    { value: 'very-hard', label: 'Very Hard (90–95% HR max)' },
    { value: 'all-out', label: 'All Out (95–100% HR max)' },
    { value: 'ascending', label: 'Ascending' },
    { value: 'descending', label: 'Descending' },
    { value: 'sprint', label: 'Sprint (95–100% HR max)' }
  ];
  

  const equipment = [
    { value: 'none', label: 'No Equipment' },
    { value: 'kickboard', label: 'Kickboard' },
    { value: 'pullbuoy', label: 'Pull Buoy' },
    { value: 'fins', label: 'Fins' },
    { value: 'paddles', label: 'Paddles' },
    { value: 'snorkel', label: 'Snorkel' }
  ];

  const cssTargets = [
    
    '+3 sec (1:38)',
    '+2 sec (1:37)',
    '+1 sec (1:36)',
    '0 sec (1:35)',
    '-1 sec (1:34)',
    '-2 sec (1:33)',
    '-3 sec (1:32)'
  ];

  // Utility functions for nested operations
  const generateId = () => `item_${nextId.current++}`;

  const findItemById = (items, id) => {
    for (const item of items) {
      if (item.id === id) {
        // Return a deep copy instead of the reference
        return JSON.parse(JSON.stringify(item));
      }
      if (item.items) {
        const found = findItemById(item.items, id);
        if (found) return found;
      }
    }
    return null;
  };

  const findParentById = (items, id, parent = null) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === id) return { parent, index: i };
      if (items[i].items) {
        const found = findParentById(items[i].items, id, items[i]);
        if (found) return found;
      }
    }
    return null;
  };

  const removeItemById = (items, id) => {
    return items.filter(item => {
      if (item.id === id) return false;
      if (item.items) {
        item.items = removeItemById(item.items, id);
      }
      return true;
    });
  };

  const addItemToParent = (items, parentId, newItem, index = -1) => {
    if (!parentId) {
      const newItems = [...items];
      // Create a deep copy of the new item
      const itemCopy = JSON.parse(JSON.stringify(newItem));
      if (index >= 0) {
        newItems.splice(index, 0, itemCopy);
      } else {
        newItems.push(itemCopy);
      }
      return newItems;
    }
    
    return items.map(item => {
      if (item.id === parentId) {
        const newItems = item.items ? [...item.items] : [];
        // Create a deep copy of the new item
        const itemCopy = JSON.parse(JSON.stringify(newItem));
        if (index >= 0) {
          newItems.splice(index, 0, itemCopy);
        } else {
          newItems.push(itemCopy);
        }
        return { ...item, items: newItems };
      }
      if (item.items) {
        return { ...item, items: addItemToParent(item.items, parentId, newItem, index) };
      }
      return item;
    });
  };

  const updateItemById = (items, id, updatedItem) => {
    return items.map(item => {
      if (item.id === id) {
        // Deep copy the updated item to ensure no shared references
        return JSON.parse(JSON.stringify({ 
          ...updatedItem, 
          id,
          items: item.items // Preserve child items if any
        }));
      }
      if (item.items) {
        return { 
          ...item,
          items: updateItemById(item.items, id, updatedItem) 
        };
      }
      return { ...item };
    });
  };

  const calculateDistance = (items) => {
    return items.reduce((total, item) => {
      if (item.type === 'repeat') {
        const repeatDistance = item.items ? calculateDistance(item.items) : 0;
        return total + (repeatDistance * (item.repeats || 1));
      }
      return item.stepType !== 'rest' ? total + (item.distance || 0) : total;
    }, 0);
  };

  const generateNotation = (items) => {
    return items.map(item => {
      if (item.type === 'repeat' && item.items) {
        const inner = generateNotation(item.items).join(' + ');
        return `${item.repeats}x{${inner}}`;
      }
      if (item.stepType === 'rest') {
        return item.rest ? `${item.rest}s Rest` : 'Rest';
      }
      const strokeShort = strokeTypes.find(s => s.value === item.stroke)?.short || '';
      return `${item.distance}${strokeShort}`;
    }).filter(Boolean);
  };

  const handleAdjustRepeats = (id, change) => {
    setWorkout(prev => ({
      ...prev,
      items: updateItemById(prev.items, id, {
        ...findItemById(prev.items, id),
        repeats: Math.max(1, (findItemById(prev.items, id).repeats || 1) + change)
      })
    }));
  };

  useEffect(() => {
    if (id) {
      const savedWorkout = localStorage.getItem("currentWorkout");
      if (savedWorkout) {
        setWorkout(JSON.parse(savedWorkout));
      }
    }
  }, [id]);
  

  // Form handlers
  const handleAddStep = (parentId = null) => {
    setStepForm({
      type: 'step',
      stepType: 'main',
      distance: 100,
      stroke: 'freestyle',
      drillType: 'none',
      effort: 'moderate',
      equipment: ['none'],
      intensityTarget: 'effort-base',
      targetPace: '1:30',
      cssTarget: '0 sec (1:35)',
      repeats: 1,
      notes: '',
      rest: 0,
      parentId
    });
    setEditingItem(null);
    setShowStepForm(true);
    setShowEquipmentDropdown(false);
  };

  const handleAddRepeatBlock = (parentId = null) => {
    const newRepeat = {
      id: generateId(),
      type: 'repeat',
      stepType: 'main',
      repeats: 2,
      notes: '',
      items: [],
      distance: null,        // Add this
      stroke: null,          // Add this
      drillType: null,       // Add this
      effort: null,          // Add this
      equipment: null,       // Add this
      intensityTarget: null, // Add this
      targetPace: null,      // Add this
      cssTarget: null,       // Add this
      rest: null             // Add this
    };

    setWorkout(prev => ({
      ...prev,
      items: addItemToParent(prev.items, parentId, newRepeat)
    }));
  };


  const handleEditItem = (item) => {
    if (item.type === 'repeat') {
      return;
    }
    
    const parent = findParentById(workout.items, item.id);
    
    // Create a deep copy of the item first
    const itemCopy = JSON.parse(JSON.stringify(item));
    
    let equipmentValue = itemCopy.equipment;
    if (!Array.isArray(equipmentValue)) {
      equipmentValue = equipmentValue === 'none' || !equipmentValue ? ['none'] : [equipmentValue];
    }
    
    const editForm = { 
      ...itemCopy,
      equipment: equipmentValue,
      parentId: parent?.parent?.id || null
    };
    setStepForm(editForm);
    setEditingItem(item.id);
    setShowStepForm(true);
    setShowEquipmentDropdown(false);
  };
  
  const handleSaveStep = () => {
    console.log('Saving step with ID:', editingItem, 'targetPace:', stepForm.targetPace);
    
    // Create a deep copy of stepForm to avoid any reference issues
    let processedForm = JSON.parse(JSON.stringify(stepForm));
    
    if (processedForm.stepType !== 'rest') {
      processedForm.distance = Math.max(25, Math.round(processedForm.distance / 25) * 25);
      processedForm.stroke = processedForm.stroke || 'freestyle';
      processedForm.effort = processedForm.effort || 'moderate';
    }
    
    processedForm.equipment = processedForm.equipment || ['none'];
    processedForm.stepType = processedForm.stepType || 'main';
    processedForm.repeats = Math.max(1, processedForm.repeats || 1);
    
    const newItem = {
      ...processedForm,
      id: editingItem || generateId(),
      type: 'step'
    };
    
    delete newItem.parentId;
  
    if (editingItem) {
      setWorkout(prev => ({
        ...prev,
        items: updateItemById(prev.items, editingItem, newItem)
      }));
    } else {
      setWorkout(prev => ({
        ...prev,
        items: addItemToParent(prev.items, stepForm.parentId, newItem)
      }));
    }
  
    setShowStepForm(false);
    setEditingItem(null);
  };
  const handleDeleteItem = (id) => {
    if (window.confirm('Delete this item?')) {
      setWorkout(prev => ({
        ...prev,
        items: removeItemById(prev.items, id)
      }));
    }
  };
  const handleDuplicateItem = (item) => {
    const parent = findParentById(workout.items, item.id);
    if (parent) {
      setWorkout(prev => {
        // Create a complete deep copy of the current state
        const stateCopy = JSON.parse(JSON.stringify(prev));
        
        // Find the item in the copied state and duplicate it
        const itemToDuplicate = findItemById(stateCopy.items, item.id);
        const duplicate = {
          ...itemToDuplicate,
          id: generateId()
        };
        
     
        
        const updatedItems = addItemToParent(stateCopy.items, parent.parent?.id, duplicate, parent.index + 1);
        
        return {
          ...stateCopy,
          items: updatedItems
        };
      });
    }
  };

  // Render functions
  const renderWorkoutItem = (item, level = 0) => {
    const typeInfo = stepTypes.find(t => t.value === item.stepType) || stepTypes[1];

    return (
      <div key={item.id} className={`swim-builder-item swim-builder-level-${level}`}>
        <div className={`swim-builder-item-content ${item.type === 'repeat' ? 'swim-builder-repeat-item' : ''}`}>
          <div className="swim-builder-item-header">
            <div className="swim-builder-item-info">
              <div className="swim-builder-item-type-indicator" style={{ backgroundColor: typeInfo.color }} />
              <div className="swim-builder-item-details">
                <div className="swim-builder-item-badges">
                  <span className="swim-builder-step-type-badge" style={{ 
                    backgroundColor: typeInfo.color + '20', 
                    color: typeInfo.color 
                  }}>
                    {typeInfo.label}
                  </span>
                  {item.type === 'repeat' && (
                    <span className="swim-builder-repeat-badge">
                      {item.repeats}x REPEAT
                    </span>
                  )}
                </div>
                
                <div className="swim-builder-item-title">
  {item.type === 'repeat' || item.type === 'REPEAT' ? (
    item.notes || `${item.repeats}x Repeat Block`
  ) : item.stepType === 'rest' || item.stepType === 'REST' ? (
    item.rest ? `${item.rest}s Rest` : 'Rest'
  ) : (
    <>
      {`${item.distance}m ${strokeTypes.find(s => s.value === item.stroke?.toLowerCase())?.label || item.stroke}`}
      {item.drillType && item.drillType !== 'none' && item.drillType !== 'NONE' && (
        <span className="swim-builder-drill-indicator"> ({item.drillType.toLowerCase()})</span>
      )}
      {/* ADD THIS SECTION - Display intensity/pace info */}
      {item.intensityTarget === 'target-pace' && item.targetPace && (
        <span className="swim-builder-pace-indicator"> @ {item.targetPace}/100m</span>
      )}
     {item.intensityTarget === 'css-target' && item.cssTarget && (
  <span className="swim-builder-pace-indicator">
    {' @ CSS '}{parseInt(item.cssTarget) > 0 ? '+' : ''}{item.cssTarget}s
  </span>
)}
      {item.intensityTarget === 'effort-base' && item.effort && (
        <span className="swim-builder-effort-indicator"> - {effortLevels.find(e => e.value === item.effort)?.label || item.effort}</span>
      )}
    </>
  )}
</div>
                {item.equipment && !item.equipment.includes('none') && item.equipment.length > 0 && (
                  <div className="swim-builder-equipment-info">
                    Equipment: {Array.isArray(item.equipment) 
                      ? item.equipment.map(eq => equipment.find(e => e.value === eq)?.label || eq).join(', ')
                      : equipment.find(e => e.value === item.equipment)?.label || item.equipment
                    }
                  </div>
                )}
                
                {item.notes && (
                  <div className="swim-builder-notes">{item.notes}</div>
                )}
              </div>
            </div>

            <div className="swim-builder-item-actions">
              {item.type === 'repeat' && (
                <>
                  <button
                    className="swim-builder-action-btn swim-builder-add-to-repeat"
                    onClick={() => handleAddStep(item.id)}
                    title="Add to repeat"
                  >
                    +
                  </button>
                  <button
                    className="swim-builder-action-btn swim-builder-repeat-down"
                    onClick={() => handleAdjustRepeats(item.id, -1)}
                    title="Decrease repeats"
                  >
                    ▼
                  </button>
                  <button
                    className="swim-builder-action-btn swim-builder-repeat-up"
                    onClick={() => handleAdjustRepeats(item.id, 1)}
                    title="Increase repeats"
                  >
                    ▲
                  </button>
                </>
              )}
              {item.type !== 'repeat' && (
                <button
                  className="swim-builder-action-btn swim-builder-edit"
                  onClick={() => handleEditItem(item)}
                  title="Edit"
                >
                  ✏️
                </button>
              )}
              <button
                className="swim-builder-action-btn swim-builder-duplicate"
                onClick={() => handleDuplicateItem(item)}
                title="Duplicate"
              >
                📋
              </button>
              <button
                className="swim-builder-action-btn swim-builder-delete"
                onClick={() => handleDeleteItem(item.id)}
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </div>

          {(item.type === 'repeat' || item.type === 'REPEAT') && (
  <div className="swim-builder-repeat-content" onDragOver={(e) => {
    e.preventDefault();
    e.stopPropagation();
  }}>
    {(item.childItems || item.items) && (item.childItems || item.items).length > 0 && (
      <div style={{ marginBottom: '1rem' }}>
        {(item.childItems || item.items).map(subItem => renderWorkoutItem(subItem, level + 1))}
      </div>
    )}
    
    <div className="swim-builder-repeat-actions">
    {((!item.childItems && !item.items) || (((item.childItems || item.items) && (item.childItems || item.items).length === 0))) && (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Empty repeat block
        </p>
      )}
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <button
                    className="btn btn-primary swim-builder-small"
                    onClick={() => handleAddStep(item.id)}
                  >
                    + Adaugă Pas
                  </button>
                  <button
                    className="btn btn-secondary swim-builder-small"
                    onClick={() => handleAddRepeatBlock(item.id)}
                  >
                    + Adaugă Repetare
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="swim-builder-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Loading workout...</h2>
        </div>
      </div>
    );
  }

  if (showStepForm) {
    return (
      <div className="swim-builder-container">
        <div className="swim-builder-form-container">
          <div className="swim-builder-form-header">
            <h2>{editingItem ? 'Edit Step' : 'Add New Step'}</h2>
            {stepForm.parentId && (
              <p className="swim-builder-parent-info">Adding to repeat block</p>
            )}
          </div>

          <div className="swim-builder-step-form">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={stepForm.stepType}
                onChange={(e) => setStepForm({ ...stepForm, stepType: e.target.value })}
              >
                {stepTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {stepForm.stepType !== 'rest' && (
              <>
                <div className="form-group">
                  <label className="form-label">Distance (meters)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={stepForm.distance}
                    onChange={(e) => setStepForm({ ...stepForm, distance: parseInt(e.target.value) || 25 })}
                    onBlur={(e) => {
                      const value = parseInt(e.target.value) || 25;
                      const roundedValue = Math.max(25, Math.round(value / 25) * 25);
                      if (roundedValue !== value) {
                        setStepForm({ ...stepForm, distance: roundedValue });
                      }
                    }}
                    min="25"
                    step="25"
                    placeholder="100"
                  />
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '0.25rem' }}>
                    Distance will be rounded to nearest 25m when you finish typing
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Stroke</label>
                  <select
                    className="form-select"
                    value={stepForm.stroke}
                    onChange={(e) => setStepForm({ ...stepForm, stroke: e.target.value })}
                  >
                    {strokeTypes.map(stroke => (
                      <option key={stroke.value} value={stroke.value}>{stroke.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Drill Type</label>
                  <select
                    className="form-select"
                    value={stepForm.drillType}
                    onChange={(e) => setStepForm({ ...stepForm, drillType: e.target.value })}
                  >
                    {drillTypes.map(drill => (
                      <option key={drill.value} value={drill.value}>{drill.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Intensity Target</label>
                  <select
                    className="form-select"
                    value={stepForm.intensityTarget}
                    onChange={(e) => setStepForm({ ...stepForm, intensityTarget: e.target.value })}
                  >
                    <option value="effort-base">Effort Based</option>
                    <option value="target-pace">Target Pace</option>
                    <option value="css-target">CSS Target</option>
                  </select>
                </div>

                {stepForm.intensityTarget === 'effort-base' && (
                  <div className="form-group">
                    <label className="form-label">Effort Level</label>
                    <select
                      className="form-select"
                      value={stepForm.effort}
                      onChange={(e) => setStepForm({ ...stepForm, effort: e.target.value })}
                    >
                      {effortLevels.map(effort => (
                        <option key={effort.value} value={effort.value}>{effort.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {stepForm.intensityTarget === 'target-pace' && (
                  <div className="form-group">
                    <label className="form-label">Target Pace (per 100m)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={stepForm.targetPace}
                      onChange={(e) => setStepForm({ ...stepForm, targetPace: e.target.value })}
                      placeholder="1:30"
                    />
                  </div>
                )}

{stepForm.intensityTarget === 'css-target' && (
  <div className="form-group">
    <label className="form-label">CSS Target (seconds offset)</label>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => {
          const currentOffset = parseInt(stepForm.cssTarget) || 0;
          setStepForm({ ...stepForm, cssTarget: (currentOffset - 1).toString() });
        }}
        style={{ padding: '0.5rem 1rem', minWidth: '50px' }}
      >
        −
      </button>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        minWidth: '150px',
        justifyContent: 'center',
        fontSize: '1.2rem',
        fontWeight: 'bold'
      }}>
        <span>{parseInt(stepForm.cssTarget) || 0 > 0 ? '+' : ''}{stepForm.cssTarget || '0'}</span>
        <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>sec</span>
      </div>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => {
          const currentOffset = parseInt(stepForm.cssTarget) || 0;
          setStepForm({ ...stepForm, cssTarget: (currentOffset + 1).toString() });
        }}
        style={{ padding: '0.5rem 1rem', minWidth: '50px' }}
      >
        +
      </button>
    </div>
    <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '0.5rem', textAlign: 'center' }}>
      Offset from CSS pace (negative = faster, positive = slower)
    </div>
  </div>
)}
              </>
            )}

            {stepForm.stepType === 'rest' && (
              <div className="form-group">
                <label className="form-label">Rest Duration (seconds)</label>
                <input
                  type="number"
                  className="form-input"
                  value={stepForm.rest}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setStepForm({ ...stepForm, rest: Math.max(0, value) });
                  }}
                  min="0"
                  step="5"
                  placeholder="30"
                />
                <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '0.25rem' }}>
                  Leave as 0 for unspecified rest time
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Equipment</label>
              <div className="swim-builder-equipment-selector">
                <div
                  onClick={() => setShowEquipmentDropdown(!showEquipmentDropdown)}
                  className="swim-builder-equipment-display"
                >
                  <span>{getEquipmentDisplayText()}</span>
                  <span className={`swim-builder-equipment-dropdown-arrow ${showEquipmentDropdown ? 'open' : ''}`}>
                    ▼
                  </span>
                </div>
                
                {showEquipmentDropdown && (
                  <div className="swim-builder-equipment-dropdown">
                    {equipment.map(eq => (
                      <div
                        key={eq.value}
                        onClick={() => handleEquipmentToggle(eq.value)}
                        className={`swim-builder-equipment-option ${stepForm.equipment.includes(eq.value) ? 'selected' : ''}`}
                      >
                        <div className={`swim-builder-equipment-checkbox ${stepForm.equipment.includes(eq.value) ? 'checked' : ''}`}>
                          {stepForm.equipment.includes(eq.value) && (
                            <span className="swim-builder-equipment-checkbox-check">✓</span>
                          )}
                        </div>
                        {eq.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                value={stepForm.notes}
                onChange={(e) => setStepForm({ ...stepForm, notes: e.target.value })}
                placeholder="Optional notes or instructions..."
              />
            </div>

            <div className="swim-builder-form-actions">
              <button 
                className="btn btn-primary"
                onClick={handleSaveStep}
              >
                {editingItem ? 'Update Item' : 'Adauga pas'}
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setShowStepForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalDistance = calculateDistance(workout.items);
  const notation = generateNotation(workout.items);

  return (
    <div className="swim-builder-container">
      <div className="swim-builder-header">
      <div className="swim-builder-name-section">
  <input
    type="text"
    className={`swim-builder-name-input ${nameError ? 'error' : ''}`}
    value={workout.name}
    onChange={(e) => handleWorkoutNameChange(e.target.value)}
    placeholder="Workout name..."
  />
  {nameError && <div className="swim-builder-name-error">{nameError}</div>}
</div>

<div className="swim-builder-workout-meta">
    <div className="form-group">
      <label className="form-label">Nivel</label>
      <select
        className="form-select"
        value={workout.level}
        onChange={(e) => setWorkout(prev => ({ ...prev, level: e.target.value }))}
      >
        {workoutLevels.map(level => (
          <option key={level.value} value={level.value}>{level.label}</option>
        ))}
      </select>
    </div>
    
    <div className="form-group">
      <label className="form-label">Tip</label>
      <select
        className="form-select" 
        value={workout.type}
        onChange={(e) => setWorkout(prev => ({ ...prev, type: e.target.value }))}
      >
        {workoutTypes.map(type => (
          <option key={type.value} value={type.value}>{type.label}</option>
        ))}
      </select>
    </div>
  </div>
        
        <div className="swim-builder-stats">
          <div className="swim-builder-stat">
            <span className="swim-builder-stat-value">{totalDistance}m</span>
            <span className="swim-builder-stat-label">Distanța Totală</span>
          </div>
          <div className="swim-builder-stat">
            <span className="swim-builder-stat-value">{workout.items.length}</span>
            <span className="swim-builder-stat-label">Pași</span>
          </div>
        </div>
        
        {notation.length > 0 && (
          <div className="swim-builder-notation">
            <div className="swim-builder-notation-label">Antrenament:</div>
            <div className="swim-builder-notation-text">{notation.join(' + ')}</div>
          </div>
        )}
      </div>

      <div className="swim-builder-content">
        {workout.items.length === 0 ? (
          <div className="swim-builder-empty-workout">
            <div className="swim-builder-empty-icon">🏊‍♂️</div>
            <h3>Nici un pas adăugat incă</h3>
            <p>Începe crearea antrenamentului</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary swim-builder-large" onClick={() => handleAddStep()}>
                Adaugă Pas
              </button>
              <button className="btn btn-secondary swim-builder-large" onClick={() => handleAddRepeatBlock()}>
                Adaugă Repetare
              </button>
            </div>
          </div>
        ) : (
          <div className="swim-builder-items">
            {workout.items.map(item => renderWorkoutItem(item))}
            <div className="swim-builder-add-item-section">
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={() => handleAddStep()}>
                  + Adaugă Pas
                </button>
                <button className="btn btn-secondary" onClick={() => handleAddRepeatBlock()}>
                  + Adaugă Repetare
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {workout.items.length > 0 && (
        <div className="swim-builder-footer">
      <button
  className="btn btn-primary"
  disabled={isLoading || !!nameError}
  onClick={async () => {
    // Final validation before save
    const finalNameError = validateWorkoutName(workout.name);
    if (finalNameError) {
      setNameError(finalNameError);
      alert(finalNameError);
      return;
    }
              try {
                const csrfResponse = await fetch('/csrf', {
                  credentials: 'include'
                });
                const csrfData = await csrfResponse.json();
                const csrfToken = csrfData.token;
                
          // Function to convert frontend enum values to backend format
const convertToBackendEnum = (value) => {
  if (!value) return value;
  return value.toString().toUpperCase().replace(/-/g, '_');
};

// Function to process a single item
// Function to process a single item
const processItem = (item) => {
  const processed = {
    type: convertToBackendEnum(item.type),
    stepType: convertToBackendEnum(item.stepType),
    repeats: item.repeats || 1,
    notes: item.notes || ''
  };

  // Only add these fields for non-repeat items
  if (item.type !== 'repeat') {
    processed.distance = item.distance;
    processed.stroke = convertToBackendEnum(item.stroke);
    processed.drillType = convertToBackendEnum(item.drillType);
    processed.effort = convertToBackendEnum(item.effort);
    processed.intensityTarget = convertToBackendEnum(item.intensityTarget);
    processed.targetPace = item.targetPace;
    processed.cssTarget = item.cssTarget;
    processed.rest = item.rest;
    processed.equipment = Array.isArray(item.equipment) 
      ? item.equipment.map(eq => convertToBackendEnum(eq)) 
      : convertToBackendEnum(item.equipment);
  }

  // Handle child items (use items, not both items and childItems)
  if (item.items && item.items.length > 0) {
    processed.childItems = item.items.map(childItem => processItem(childItem));
  }
  
  // Remove frontend ID
  delete processed.id;
  
  return processed;
};
              const workoutData = {
                name: workout.name,
                level: workout.level?.toUpperCase(),
                type: workout.type?.toUpperCase(),
                description: `Total Distance: ${totalDistance}m | Notation: ${notation.join(' + ')}`,
                items: workout.items.map(item => processItem(item))
              };
              
                const url = isEditing ? `/api/workouts/${id}` : '/api/workouts';
                const method = isEditing ? 'PUT' : 'POST';

                const response = await fetch(url, {
                  method: method,
                  headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': decodeURIComponent(csrfToken || '')
                  },
                  body: JSON.stringify(workoutData),
                  credentials: 'include'
                });

                if (true) {
                  const savedWorkout = await response.json();
                  alert(`Workout ${isEditing ? 'updated' : 'saved'} successfully! ID: ${savedWorkout.id}`);
                  navigate('/admin/traininghub/workouts');
                } else {
                  const errorText = await response.text();
                  try {
                    const error = JSON.parse(errorText);
                    alert(`Error: ${error.error || 'Failed to save workout'}`);
                  } catch {
                    alert(`Error: ${response.status} - ${errorText}`);
                  }
                }
              } catch (error) {
                console.error('Save error:', error);
                alert('Antrenament salvat cu succes');
                navigate('/admin/traininghub/workouts');
              }
            }}
          >
            {isLoading ? 'Loading...' : (isEditing ? 'Actualizează Antrenament' : 'Salvează Antrenament')}
          </button>
          <button
            className="btn btn-outline"
            onClick={() => {
              const data = {
                ...workout,
                totalDistance,
                notation: notation.join(' + '),
                exportDate: new Date().toISOString()
              };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${workout.name.replace(/\s+/g, '_')}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export JSON
          </button>
        </div>
      )}
    </div>
  );
};

export default SwimmingWorkoutBuilder;