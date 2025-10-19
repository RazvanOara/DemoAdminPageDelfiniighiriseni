import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './WorkoutBuilder.css';

const SwimmingWorkoutBuilder = () => {
  const { t } = useTranslation();
  const { id, lang } = useParams();
  const navigate = useNavigate();
  const [isEditing] = useState(!!id);
  const [isLoading, setIsLoading] = useState(false);
  const [existingWorkouts, setExistingWorkouts] = useState([]);
  const [nameError, setNameError] = useState('');

  const [workout, setWorkout] = useState({
    name: t('workoutBuilder.defaultName'),
    level: 'INTERMEDIAR',
    type: 'REZISTENTA',
    items: []
  });
  
  const [showStepForm, setShowStepForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const workoutLevels = [
    { value: 'incepator', label: t('workoutBuilder.levels.beginner') },
    { value: 'intermediar', label: t('workoutBuilder.levels.intermediate') },
    { value: 'avansat', label: t('workoutBuilder.levels.advanced') }
  ];
  
  const workoutTypes = [
    { value: 'REZISTENTA', label: t('workoutBuilder.types.endurance') },
    { value: 'TEHNICA', label: t('workoutBuilder.types.technique') },
    { value: 'PA', label: t('workoutBuilder.types.anaerobicThreshold') },
    { value: 'TOL', label: t('workoutBuilder.types.lactateTolerance') },
    { value: 'VO2', label: t('workoutBuilder.types.vo2max') },
    { value: 'TEMPO', label: t('workoutBuilder.types.raceTempo') }
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
  
            const convertBackendItem = (item) => {
              const converted = {
                ...item,
                id: generateId(),
                type: item.type?.toLowerCase() || 'step',
                stepType: item.stepType?.toLowerCase() || 'main',
                stroke: item.stroke?.toLowerCase(),
                drillType: item.drillType?.toLowerCase(),
                effort: item.effort?.toLowerCase(),
                intensityTarget: item.intensityTarget?.toLowerCase().replace(/_/g, '-'),
                equipment: item.equipment?.map(eq => eq.toLowerCase()) || ['none']
              };
              
              if (item.childItems && item.childItems.length > 0) {
                converted.items = item.childItems.map(convertBackendItem);
              }
              
              delete converted.childItems;
              
              return converted;
            };
  
            setWorkout({
              name: data.name,
              level: data.level?.toLowerCase() || 'intermediar',
              type: data.type?.toUpperCase() || 'REZISTENTA',
              items: (data.items || []).map(convertBackendItem)
            });
          }
        } catch (error) {
          console.error('Load error:', error);
          alert(t('workoutBuilder.alerts.loadFailed'));
        } finally {
          setIsLoading(false);
        }
      };
      loadWorkout();
    }
  }, [id, navigate, t]);

  const strokeTypes = [
    { value: 'freestyle', label: t('workoutBuilder.strokes.freestyle'), short: 'Fr' },
    { value: 'backstroke', label: t('workoutBuilder.strokes.backstroke'), short: 'Bk' },
    { value: 'breaststroke', label: t('workoutBuilder.strokes.breaststroke'), short: 'Br' },
    { value: 'butterfly', label: t('workoutBuilder.strokes.butterfly'), short: 'Fly' },
    { value: 'choice', label: t('workoutBuilder.strokes.choice'), short: 'Ch' },
    { value: 'IM', label: t('workoutBuilder.strokes.im'), short: 'IM' },
    { value: 'IM-by-round', label: t('workoutBuilder.strokes.imByRound'), short: 'IMr' },
    { value: 'reverse-IM', label: t('workoutBuilder.strokes.reverseIm'), short: 'RIM' },
    { value: 'mixed', label: t('workoutBuilder.strokes.mixed'), short: 'Mix' }
  ];

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

  const validateWorkoutName = (name) => {
    if (!name || name.trim() === '') {
      return t('workoutBuilder.validation.nameRequired');
    }

    const trimmedName = name.trim();
    
    const isDuplicate = existingWorkouts.some(existingWorkout => 
      existingWorkout.name.toLowerCase() === trimmedName.toLowerCase() && 
      (!isEditing || existingWorkout.id.toString() !== id)
    );

    if (isDuplicate) {
      return t('workoutBuilder.validation.nameDuplicate');
    }

    return '';
  };

  const handleWorkoutNameChange = (newName) => {
    setWorkout(prev => ({ ...prev, name: newName }));
    const error = validateWorkoutName(newName);
    setNameError(error);
  };

  const getEquipmentDisplayText = () => {
    if (stepForm.equipment.includes('none') || stepForm.equipment.length === 0) {
      return t('workoutBuilder.equipment.none');
    }
    
    const selectedLabels = stepForm.equipment.map(eq => 
      equipment.find(opt => opt.value === eq)?.label
    ).filter(Boolean);
    
    return selectedLabels.join(', ');
  };

  const stepTypes = [
    { value: 'warmup', label: t('workoutBuilder.stepTypes.warmup'), color: '#10b981' },
    { value: 'main', label: t('workoutBuilder.stepTypes.mainSet'), color: '#3b82f6' },
    { value: 'cooldown', label: t('workoutBuilder.stepTypes.cooldown'), color: '#8b5cf6' },
    { value: 'rest', label: t('workoutBuilder.stepTypes.rest'), color: '#6b7280' },
    { value: 'swim', label: t('workoutBuilder.stepTypes.swim'), color: '#06b6d4' }
  ];

  const drillTypes = [
    { value: 'none', label: t('workoutBuilder.drillTypes.none') },
    { value: 'kick', label: t('workoutBuilder.drillTypes.kick') },
    { value: 'pull', label: t('workoutBuilder.drillTypes.pull') },
    { value: 'drill', label: t('workoutBuilder.drillTypes.drill') }
  ];

  const effortLevels = [
    { value: 'recovery', label: t('workoutBuilder.effortLevels.recovery') },
    { value: 'easy', label: t('workoutBuilder.effortLevels.easy') },
    { value: 'moderate', label: t('workoutBuilder.effortLevels.moderate') },
    { value: 'hard', label: t('workoutBuilder.effortLevels.hard') },
    { value: 'very-hard', label: t('workoutBuilder.effortLevels.veryHard') },
    { value: 'all-out', label: t('workoutBuilder.effortLevels.allOut') },
    { value: 'ascending', label: t('workoutBuilder.effortLevels.ascending') },
    { value: 'descending', label: t('workoutBuilder.effortLevels.descending') },
    { value: 'sprint', label: t('workoutBuilder.effortLevels.sprint') }
  ];

  const equipment = [
    { value: 'none', label: t('workoutBuilder.equipment.none') },
    { value: 'kickboard', label: t('workoutBuilder.equipment.kickboard') },
    { value: 'pullbuoy', label: t('workoutBuilder.equipment.pullbuoy') },
    { value: 'fins', label: t('workoutBuilder.equipment.fins') },
    { value: 'paddles', label: t('workoutBuilder.equipment.paddles') },
    { value: 'snorkel', label: t('workoutBuilder.equipment.snorkel') }
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

  const generateId = () => `item_${nextId.current++}`;

  const findItemById = (items, id) => {
    for (const item of items) {
      if (item.id === id) {
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
        return JSON.parse(JSON.stringify({ 
          ...updatedItem, 
          id,
          items: item.items
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
        return item.rest ? `${item.rest}s ${t('workoutBuilder.labels.rest')}` : t('workoutBuilder.labels.rest');
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
      distance: null,
      stroke: null,
      drillType: null,
      effort: null,
      equipment: null,
      intensityTarget: null,
      targetPace: null,
      cssTarget: null,
      rest: null
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
    if (window.confirm(t('workoutBuilder.alerts.confirmDelete'))) {
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
        const stateCopy = JSON.parse(JSON.stringify(prev));
        
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
  };// Continuing from Part 1...

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
                      {item.repeats}x {t('workoutBuilder.labels.repeat').toUpperCase()}
                    </span>
                  )}
                </div>
                
                <div className="swim-builder-item-title">
                  {item.type === 'repeat' || item.type === 'REPEAT' ? (
                    item.notes || `${item.repeats}x ${t('workoutBuilder.labels.repeatBlock')}`
                  ) : item.stepType === 'rest' || item.stepType === 'REST' ? (
                    item.rest ? `${item.rest}s ${t('workoutBuilder.labels.rest')}` : t('workoutBuilder.labels.rest')
                  ) : (
                    <>
                      {`${item.distance}m ${strokeTypes.find(s => s.value === item.stroke?.toLowerCase())?.label || item.stroke}`}
                      {item.drillType && item.drillType !== 'none' && item.drillType !== 'NONE' && (
                        <span className="swim-builder-drill-indicator"> ({item.drillType.toLowerCase()})</span>
                      )}
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
                    {t('workoutBuilder.labels.equipment')}: {Array.isArray(item.equipment) 
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
                    title={t('workoutBuilder.actions.addToRepeat')}
                  >
                    +
                  </button>
                  <button
                    className="swim-builder-action-btn swim-builder-repeat-down"
                    onClick={() => handleAdjustRepeats(item.id, -1)}
                    title={t('workoutBuilder.actions.decreaseRepeats')}
                  >
                    ▼
                  </button>
                  <button
                    className="swim-builder-action-btn swim-builder-repeat-up"
                    onClick={() => handleAdjustRepeats(item.id, 1)}
                    title={t('workoutBuilder.actions.increaseRepeats')}
                  >
                    ▲
                  </button>
                </>
              )}
              {item.type !== 'repeat' && (
                <button
                  className="swim-builder-action-btn swim-builder-edit"
                  onClick={() => handleEditItem(item)}
                  title={t('workoutBuilder.actions.edit')}
                >
                  ✏️
                </button>
              )}
              <button
                className="swim-builder-action-btn swim-builder-duplicate"
                onClick={() => handleDuplicateItem(item)}
                title={t('workoutBuilder.actions.duplicate')}
              >
                📋
              </button>
              <button
                className="swim-builder-action-btn swim-builder-delete"
                onClick={() => handleDeleteItem(item.id)}
                title={t('workoutBuilder.actions.delete')}
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
                    {t('workoutBuilder.labels.emptyRepeatBlock')}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <button
                    className="btn btn-primary swim-builder-small"
                    onClick={() => handleAddStep(item.id)}
                  >
                    + {t('workoutBuilder.buttons.addStep')}
                  </button>
                  <button
                    className="btn btn-secondary swim-builder-small"
                    onClick={() => handleAddRepeatBlock(item.id)}
                  >
                    + {t('workoutBuilder.buttons.addRepeat')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="swim-builder-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>{t('workoutBuilder.loading')}</h2>
        </div>
      </div>
    );
  }

  if (showStepForm) {
    return (
      <div className="swim-builder-container">
        <div className="swim-builder-form-container">
          <div className="swim-builder-form-header">
            <h2>{editingItem ? t('workoutBuilder.form.editStep') : t('workoutBuilder.form.addNewStep')}</h2>
            {stepForm.parentId && (
              <p className="swim-builder-parent-info">{t('workoutBuilder.form.addingToRepeat')}</p>
            )}
          </div>

          <div className="swim-builder-step-form">
            <div className="form-group">
              <label className="form-label">{t('workoutBuilder.form.category')}</label>
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
                  <label className="form-label">{t('workoutBuilder.form.distance')}</label>
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
                    {t('workoutBuilder.form.distanceHelper')}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('workoutBuilder.form.stroke')}</label>
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
                  <label className="form-label">{t('workoutBuilder.form.drillType')}</label>
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
                  <label className="form-label">{t('workoutBuilder.form.intensityTarget')}</label>
                  <select
                    className="form-select"
                    value={stepForm.intensityTarget}
                    onChange={(e) => setStepForm({ ...stepForm, intensityTarget: e.target.value })}
                  >
                    <option value="effort-base">{t('workoutBuilder.form.effortBased')}</option>
                    <option value="target-pace">{t('workoutBuilder.form.targetPace')}</option>
                    <option value="css-target">{t('workoutBuilder.form.cssTarget')}</option>
                  </select>
                </div>

                {stepForm.intensityTarget === 'effort-base' && (
                  <div className="form-group">
                    <label className="form-label">{t('workoutBuilder.form.effortLevel')}</label>
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
                    <label className="form-label">{t('workoutBuilder.form.targetPacePer100')}</label>
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
                    <label className="form-label">{t('workoutBuilder.form.cssTargetOffset')}</label>
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
                      {t('workoutBuilder.form.cssTargetHelper')}
                    </div>
                  </div>
                )}
              </>
            )}

            {stepForm.stepType === 'rest' && (
              <div className="form-group">
                <label className="form-label">{t('workoutBuilder.form.restDuration')}</label>
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
                  {t('workoutBuilder.form.restHelper')}
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">{t('workoutBuilder.form.equipment')}</label>
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
              <label className="form-label">{t('workoutBuilder.form.notes')}</label>
              <textarea
                className="form-textarea"
                value={stepForm.notes}
                onChange={(e) => setStepForm({ ...stepForm, notes: e.target.value })}
                placeholder={t('workoutBuilder.form.notesPlaceholder')}
              />
            </div>

            <div className="swim-builder-form-actions">
              <button 
                className="btn btn-primary"
                onClick={handleSaveStep}
              >
                {editingItem ? t('workoutBuilder.buttons.updateItem') : t('workoutBuilder.buttons.addStep')}
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setShowStepForm(false)}
              >
                {t('workoutBuilder.buttons.cancel')}
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
            placeholder={t('workoutBuilder.form.workoutNamePlaceholder')}
          />
          {nameError && <div className="swim-builder-name-error">{nameError}</div>}
        </div>

        <div className="swim-builder-workout-meta">
          <div className="form-group">
            <label className="form-label">{t('workoutBuilder.form.level')}</label>
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
            <label className="form-label">{t('workoutBuilder.form.type')}</label>
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
            <span className="swim-builder-stat-label">{t('workoutBuilder.stats.totalDistance')}</span>
          </div>
          <div className="swim-builder-stat">
            <span className="swim-builder-stat-value">{workout.items.length}</span>
            <span className="swim-builder-stat-label">{t('workoutBuilder.stats.steps')}</span>
          </div>
        </div>
        
        {notation.length > 0 && (
          <div className="swim-builder-notation">
            <div className="swim-builder-notation-label">{t('workoutBuilder.labels.workout')}:</div>
            <div className="swim-builder-notation-text">{notation.join(' + ')}</div>
          </div>
        )}
      </div>

      <div className="swim-builder-content">
        {workout.items.length === 0 ? (
          <div className="swim-builder-empty-workout">
            <div className="swim-builder-empty-icon">🏊‍♂️</div>
            <h3>{t('workoutBuilder.empty.title')}</h3>
            <p>{t('workoutBuilder.empty.subtitle')}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary swim-builder-large" onClick={() => handleAddStep()}>
                {t('workoutBuilder.buttons.addStep')}
              </button>
              <button className="btn btn-secondary swim-builder-large" onClick={() => handleAddRepeatBlock()}>
                {t('workoutBuilder.buttons.addRepeat')}
              </button>
            </div>
          </div>
        ) : (
          <div className="swim-builder-items">
            {workout.items.map(item => renderWorkoutItem(item))}
            <div className="swim-builder-add-item-section">
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={() => handleAddStep()}>
                  + {t('workoutBuilder.buttons.addStep')}
                </button>
                <button className="btn btn-secondary" onClick={() => handleAddRepeatBlock()}>
                  + {t('workoutBuilder.buttons.addRepeat')}
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
                
                const convertToBackendEnum = (value) => {
                  if (!value) return value;
                  return value.toString().toUpperCase().replace(/-/g, '_');
                };

                const processItem = (item) => {
                  const processed = {
                    type: convertToBackendEnum(item.type),
                    stepType: convertToBackendEnum(item.stepType),
                    repeats: item.repeats || 1,
                    notes: item.notes || ''
                  };

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

                  if (item.items && item.items.length > 0) {
                    processed.childItems = item.items.map(childItem => processItem(childItem));
                  }
                  
                  delete processed.id;
                  
                  return processed;
                };

                const workoutData = {
                  name: workout.name,
                  level: workout.level?.toUpperCase(),
                  type: workout.type?.toUpperCase(),
                  description: `${t('workoutBuilder.stats.totalDistance')}: ${totalDistance}m | ${t('workoutBuilder.labels.notation')}: ${notation.join(' + ')}`,
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
                  alert(t(isEditing ? 'workoutBuilder.alerts.updateSuccess' : 'workoutBuilder.alerts.saveSuccess', { id: savedWorkout.id }));
                  navigate(`/${lang}/admin/traininghub/workouts`);
                } else {
                  const errorText = await response.text();
                  try {
                    const error = JSON.parse(errorText);
                    alert(`${t('workoutBuilder.alerts.error')}: ${error.error || t('workoutBuilder.alerts.saveFailed')}`);
                  } catch {
                    alert(`${t('workoutBuilder.alerts.error')}: ${response.status} - ${errorText}`);
                  }
                }
              } catch (error) {
                console.error('Save error:', error);
                alert(t('workoutBuilder.alerts.saveSuccessGeneric'));
                navigate(`/${lang}/admin/traininghub/workouts`);
              }
            }}
          >
            {isLoading ? t('workoutBuilder.buttons.loading') : (isEditing ? t('workoutBuilder.buttons.updateWorkout') : t('workoutBuilder.buttons.saveWorkout'))}
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
            {t('workoutBuilder.buttons.exportJson')}
          </button>
        </div>
      )}
    </div>
  );
};

export default SwimmingWorkoutBuilder;