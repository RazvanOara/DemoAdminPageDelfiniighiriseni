import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Plans.css';
import './Planificare.css';

const Plans = () => {
  const navigate = useNavigate();
  const { planId } = useParams();
  const [activeView, setActiveView] = useState('overview');
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
// Date mock pentru planuri
const mockPlans = [
  {
    id: 1,
    name: 'Sezon Competițional 2025',
    description: 'Plan complet de pregătire pentru sezonul competițional principal, incluzând toate fazele macro.',
    startDate: '2025-09-01',
    endDate: '2026-02-28',
    status: 'Active',
    goals: 'Construirea bazei aerobe, creșterea intensității progresive și atingerea vârfului de formă pentru Campionatul Național.',
    macroPhases: ['accumulation', 'intensification', 'realization', 'taper', 'transition'],
    keyRaces: [
      { 
        name: 'Concurs Regional', 
        raceDate: '2025-11-10', 
        raceType: 'tuneup', 
        description: 'Primul test intermediar al sezonului'
      },
      { 
        name: 'Campionatul Național', 
        raceDate: '2026-02-15', 
        raceType: 'target', 
        description: 'Competiția principală a sezonului'
      }
    ],
    participants: [
      { participantType: 'INDIVIDUAL', cursantId: 1, name: 'Marcel Popescu' },
      { participantType: 'INDIVIDUAL', cursantId: 2, name: 'Delia Tuc' },
      { participantType: 'GROUP', groupId: 101, name: 'Juniori' }
    ]
  },
  {
    id: 2,
    name: 'Plan Off-Season / Recuperare',
    description: 'Plan de tranziție și refacere activă după sezonul competițional, cu accent pe tehnică și volum redus.',
    startDate: '2026-03-01',
    endDate: '2026-04-15',
    status: 'Draft',
    goals: 'Recuperare fizică și mentală, corectarea tehnicii și pregătire pentru următorul ciclu.',
    macroPhases: ['accumulation','transition'],
    keyRaces: [
      { 
        name: 'Set de Test 400m', 
        raceDate: '2026-04-10', 
        raceType: 'testset', 
        description: 'Evaluare a nivelului post-sezon'
      }
    ],
    participants: [
      { participantType: 'GROUP', groupId: 101, name: 'Grup Juniori' }
    ]
  }
];

  
    // Date mock pentru participanți
    const mockSwimmers = [
      { id: 1, nume: 'Înotător 1' },
      { id: 2, nume: 'Înotător 2' },
      { id: 3, nume: 'Înotător 3' }
    ];
  
    const mockGroups = [
      { id: 101, name: 'Grup Juniori', swimmerCount: 10, swimmerNames: ['A', 'B', 'C'] },
      { id: 102, name: 'Grup Seniori', swimmerCount: 8, swimmerNames: ['X', 'Y', 'Z'] }
    ];
  
  
  // Training types with recovery requirements
  const trainingTypes = {
    REZ: { name: 'Rezistență', zone: '1-2', hrRange: '50-70%', recovery: 0, color: '#4CAF50' },
    TEHNICA: { name: 'Tehnică', zone: '1-2', hrRange: '50-70%', recovery: 0, color: '#2196F3' },
    PA: { name: 'Prag Anaerob', zone: '3', hrRange: '70-80%', recovery: 1, color: '#FF9800' },
    TOL: { name: 'Toleranță la lactat', zone: '4', hrRange: '80-90%', recovery: 2, color: '#F44336' },
    VO2: { name: 'VO2 Max', zone: '5', hrRange: '90-100%', recovery: 3, color: '#9C27B0' },
    TEMPO: { name: 'Tempo Cursă', zone: '6', hrRange: '100-110%', recovery: 3, color: '#E91E63' }
  };

  // Heart rate zones
  const hrZones = [
    { zone: 1, range: '50-60%', description: 'Recuperare - Incălzire și relaxare', color: '#4CAF50' },
    { zone: 2, range: '60-70%', description: 'Ardere grăsimi - Rezistență', color: '#8BC34A' },
    { zone: 3, range: '70-80%', description: 'Aerobică - Capacitate cardiovasculară (PA)', color: '#FF9800' },
    { zone: 4, range: '80-90%', description: 'Intensitate înaltă - Prag anaerob (TOL)', color: '#F44336' },
    { zone: 5, range: '90-100%', description: 'Intensitate maximă (VO2)', color: '#9C27B0' },
    { zone: 6, range: '100-110%', description: 'Tempo cursă (TEMPO)', color: '#E91E63' }
  ];

  // Predefined macro-phases
  const availableMacroPhases = [
    { 
      id: 'accumulation', 
      name: 'Acumulare', 
      description: 'Fază centrată pe volum pentru construirea bazei aerobe',
      duration: '4-6 săptămâni',
      color: '#4CAF50'
    },
    { 
      id: 'intensification', 
      name: 'Intensificare', 
      description: 'Fază de antrenament de înaltă intensitate',
      duration: '2-4 săptămâni',
      color: '#FF9800'
    },
    { 
      id: 'realization', 
      name: 'Realizare', 
      description: 'Pregătire specifică competiției',
      duration: '1-2 săptămâni',
      color: '#F44336'
    },
    { 
      id: 'taper', 
      name: 'Descărcarea', 
      description: 'Reducerea volumului înaintea competiției',
      duration: '1-3 săptămâni',
      color: '#9C27B0'
    },
    { 
      id: 'transition', 
      name: 'Tranziție', 
      description: 'Recuperare activă și regenerare',
      duration: '2-4 săptămâni',
      color: '#607D8B'
    }
  ];

  // Race types
  const raceTypes = [
    { id: 'target', name: 'Cursă Țintă', description: 'Obiectivul principal al competiției' },
    { id: 'tuneup', name: 'Concurs de Pregătire', description: 'Competiție de pregătire' },
    { id: 'testset', name: 'Set de Test', description: 'Evaluare de antrenament' }
  ];

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'DRAFT', // ADD THIS
    macroPhases: [],
    keyRaces: [],
    athlete: '',
    goals: '',
    phaseCalendar: {},
    weeklyPattern: {},
    participants: [] 
  });
  // Calendar view state
  const [calendarView, setCalendarView] = useState('phases');
  const [selectedWeek, setSelectedWeek] = useState(null);
  
  // Phase assignment state
  const [selectedPhaseForCalendar, setSelectedPhaseForCalendar] = useState(null);
  const [phaseStartWeek, setPhaseStartWeek] = useState('');
  const [phaseEndWeek, setPhaseEndWeek] = useState('');

  // Participant state
  const [selectedParticipantType, setSelectedParticipantType] = useState('INDIVIDUAL');
  const [availableSwimmers, setAvailableSwimmers] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);

  // Alert and validation state
  const [recoveryAlert, setRecoveryAlert] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Load specific plan for editing
  // Load specific plan for editing
  const loadPlanForEdit = (id) => {
    const plan = mockPlans.find(p => p.id === parseInt(id));
    if (!plan) return;

    setFormData({
      name: plan.name || '',
      description: plan.description || '',
      startDate: plan.startDate || '',
      endDate: plan.endDate || '',
      status: plan.status || 'Draft',
      macroPhases: plan.macroPhases || [],
      keyRaces: plan.keyRaces || [],
      athlete: plan.athlete || '',
      goals: plan.goals || '',
      phaseCalendar: plan.phaseCalendar || {},
      weeklyPattern: plan.weeklyPattern || {},
      participants: plan.participants || []
    });

    setEditMode(true);
    setActiveView('create');
  };


  // Phase assignment functions
  const assignPhaseToWeeks = (phaseId, startWeek, endWeek) => {
    const start = parseInt(startWeek);
    const end = parseInt(endWeek);
    
    // Check for overlaps with existing phases
    const hasOverlap = Object.entries(formData.phaseCalendar).some(([existingPhaseId, assignment]) => {
      if (existingPhaseId === phaseId) return false; // Skip self
      
      const existingStart = assignment.startWeek;
      const existingEnd = assignment.endWeek;
      
      // Check if ranges overlap
      return (start <= existingEnd && end >= existingStart);
    });
    
    if (hasOverlap) {
      alert('Fazele nu se pot suprapune! Alege un interval diferit.');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      phaseCalendar: {
        ...prev.phaseCalendar,
        [phaseId]: { startWeek: start, endWeek: end }
      }
    }));
    setSelectedPhaseForCalendar(null);
    setPhaseStartWeek('');
    setPhaseEndWeek('');
  };

  const handlePhaseClick = (phaseId) => {
    setSelectedPhaseForCalendar(phaseId);
    const existing = formData.phaseCalendar[phaseId];
    if (existing) {
      setPhaseStartWeek(existing.startWeek.toString());
      setPhaseEndWeek(existing.endWeek.toString());
    }
  };

  // Recovery period validation
  const validateRecoveryPeriods = (weekNumber, dayIndex, trainingType) => {
    if (!trainingType || ['REZ', 'TEHNICA'].includes(trainingType)) return { valid: true };
    
    const highIntensityTypes = ['PA', 'TOL', 'VO2', 'TEMPO'];
    
    // Find the most recent high-intensity training before this day
    for (let checkWeek = weekNumber; checkWeek >= 1; checkWeek--) {
      const weekPattern = formData.weeklyPattern[checkWeek];
      if (!weekPattern) continue;
      
      const endDay = checkWeek === weekNumber ? dayIndex - 1 : 6;
      
      for (let checkDay = endDay; checkDay >= 0; checkDay--) {
        const dayTraining = weekPattern[checkDay];
        
        if (dayTraining && highIntensityTypes.includes(dayTraining)) {
          const requiredRecovery = trainingTypes[dayTraining]?.recovery || 0;
          const daysBetween = calculateDaysBetween(checkWeek, checkDay, weekNumber, dayIndex);
          
          if (daysBetween <= requiredRecovery) {
            const dayNames = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];
            return {
              valid: false,
              violations: [`Recuperare insuficientă după ${trainingTypes[dayTraining]?.name} din ${dayNames[checkDay]} (Săpt. ${checkWeek}). Necesită ${requiredRecovery} zi${requiredRecovery > 1 ? 'le' : ''} de recuperare.`],
              recoveryNeeded: requiredRecovery
            };
          }
          
          // Found recent session with sufficient recovery
          return { valid: true };
        }
      }
    }
    
    return { valid: true }; // No recent high-intensity training found
  };

  // Helper function to calculate days between two dates
  const calculateDaysBetween = (fromWeek, fromDay, toWeek, toDay) => {
    if (fromWeek === toWeek) {
      return toDay - fromDay;
    }
    
    // Calculate total days more simply
    const fromTotalDays = (fromWeek - 1) * 7 + fromDay;
    const toTotalDays = (toWeek - 1) * 7 + toDay;
    
    return toTotalDays - fromTotalDays;
  };

  // Weekly training setter with validation
  const setWeeklyTraining = (weekNumber, dayIndex, trainingType) => {
    if (trainingType && !['REZ', 'TEHNICA', ''].includes(trainingType)) {
      const validation = validateRecoveryPeriods(weekNumber, dayIndex, trainingType);
      
      if (!validation.valid) {
        setRecoveryAlert({
          trainingType,
          recoveryNeeded: validation.recoveryNeeded,
          violations: validation.violations,
          onConfirm: () => {
            setRecoveryAlert(null);
            // Proceed with setting the training
            setFormData(prev => ({
              ...prev,
              weeklyPattern: {
                ...prev.weeklyPattern,
                [weekNumber]: {
                  ...prev.weeklyPattern[weekNumber],
                  [dayIndex]: trainingType
                }
              }
            }));
          },
          onCancel: () => {
            setRecoveryAlert(null);
          }
        });
        return;
      }
    }
    
    // Normal flow - no validation issues
    setFormData(prev => ({
      ...prev,
      weeklyPattern: {
        ...prev.weeklyPattern,
        [weekNumber]: {
          ...prev.weeklyPattern[weekNumber],
          [dayIndex]: trainingType
        }
      }
    }));
  };

  // Race validation
  const validateRaces = () => {
    const errors = {};
    
    formData.keyRaces.forEach((race, index) => {
      if (!race.name || race.name.trim() === '') {
        errors[`race_${index}_name`] = 'Numele competiției este obligatoriu';
      }
      if (!race.date) {
        errors[`race_${index}_date`] = 'Data competiției este obligatorie';
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Generate weeks from start and end date
  const generateWeeks = (startDate, endDate) => {
    if (!startDate || !endDate) return [];
    
    const weeks = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Adjust to Monday of the first week
    const firstMonday = new Date(start);
    firstMonday.setDate(start.getDate() - start.getDay() + 1);
    
    let current = new Date(firstMonday);
    let weekNumber = 1;
    
    while (current <= end) {
      const weekEnd = new Date(current);
      weekEnd.setDate(current.getDate() + 6);
      
      weeks.push({
        number: weekNumber,
        startDate: new Date(current),
        endDate: weekEnd,
        days: generateDaysForWeek(current)
      });
      
      current.setDate(current.getDate() + 7);
      weekNumber++;
    }
    
    return weeks;
  };

  const generateDaysForWeek = (weekStart) => {
    const days = [];
    const dayNames = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push({
        date: day,
        name: dayNames[i],
        trainingType: null
      });
    }
    
    return days;
  };

  const handleWeekClick = (weekNumber) => {
    setSelectedWeek(weekNumber);
  };

  // Fetch participants data
  useEffect(() => {
    setAvailableSwimmers(mockSwimmers);
    setAvailableGroups(mockGroups);
  }, []);


  // Participant management
  const addParticipant = (type, id) => {
    if (!id) return;
    
    const newParticipant = {
      participantType: type,
      cursantId: type === 'INDIVIDUAL' ? parseInt(id) : null,
      groupId: type === 'GROUP' ? parseInt(id) : null,
      name: type === 'INDIVIDUAL' 
        ? availableSwimmers.find(s => s.id === parseInt(id))?.nume 
        : availableGroups.find(g => g.id === parseInt(id))?.name
    };
    
    // Check if already added
    const exists = formData.participants.some(p => 
      (p.participantType === type && 
       ((type === 'INDIVIDUAL' && p.cursantId === parseInt(id)) || 
        (type === 'GROUP' && p.groupId === parseInt(id))))
    );
    
    if (!exists) {
      setFormData(prev => ({
        ...prev,
        participants: [...prev.participants, newParticipant]
      }));
    }
  };

  const removeParticipant = (index) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index)
    }));
  };

  // Fetch plans from API
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setPlans(mockPlans);
      setIsLoading(false);
    }, 500); // mic delay ca să simulezi fetch
  }, []);

 
useEffect(() => {
 
  if (planId && !editMode) {
    loadPlanForEdit(planId);
  }
}, [planId, editMode]);

  // Add this after your other useEffects
useEffect(() => {
  if (editMode && formData.participants.length > 0 && availableSwimmers.length > 0) {
    const needsEnrichment = formData.participants.some(p => !p.name || p.name.startsWith('Cursant ID:') || p.name.startsWith('Grup ID:'));
    
    if (needsEnrichment) {
      setFormData(prev => ({
        ...prev,
        participants: prev.participants.map(participant => {
          if (participant.name && !participant.name.startsWith('Cursant ID:') && !participant.name.startsWith('Grup ID:')) {
            return participant;
          }
          
          if (participant.participantType === 'INDIVIDUAL') {
            const swimmer = availableSwimmers.find(s => s.id === participant.cursantId);
            return { ...participant, name: swimmer?.nume || `Cursant ID: ${participant.cursantId}` };
          }
          
          if (participant.participantType === 'GROUP') {
            const group = availableGroups.find(g => g.id === participant.groupId);
            return { ...participant, name: group?.name || `Grup ID: ${participant.groupId}` };
          }
          
          return participant;
        })
      }));
    }
  }
}, [availableSwimmers, availableGroups, editMode, formData.participants.length]);

  // Form handlers
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMacroPhaseToggle = (phaseId) => {
    setFormData(prev => ({
      ...prev,
      macroPhases: prev.macroPhases.includes(phaseId)
        ? prev.macroPhases.filter(id => id !== phaseId)
        : [...prev.macroPhases, phaseId]
    }));
  };

  const addKeyRace = () => {
    const newRace = {
      id: Date.now(),
      name: '',
      date: '',
      type: 'target',
      description: ''
    };
    setFormData(prev => ({
      ...prev,
      keyRaces: [...prev.keyRaces, newRace]
    }));
  };

  const updateKeyRace = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      keyRaces: prev.keyRaces.map((race, i) => 
        i === index ? { ...race, [field]: value } : race
      )
    }));
    
    // Clear validation error when user starts typing
    if (field === 'date' && value) {
      setValidationErrors(prev => ({
        ...prev,
        [`race_${index}_date`]: null
      }));
    }
    if (field === 'name' && value) {
      setValidationErrors(prev => ({
        ...prev,
        [`race_${index}_name`]: null
      }));
    }
  };

  const removeKeyRace = (index) => {
    setFormData(prev => ({
      ...prev,
      keyRaces: prev.keyRaces.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateRaces()) {
      alert('Te rugăm să completezi toate câmpurile obligatorii pentru competiții.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const csrfResponse = await fetch('/csrf', { credentials: 'include' });
      const csrfData = await csrfResponse.json();
      const csrfToken = csrfData.token;
      
      const submitData = {
        name: formData.name,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
        athlete: formData.athlete,
        goals: formData.goals,
        macroPhases: formData.macroPhases,
        keyRaces: formData.keyRaces.map(race => ({
          name: race.name,
          raceDate: race.date,
          raceType: race.type,
          description: race.description
        })),
        phaseCalendar: formData.phaseCalendar,
        weeklyPattern: formData.weeklyPattern,
        participants: formData.participants
      };
      
      // Choose endpoint based on edit mode
      const url = editMode ? `/api/plans/${planId}` : '/api/plans';
      const method = editMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken
        },
        body: JSON.stringify(submitData)
      });
      
      if (response.ok) {
        const resultPlan = await response.json();
        
        if (editMode) {
          // Update existing plan in list
          setPlans(prev => prev.map(p => p.id === planId ? resultPlan : p));
        } else {
          // Add new plan to list
          setPlans(prev => [...prev, resultPlan]);
        }
        
        // Reset form and return to overview
        setFormData({
          name: '', description: '', startDate: '', endDate: '',
          macroPhases: [], keyRaces: [], athlete: '', goals: '',
          phaseCalendar: {}, weeklyPattern: {}, participants: []
        });
        
        setEditMode(false);
        setActiveView('overview');
        navigate('/admin/traininghub/plans');
      } else {
        const errorData = await response.json();
        console.error('Failed to save plan:', errorData);
      }
    } catch (error) {
      console.error('Error saving plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Utility functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#4CAF50';
      case 'Draft': return '#FF9800';
      case 'Completed': return '#9C27B0';
      case 'Paused': return '#607D8B';
      default: return '#666';
    }
  };

  const calculatePlanDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} săptămâni`;
  };

  // Render phase calendar
  const renderPhaseCalendar = () => {
    const weeks = generateWeeks(formData.startDate, formData.endDate);
    
    return (
      <div className="phase-calendar">
        <div className="calendar-header">
          <h4>Asignare Faze Macro pe Săptămâni</h4>
          <div className="selected-phases">
            {formData.macroPhases.map(phaseId => {
              const phase = availableMacroPhases.find(p => p.id === phaseId);
              const assignment = formData.phaseCalendar[phaseId];
              return (
                <div key={phaseId} className="phase-assignment">
                  <div 
                    className="phase-badge clickable-phase"
                    style={{ backgroundColor: phase?.color }}
                    onClick={() => handlePhaseClick(phaseId)}
                  >
                    {phase?.name}
                  </div>
                  {assignment && (
                    <span className="week-range">
                      Săpt. {assignment.startWeek} - {assignment.endWeek}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="weeks-grid">
          {weeks.map(week => {
            const assignedPhase = Object.entries(formData.phaseCalendar).find(
              ([phaseId, assignment]) => 
                assignment.startWeek <= week.number && assignment.endWeek >= week.number
            );
            
            return (
              <div 
                key={week.number}
                className={`week-card ${assignedPhase ? 'assigned' : ''}`}
                onClick={() => handleWeekClick(week.number)}
              >
                <div className="week-header">
                  <span className="week-number">Săpt. {week.number}</span>
                  <span className="week-dates">
                    {week.startDate.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit' })} - 
                    {week.endDate.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit' })}
                  </span>
                </div>
                {assignedPhase && (
                  <div 
                    className="week-phase"
                    style={{ 
                      backgroundColor: availableMacroPhases.find(p => p.id === assignedPhase[0])?.color 
                    }}
                  >
                    {availableMacroPhases.find(p => p.id === assignedPhase[0])?.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {selectedPhaseForCalendar && (
          <div className="phase-assignment-modal">
            <div className="modal-content">
              <h4>Asignează {availableMacroPhases.find(p => p.id === selectedPhaseForCalendar)?.name}</h4>
              <div className="week-selector">
                <div className="form-row">
                  <div className="form-group">
                    <label>Săptămâna de început</label>
                    <select 
                      className="form-select"
                      value={phaseStartWeek}
                      onChange={(e) => setPhaseStartWeek(e.target.value)}
                    >
                      <option value="">Selectează...</option>
                      {weeks.filter(week => {
                        // Filter out weeks that are already assigned to other phases
                        return !Object.entries(formData.phaseCalendar).some(([phaseId, assignment]) => {
                          if (phaseId === selectedPhaseForCalendar) return false;
                          return week.number >= assignment.startWeek && week.number <= assignment.endWeek;
                        });
                      }).map(week => (
                        <option key={week.number} value={week.number}>
                          Săptămâna {week.number}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Săptămâna de sfârșit</label>
                    <select 
                      className="form-select"
                      value={phaseEndWeek}
                      onChange={(e) => setPhaseEndWeek(e.target.value)}
                    >
                      <option value="">Selectează...</option>
                      {weeks.filter(week => {
                        // Only show weeks >= start week and not assigned to other phases
                        const startWeekNum = parseInt(phaseStartWeek);
                        if (!startWeekNum || week.number < startWeekNum) return false;
                        
                        return !Object.entries(formData.phaseCalendar).some(([phaseId, assignment]) => {
                          if (phaseId === selectedPhaseForCalendar) return false;
                          return week.number >= assignment.startWeek && week.number <= assignment.endWeek;
                        });
                      }).map(week => (
                        <option key={week.number} value={week.number}>
                          Săptămâna {week.number}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setSelectedPhaseForCalendar(null)}>
                    Anulează
                  </button>
                  <button 
                    type="button" 
                    className="btn-primary"
                    onClick={() => assignPhaseToWeeks(selectedPhaseForCalendar, phaseStartWeek, phaseEndWeek)}
                    disabled={!phaseStartWeek || !phaseEndWeek}
                  >
                    Asignează
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render weekly training
  const renderWeeklyTraining = () => {
    const weeks = generateWeeks(formData.startDate, formData.endDate);
    
    return (
      <div className="weekly-training">
        <div className="training-legend">
          <h4>Tipuri de Antrenament</h4>
          <div className="legend-grid">
            {Object.entries(trainingTypes).map(([key, type]) => (
              <div key={key} className="legend-item">
                <div 
                  className="legend-color"
                  style={{ backgroundColor: type.color }}
                ></div>
                <span className="legend-label">{key} - {type.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="weeks-training-grid">
          {weeks.map(week => {
            const assignedPhase = Object.entries(formData.phaseCalendar).find(
              ([phaseId, assignment]) => 
                assignment.startWeek <= week.number && assignment.endWeek >= week.number
            );
            
            return (
              <div key={week.number} className="week-training-card">
                <div className="week-training-header">
                  <span className="week-number">Săptămâna {week.number}</span>
                  {assignedPhase && (
                    <span 
                      className="week-phase-indicator"
                      style={{ 
                        backgroundColor: availableMacroPhases.find(p => p.id === assignedPhase[0])?.color 
                      }}
                    >
                      {availableMacroPhases.find(p => p.id === assignedPhase[0])?.name}
                    </span>
                  )}
                </div>
                
                <div className="days-training-grid">
                  {week.days.map((day, dayIndex) => {
                    const currentTraining = formData.weeklyPattern[week.number]?.[dayIndex];
                    
                    return (
                      <div key={dayIndex} className="day-training-cell">
                        <div className="day-name">{day.name}</div>
                        <div className="day-date">
                          {day.date.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit' })}
                        </div>
                        <select
                          className="training-select"
                          value={currentTraining || ''}
                          onChange={(e) => setWeeklyTraining(week.number, dayIndex, e.target.value)}
                          style={{
                            backgroundColor: currentTraining ? trainingTypes[currentTraining]?.color + '33' : 'transparent'
                          }}
                        >
                          <option value="">Rest</option>
                          {Object.entries(trainingTypes).map(([key, type]) => (
                            <option key={key} value={key}>{key}</option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render overview
  const renderOverview = () => (
    <div className="plans-overview">
      <div className="overview-header">
        <div className="header-content">
          <h2 className="page-title">Planuri de Antrenament</h2>
          <p className="page-subtitle">Gestionează programele pe termen lung și pregătirea pentru competiții</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setActiveView('create')}
        >
          <span className="btn-icon">➕</span>
          Creează Plan Nou
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>Nu există planuri create</h3>
          <p>Începe prin a crea primul tău plan de antrenament pentru gestionarea eficientă a pregătirii.</p>
          <button 
            className="btn-primary"
            onClick={() => setActiveView('create')}
          >
            Creează Primul Plan
          </button>
        </div>
      ) : (
        <div className="plans-grid">
          {plans.map(plan => (
            <div key={plan.id} className="plan-card">
              <div className="plan-card-header">
                <div className="plan-title-section">
                  <h3 className="plan-name">{plan.name}</h3>
                  <span 
                    className="plan-status"
                    style={{ backgroundColor: getStatusColor(plan.status) }}
                  >
                    {plan.status}
                  </span>
                </div>
                <div className="plan-athlete">{plan.athlete}</div>
              </div>

              <div className="plan-card-body">
                <div className="plan-dates">
                  <div className="date-item">
                    <span className="date-label">Start:</span>
                    <span className="date-value">{formatDate(plan.startDate)}</span>
                  </div>
                  <div className="date-item">
                    <span className="date-label">Sfârșit:</span>
                    <span className="date-value">{formatDate(plan.endDate)}</span>
                  </div>
                  <div className="date-item">
                    <span className="date-label">Durată:</span>
                    <span className="date-value">{calculatePlanDuration(plan.startDate, plan.endDate)}</span>
                  </div>
                </div>

                <div className="plan-progress">
                  <div className="progress-header">
                    <span className="progress-label">Progres</span>
                    <span className="progress-value">{plan.progress || 0}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${plan.progress || 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="plan-phases">
  <span className="phases-label">Faze Macro:</span>
  <div className="phases-list">
    {(plan.macroPhases || []).map((phaseId, index) => {
      const phase = availableMacroPhases.find(p => p.id === phaseId);
      
      if (!phase) {
        return <span key={index} style={{color: 'red'}}>Missing: {phaseId}</span>;
      }
      
      return (
        <span 
          key={phaseId}
          className="phase-badge"
          style={{ backgroundColor: phase.color }}
        >
          {phase.name}
        </span>
      );
    })}
  </div>
</div>

                <div className="plan-races">
                  <span className="races-label">Competiții Cheie:</span>
                  <div className="races-list">
                    {(plan.keyRaces || []).map((race, index) => (
                      <div key={index} className="race-item">
                        <span className="race-name">{race.name}</span>
                        <span className="race-date">{formatDate(race.raceDate || race.date)}</span>
                        <span className={`race-type ${race.raceType || race.type}`}>
                          {raceTypes.find(t => t.id === (race.raceType || race.type))?.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="plan-card-footer">
                <button 
                  className="btn-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/admin/traininghub/edit-plan/${plan.id}`);
                  }}
                >
                  Editează
                </button>
                <button className="btn-outline">Vezi Detalii</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render create plan
  const renderCreatePlan = () => (
    <div className="create-plan">
      <div className="create-plan-header">
        <button 
          className="back-button"
          onClick={() => {
            setActiveView('overview');
            setEditMode(false);
            navigate('/admin/traininghub/plans');
          }}
        >
          ← Înapoi
        </button>
        <h2 className="page-title">
          {editMode ? 'Editează Planul' : 'Creează Plan Nou'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="create-plan-form">
        <div className="form-section">
          <h3 className="section-title">Informații Generale</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nume Plan *</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="ex. Campionatul Național 2025"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descriere</label>
            <textarea
              className="form-textarea"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descrierea planului de antrenament..."
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Data de Start *</label>
              <input
                type="date"
                className="form-input"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Data de Sfârșit *</label>
              <input
                type="date"
                className="form-input"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                min={formData.startDate}
                required
              />
            </div>
          </div>
          <div className="form-row">
  <div className="form-group">
    <label className="form-label">Status Plan</label>
    <select
      className="form-select"
      value={formData.status}
      onChange={(e) => handleInputChange('status', e.target.value)}
    >
      <option value="Draft">Draft</option>
      <option value="Active">Activ</option>
      <option value="Paused">Pauzat</option>
      <option value="Completed">Completat</option>
    </select>
  </div>
  </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Faze Macro</h3>
          <p className="section-description">
            Selectează fazele macro care vor fi incluse în acest plan de antrenament
          </p>
          
          <div className="macro-phases-grid">
            {availableMacroPhases.map(phase => (
              <div 
                key={phase.id}
                className={`phase-selector ${formData.macroPhases.includes(phase.id) ? 'selected' : ''}`}
                onClick={() => handleMacroPhaseToggle(phase.id)}
              >
                <div className="phase-header">
                  <div 
                    className="phase-color"
                    style={{ backgroundColor: phase.color }}
                  ></div>
                  <h4 className="phase-name">{phase.name}</h4>
                  <span className="phase-duration">{phase.duration}</span>
                </div>
                <p className="phase-description">{phase.description}</p>
                <div className="phase-checkbox">
                  {formData.macroPhases.includes(phase.id) && '✓'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Competiții Cheie</h3>
          <p className="section-description">
            Adaugă competițiile importante, verificările și testele din cadrul planului
          </p>
          
          <div className="key-races-section">
            {formData.keyRaces.map((race, index) => (
              <div key={race.id} className="race-form-item">
                <div className="race-form-header">
                  <h4>Competiția {index + 1}</h4>
                  <button 
                    type="button"
                    className="remove-race-btn"
                    onClick={() => removeKeyRace(index)}
                  >
                    ✕
                  </button>
                </div>
                
                <div className="race-form-row">
                  <div className="form-group">
                    <label className="form-label">Nume Competiție *</label>
                    <input
                      type="text"
                      className={`form-input ${validationErrors[`race_${index}_name`] ? 'error' : ''}`}
                      value={race.name}
                      onChange={(e) => updateKeyRace(index, 'name', e.target.value)}
                      placeholder="ex. Campionatul Național"
                    />
                    {validationErrors[`race_${index}_name`] && (
                      <span className="error-message">{validationErrors[`race_${index}_name`]}</span>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Data *</label>
                    <input
                      type="date"
                      className={`form-input ${validationErrors[`race_${index}_date`] ? 'error' : ''}`}
                      value={race.date}
                      onChange={(e) => updateKeyRace(index, 'date', e.target.value)}
                      min={formData.startDate}
                      max={formData.endDate}
                    />
                    {validationErrors[`race_${index}_date`] && (
                      <span className="error-message">{validationErrors[`race_${index}_date`]}</span>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Tip</label>
                    <select
                      className="form-select"
                      value={race.type}
                      onChange={(e) => updateKeyRace(index, 'type', e.target.value)}
                    >
                      {raceTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Descriere</label>
                  <input
                    type="text"
                    className="form-input"
                    value={race.description}
                    onChange={(e) => updateKeyRace(index, 'description', e.target.value)}
                    placeholder="Obiective specifice pentru această competiție"
                  />
                </div>
              </div>
            ))}
            
            <button 
              type="button"
              className="add-race-btn"
              onClick={addKeyRace}
            >
              + Adaugă Competiție
            </button>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Obiective și Zone de Antrenament</h3>
          
          <div className="form-group">
            <label className="form-label">Obiective Planului</label>
            <textarea
              className="form-textarea"
              value={formData.goals}
              onChange={(e) => handleInputChange('goals', e.target.value)}
              placeholder="Definește obiectivele specifice ale acestui plan..."
              rows="4"
            />
          </div>

          <div className="reference-sections">
            <div className="hr-zones-reference">
              <h4 className="reference-title">Zone de Frecvență Cardiacă</h4>
              <div className="zones-grid">
                {hrZones.map(zone => (
                  <div key={zone.zone} className="zone-card">
                    <div className="zone-header">
                      <div 
                        className="zone-indicator"
                        style={{ backgroundColor: zone.color }}
                      ></div>
                      <div className="zone-info">
                        <span className="zone-number">Zona {zone.zone}</span>
                        <span className="zone-range">{zone.range}</span>
                      </div>
                    </div>
                    <p className="zone-description">{zone.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="training-types-reference">
              <h4 className="reference-title">Tipuri de Antrenament</h4>
              <div className="training-types-grid">
                {Object.entries(trainingTypes).map(([key, type]) => (
                  <div key={key} className="training-type-card">
                    <div className="type-header">
                      <div 
                        className="type-indicator"
                        style={{ backgroundColor: type.color }}
                      ></div>
                      <div className="type-info">
                        <span className="type-code">{key}</span>
                        <span className="type-name">{type.name}</span>
                      </div>
                    </div>
                    <div className="type-details">
                      <div className="type-detail-item">
                        <span className="detail-label">Zona:</span>
                        <span className="detail-value">{type.zone}</span>
                      </div>
                      <div className="type-detail-item">
                        <span className="detail-label">FC:</span>
                        <span className="detail-value">{type.hrRange}</span>
                      </div>
                      {type.recovery > 0 && (
                        <div className="type-detail-item">
                          <span className="detail-label">Recuperare:</span>
                          <span className="detail-value">
                            {type.recovery} zi{type.recovery > 1 ? 'le' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Planning Section */}
        {formData.startDate && formData.endDate && formData.macroPhases.length > 0 && (
          <div className="form-section">
            <h3 className="section-title">Planificare Calendar</h3>
            <p className="section-description">
              Asignează fazele macro la săptămânile specifice și configurează antrenamentele săptămânale
            </p>

            <div className="calendar-controls">
              <div className="view-toggle">
                <button
                  type="button"
                  className={`toggle-btn ${calendarView === 'phases' ? 'active' : ''}`}
                  onClick={() => setCalendarView('phases')}
                >
                  Faze Macro
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${calendarView === 'weekly' ? 'active' : ''}`}
                  onClick={() => setCalendarView('weekly')}
                >
                  Antrenamente Săptămânale
                </button>
              </div>
            </div>

            {calendarView === 'phases' && renderPhaseCalendar()}
            {calendarView === 'weekly' && renderWeeklyTraining()}
          </div>
        )}

        {/* Participants Section */}
        <div className="form-section">
          <h3 className="section-title">Participanți</h3>
          <p className="section-description">
            Asignează înotători individuali sau grupuri întregi la acest plan de antrenament
          </p>
          
          <div className="participants-section">
            <div className="participant-type-selector">
              <button
                type="button"
                className={`type-btn ${selectedParticipantType === 'INDIVIDUAL' ? 'active' : ''}`}
                onClick={() => setSelectedParticipantType('INDIVIDUAL')}
              >
                Înotători Individuali
              </button>
              <button
                type="button"
                className={`type-btn ${selectedParticipantType === 'GROUP' ? 'active' : ''}`}
                onClick={() => setSelectedParticipantType('GROUP')}
              >
                Grupuri
              </button>
            </div>
            
            {selectedParticipantType === 'INDIVIDUAL' && (
              <div className="individual-selector">
                <select 
                  className="form-select"
                  onChange={(e) => addParticipant('INDIVIDUAL', e.target.value)}
                  value=""
                >
                  <option value="">Selectează un înotător...</option>
                  {availableSwimmers.map(swimmer => (
                    <option key={swimmer.id} value={swimmer.id}>
                      {swimmer.nume}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {selectedParticipantType === 'GROUP' && (
              <div className="group-selector">
                <select 
                  className="form-select"
                  onChange={(e) => addParticipant('GROUP', e.target.value)}
                  value=""
                >
                  <option value="">Selectează un grup...</option>
                  {availableGroups.map(group => (
                    <option key={group.id} value={group.id}>
                      {group.name} ({group.swimmerCount} înotători: {group.swimmerNames.join(', ')}{group.swimmerCount > 3 ? '...' : ''})
                    </option>
                  ))}
                </select>
                
                <div className="groups-preview">
                  {availableGroups.map(group => (
                    <div key={group.id} className="group-preview-card">
                      <h5>{group.name}</h5>
                      <p>{group.swimmerCount} înotători</p>
                      <small>{group.swimmerNames.join(', ')}{group.swimmerCount > 3 ? '...' : ''}</small>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="selected-participants">
              {formData.participants && formData.participants.map((participant, index) => (
                <div key={index} className="participant-tag">
                  <span>{participant.participantType === 'INDIVIDUAL' ? 'Înotător' : 'Grup'}: {participant.name}</span>
                  <button
                    type="button"
                    onClick={() => removeParticipant(index)}
                    className="remove-participant-btn"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button"
            className="btn-secondary"
            onClick={() => {
              setActiveView('overview');
              setEditMode(false);
              navigate('/admin/traininghub/plans');
            }}
          >
            Anulează
          </button>
          <button 
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading 
              ? (editMode ? 'Se actualizează...' : 'Se creează...') 
              : (editMode ? 'Actualizează Planul' : 'Creează Planul')
            }
          </button>
        </div>
      </form>

      {/* Recovery Alert Modal */}
      {recoveryAlert && (
        <div className="recovery-alert-modal">
          <div className="alert-modal-content">
            <div className="alert-header">
              <div className="alert-icon">⚠️</div>
              <h3>Atenție - Perioadă de Recuperare</h3>
            </div>
            
            <div className="alert-body">
              <p className="alert-main-message">
                <strong>{trainingTypes[recoveryAlert.trainingType]?.name}</strong> necesită {' '}
                <strong>{recoveryAlert.recoveryNeeded} {recoveryAlert.recoveryNeeded === 1 ? 'zi' : 'zile'}</strong> {' '}
                de recuperare după antrenamente intense.
              </p>
              
              <div className="alert-violations">
                <p className="violations-title">Conflicte detectate:</p>
                <ul className="violations-list">
                  {recoveryAlert.violations.map((violation, index) => (
                    <li key={index}>{violation}</li>
                  ))}
                </ul>
              </div>
              
              <div className="alert-recommendation">
                <p>Se recomandă să programezi zilele de recuperare (REZ, TEHNICĂ sau Odihnă) între antrenamentele intense pentru a preveni suprasolicitarea și accidentările.</p>
              </div>
            </div>
            
            <div className="alert-actions">
              <button 
                type="button" 
                className="alert-btn alert-btn-cancel"
                onClick={recoveryAlert.onCancel}
              >
                Anulează
              </button>
              <button 
                type="button" 
                className="alert-btn alert-btn-confirm"
                onClick={recoveryAlert.onConfirm}
              >
                Continuă oricum
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="plans-container">
      {/* Navigation Bar */}
      <div className="planificare-header">
        <nav className="planificare-nav">
          <button 
            className="nav-tab"
            onClick={() => navigate('/admin/traininghub')}
          >
            <span className="tab-icon">📊</span>
            Tablou de Bord
          </button>
          <button 
            className="nav-tab"
            onClick={() => navigate('/admin/traininghub/workouts')}
          >
            <span className="tab-icon">🏊</span>
            Antrenamente
          </button>
          <button 
            className="nav-tab active"
          >
            <span className="tab-icon">📋</span>
            Planuri
          </button>
        </nav>
      </div>
      
      {activeView === 'overview' && renderOverview()}
      {activeView === 'create' && renderCreatePlan()}
    </div>
  );
};

export default Plans;