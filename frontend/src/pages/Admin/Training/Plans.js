import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Plans.css';
import './Planificare.css';

const Plans = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { planId } = useParams();
  const { lang } = useParams();
  const [activeView, setActiveView] = useState('overview');
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const mockPlans = useMemo(() => [
    {
      id: 1,
      name: t('plans.mockPlans.competitiveSeason'),
      description: t('plans.mockPlans.competitiveSeasonDesc'),
      startDate: '2025-09-01',
      endDate: '2026-02-28',
      status: 'Active',
      goals: t('plans.mockPlans.competitiveSeasonGoals'),
      macroPhases: ['accumulation', 'intensification', 'realization', 'taper', 'transition'],
      keyRaces: [
        { 
          name: t('plans.mockPlans.regionalCompetition'), 
          raceDate: '2025-11-10', 
          raceType: 'tuneup', 
          description: t('plans.mockPlans.regionalCompetitionDesc')
        },
        { 
          name: t('plans.mockPlans.nationalChampionship'), 
          raceDate: '2026-02-15', 
          raceType: 'target', 
          description: t('plans.mockPlans.nationalChampionshipDesc')
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
      name: t('plans.mockPlans.offSeasonPlan'),
      description: t('plans.mockPlans.offSeasonPlanDesc'),
      startDate: '2026-03-01',
      endDate: '2026-04-15',
      status: 'Draft',
      goals: t('plans.mockPlans.offSeasonPlanGoals'),
      macroPhases: ['accumulation','transition'],
      keyRaces: [
        { 
          name: t('plans.mockPlans.testSet400m'), 
          raceDate: '2026-04-10', 
          raceType: 'testset', 
          description: t('plans.mockPlans.testSet400mDesc')
        }
      ],
      participants: [
        { participantType: 'GROUP', groupId: 101, name: 'Grup Juniori' }
      ]
    }
  ], [t]);

  const mockSwimmers = [
    { id: 1, nume: t('plans.mockData.swimmer1') },
    { id: 2, nume: t('plans.mockData.swimmer2') },
    { id: 3, nume: t('plans.mockData.swimmer3') }
  ];

  const mockGroups = [
    { id: 101, name: t('plans.mockData.juniorGroup'), swimmerCount: 10, swimmerNames: ['A', 'B', 'C'] },
    { id: 102, name: t('plans.mockData.seniorGroup'), swimmerCount: 8, swimmerNames: ['X', 'Y', 'Z'] }
  ];

  const trainingTypes = {
    REZ: { name: t('plans.trainingTypes.endurance'), zone: '1-2', hrRange: '50-70%', recovery: 0, color: '#4CAF50' },
    TEHNICA: { name: t('plans.trainingTypes.technique'), zone: '1-2', hrRange: '50-70%', recovery: 0, color: '#2196F3' },
    PA: { name: t('plans.trainingTypes.anaerobicThreshold'), zone: '3', hrRange: '70-80%', recovery: 1, color: '#FF9800' },
    TOL: { name: t('plans.trainingTypes.lactateTolerance'), zone: '4', hrRange: '80-90%', recovery: 2, color: '#F44336' },
    VO2: { name: t('plans.trainingTypes.vo2max'), zone: '5', hrRange: '90-100%', recovery: 3, color: '#9C27B0' },
    TEMPO: { name: t('plans.trainingTypes.raceTempo'), zone: '6', hrRange: '100-110%', recovery: 3, color: '#E91E63' }
  };

  const hrZones = [
    { zone: 1, range: '50-60%', description: t('plans.hrZones.zone1'), color: '#4CAF50' },
    { zone: 2, range: '60-70%', description: t('plans.hrZones.zone2'), color: '#8BC34A' },
    { zone: 3, range: '70-80%', description: t('plans.hrZones.zone3'), color: '#FF9800' },
    { zone: 4, range: '80-90%', description: t('plans.hrZones.zone4'), color: '#F44336' },
    { zone: 5, range: '90-100%', description: t('plans.hrZones.zone5'), color: '#9C27B0' },
    { zone: 6, range: '100-110%', description: t('plans.hrZones.zone6'), color: '#E91E63' }
  ];

  const availableMacroPhases = [
    { 
      id: 'accumulation', 
      name: t('plans.macroPhases.accumulation.name'), 
      description: t('plans.macroPhases.accumulation.description'),
      duration: t('plans.macroPhases.accumulation.duration'),
      color: '#4CAF50'
    },
    { 
      id: 'intensification', 
      name: t('plans.macroPhases.intensification.name'), 
      description: t('plans.macroPhases.intensification.description'),
      duration: t('plans.macroPhases.intensification.duration'),
      color: '#FF9800'
    },
    { 
      id: 'realization', 
      name: t('plans.macroPhases.realization.name'), 
      description: t('plans.macroPhases.realization.description'),
      duration: t('plans.macroPhases.realization.duration'),
      color: '#F44336'
    },
    { 
      id: 'taper', 
      name: t('plans.macroPhases.taper.name'), 
      description: t('plans.macroPhases.taper.description'),
      duration: t('plans.macroPhases.taper.duration'),
      color: '#9C27B0'
    },
    { 
      id: 'transition', 
      name: t('plans.macroPhases.transition.name'), 
      description: t('plans.macroPhases.transition.description'),
      duration: t('plans.macroPhases.transition.duration'),
      color: '#607D8B'
    }
  ];

  const raceTypes = [
    { id: 'target', name: t('plans.raceTypes.target'), description: t('plans.raceTypes.targetDesc') },
    { id: 'tuneup', name: t('plans.raceTypes.tuneup'), description: t('plans.raceTypes.tuneupDesc') },
    { id: 'testset', name: t('plans.raceTypes.testset'), description: t('plans.raceTypes.testsetDesc') }
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'DRAFT',
    macroPhases: [],
    keyRaces: [],
    athlete: '',
    goals: '',
    phaseCalendar: {},
    weeklyPattern: {},
    participants: [] 
  });

  const [calendarView, setCalendarView] = useState('phases');
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedPhaseForCalendar, setSelectedPhaseForCalendar] = useState(null);
  const [phaseStartWeek, setPhaseStartWeek] = useState('');
  const [phaseEndWeek, setPhaseEndWeek] = useState('');
  const [selectedParticipantType, setSelectedParticipantType] = useState('INDIVIDUAL');
  const [availableSwimmers, setAvailableSwimmers] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [recoveryAlert, setRecoveryAlert] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

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

  const assignPhaseToWeeks = (phaseId, startWeek, endWeek) => {
    const start = parseInt(startWeek);
    const end = parseInt(endWeek);
    
    const hasOverlap = Object.entries(formData.phaseCalendar).some(([existingPhaseId, assignment]) => {
      if (existingPhaseId === phaseId) return false;
      
      const existingStart = assignment.startWeek;
      const existingEnd = assignment.endWeek;
      
      return (start <= existingEnd && end >= existingStart);
    });
    
    if (hasOverlap) {
      alert(t('plans.alerts.phasesCannotOverlap'));
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

  const validateRecoveryPeriods = (weekNumber, dayIndex, trainingType) => {
    if (!trainingType || ['REZ', 'TEHNICA'].includes(trainingType)) return { valid: true };
    
    const highIntensityTypes = ['PA', 'TOL', 'VO2', 'TEMPO'];
    
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
            const dayNames = [
              t('plans.days.monday'),
              t('plans.days.tuesday'),
              t('plans.days.wednesday'),
              t('plans.days.thursday'),
              t('plans.days.friday'),
              t('plans.days.saturday'),
              t('plans.days.sunday')
            ];
            return {
              valid: false,
              violations: [t('plans.recovery.insufficientRecovery', {
                training: trainingTypes[dayTraining]?.name,
                day: dayNames[checkDay],
                week: checkWeek,
                days: requiredRecovery,
                daysLabel: requiredRecovery > 1 ? t('plans.recovery.days') : t('plans.recovery.day')
              })],
              recoveryNeeded: requiredRecovery
            };
          }
          
          return { valid: true };
        }
      }
    }
    
    return { valid: true };
  };

  const calculateDaysBetween = (fromWeek, fromDay, toWeek, toDay) => {
    if (fromWeek === toWeek) {
      return toDay - fromDay;
    }
    
    const fromTotalDays = (fromWeek - 1) * 7 + fromDay;
    const toTotalDays = (toWeek - 1) * 7 + toDay;
    
    return toTotalDays - fromTotalDays;
  };

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

  const validateRaces = () => {
    const errors = {};
    
    formData.keyRaces.forEach((race, index) => {
      if (!race.name || race.name.trim() === '') {
        errors[`race_${index}_name`] = t('plans.validation.raceNameRequired');
      }
      if (!race.date) {
        errors[`race_${index}_date`] = t('plans.validation.raceDateRequired');
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateWeeks = (startDate, endDate) => {
    if (!startDate || !endDate) return [];
    
    const weeks = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
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
    const dayNames = [
      t('plans.days.monday'),
      t('plans.days.tuesday'),
      t('plans.days.wednesday'),
      t('plans.days.thursday'),
      t('plans.days.friday'),
      t('plans.days.saturday'),
      t('plans.days.sunday')
    ];
    
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

  useEffect(() => {
    setAvailableSwimmers(mockSwimmers);
    setAvailableGroups(mockGroups);
  }, []);

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

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setPlans(mockPlans);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (planId && !editMode) {
      loadPlanForEdit(planId);
    }
  }, [planId, editMode]);

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
      alert(t('plans.alerts.fillAllRequired'));
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
          setPlans(prev => prev.map(p => p.id === planId ? resultPlan : p));
        } else {
          setPlans(prev => [...prev, resultPlan]);
        }
        
        setFormData({
          name: '', description: '', startDate: '', endDate: '',
          macroPhases: [], keyRaces: [], athlete: '', goals: '',
          phaseCalendar: {}, weeklyPattern: {}, participants: []
        });
        
        setEditMode(false);
        setActiveView('overview');
        navigate(`/${lang}/admin/traininghub/plans`);
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
    return t('plans.duration.weeks', { count: weeks });
  };
  // Continuing from Part 1...

  const renderPhaseCalendar = () => {
    const weeks = generateWeeks(formData.startDate, formData.endDate);
    
    return (
      <div className="phase-calendar">
        <div className="calendar-header">
          <h4>{t('plans.form.assignMacroPhases')}</h4>
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
                      {t('plans.form.week')} {assignment.startWeek} - {assignment.endWeek}
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
                  <span className="week-number">{t('plans.form.week')} {week.number}</span>
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
              <h4>{t('plans.form.assignPhase', { phase: availableMacroPhases.find(p => p.id === selectedPhaseForCalendar)?.name })}</h4>
              <div className="week-selector">
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('plans.form.startWeek')}</label>
                    <select 
                      className="form-select"
                      value={phaseStartWeek}
                      onChange={(e) => setPhaseStartWeek(e.target.value)}
                    >
                      <option value="">{t('plans.form.selectStartWeek')}</option>
                      {weeks.filter(week => {
                        return !Object.entries(formData.phaseCalendar).some(([phaseId, assignment]) => {
                          if (phaseId === selectedPhaseForCalendar) return false;
                          return week.number >= assignment.startWeek && week.number <= assignment.endWeek;
                        });
                      }).map(week => (
                        <option key={week.number} value={week.number}>
                          {t('plans.form.weekShort')} {week.number}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>{t('plans.form.endWeek')}</label>
                    <select 
                      className="form-select"
                      value={phaseEndWeek}
                      onChange={(e) => setPhaseEndWeek(e.target.value)}
                    >
                      <option value="">{t('plans.form.selectStartWeek')}</option>
                      {weeks.filter(week => {
                        const startWeekNum = parseInt(phaseStartWeek);
                        if (!startWeekNum || week.number < startWeekNum) return false;
                        
                        return !Object.entries(formData.phaseCalendar).some(([phaseId, assignment]) => {
                          if (phaseId === selectedPhaseForCalendar) return false;
                          return week.number >= assignment.startWeek && week.number <= assignment.endWeek;
                        });
                      }).map(week => (
                        <option key={week.number} value={week.number}>
                          {t('plans.form.weekShort')} {week.number}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setSelectedPhaseForCalendar(null)}>
                    {t('plans.form.cancel')}
                  </button>
                  <button 
                    type="button" 
                    className="btn-primary"
                    onClick={() => assignPhaseToWeeks(selectedPhaseForCalendar, phaseStartWeek, phaseEndWeek)}
                    disabled={!phaseStartWeek || !phaseEndWeek}
                  >
                    {t('plans.form.assign')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderWeeklyTraining = () => {
    const weeks = generateWeeks(formData.startDate, formData.endDate);
    
    return (
      <div className="weekly-training">
        <div className="training-legend">
          <h4>{t('plans.form.trainingTypesLegend')}</h4>
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
                  <span className="week-number">{t('plans.form.weekShort')} {week.number}</span>
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
                          <option value="">{t('plans.form.rest')}</option>
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

  const renderOverview = () => (
    <div className="plans-overview">
      <div className="overview-header">
        <div className="header-content">
          <h2 className="page-title">{t('plans.overview.title')}</h2>
          <p className="page-subtitle">{t('plans.overview.subtitle')}</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setActiveView('create')}
        >
          <span className="btn-icon">➕</span>
          {t('plans.overview.createNewPlan')}
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>{t('plans.overview.emptyState.title')}</h3>
          <p>{t('plans.overview.emptyState.description')}</p>
          <button 
            className="btn-primary"
            onClick={() => setActiveView('create')}
          >
            {t('plans.overview.emptyState.createFirst')}
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
                    <span className="date-label">{t('plans.card.start')}</span>
                    <span className="date-value">{formatDate(plan.startDate)}</span>
                  </div>
                  <div className="date-item">
                    <span className="date-label">{t('plans.card.end')}</span>
                    <span className="date-value">{formatDate(plan.endDate)}</span>
                  </div>
                  <div className="date-item">
                    <span className="date-label">{t('plans.card.duration')}</span>
                    <span className="date-value">{calculatePlanDuration(plan.startDate, plan.endDate)}</span>
                  </div>
                </div>

                <div className="plan-progress">
                  <div className="progress-header">
                    <span className="progress-label">{t('plans.card.progress')}</span>
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
                  <span className="phases-label">{t('plans.card.macroPhases')}</span>
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
                  <span className="races-label">{t('plans.card.keyRaces')}</span>
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
                    navigate(`/${lang}/admin/traininghub/edit-plan/${plan.id}`);
                  }}
                >
                  {t('plans.card.edit')}
                </button>
                <button className="btn-outline">{t('plans.card.viewDetails')}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCreatePlan = () => (
    <div className="create-plan">
      <div className="create-plan-header">
        <button 
          className="back-button"
          onClick={() => {
            setActiveView('overview');
            setEditMode(false);
            navigate(`/${lang}/admin/traininghub/plans`);
          }}
        >
          {t('plans.form.back')}
        </button>
        <h2 className="page-title">
          {editMode ? t('plans.form.editTitle') : t('plans.form.createTitle')}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="create-plan-form">
        <div className="form-section">
          <h3 className="section-title">{t('plans.form.generalInfo')}</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('plans.form.planName')}</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={t('plans.form.planNamePlaceholder')}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('plans.form.description')}</label>
            <textarea
              className="form-textarea"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={t('plans.form.descriptionPlaceholder')}
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('plans.form.startDate')}</label>
              <input
                type="date"
                className="form-input"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">{t('plans.form.endDate')}</label>
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
              <label className="form-label">{t('plans.form.planStatus')}</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <option value="Draft">{t('plans.form.statusDraft')}</option>
                <option value="Active">{t('plans.form.statusActive')}</option>
                <option value="Paused">{t('plans.form.statusPaused')}</option>
                <option value="Completed">{t('plans.form.statusCompleted')}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">{t('plans.form.macroPhases')}</h3>
          <p className="section-description">
            {t('plans.form.macroPhasesDesc')}
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
          <h3 className="section-title">{t('plans.form.keyRaces')}</h3>
          <p className="section-description">
            {t('plans.form.keyRacesDesc')}
          </p>
          
          <div className="key-races-section">
            {formData.keyRaces.map((race, index) => (
              <div key={race.id} className="race-form-item">
                <div className="race-form-header">
                  <h4>{t('plans.form.competition')} {index + 1}</h4>
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
                    <label className="form-label">{t('plans.form.competitionName')}</label>
                    <input
                      type="text"
                      className={`form-input ${validationErrors[`race_${index}_name`] ? 'error' : ''}`}
                      value={race.name}
                      onChange={(e) => updateKeyRace(index, 'name', e.target.value)}
                      placeholder={t('plans.form.competitionNamePlaceholder')}
                    />
                    {validationErrors[`race_${index}_name`] && (
                      <span className="error-message">{validationErrors[`race_${index}_name`]}</span>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">{t('plans.form.date')}</label>
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
                    <label className="form-label">{t('plans.form.type')}</label>
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
                  <label className="form-label">{t('plans.form.description')}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={race.description}
                    onChange={(e) => updateKeyRace(index, 'description', e.target.value)}
                    placeholder={t('plans.form.descriptionPlaceholder')}
                  />
                </div>
              </div>
            ))}
            
            <button 
              type="button"
              className="add-race-btn"
              onClick={addKeyRace}
            >
              {t('plans.form.addCompetition')}
            </button>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">{t('plans.form.goalsAndZones')}</h3>
          
          <div className="form-group">
            <label className="form-label">{t('plans.form.planGoals')}</label>
            <textarea
              className="form-textarea"
              value={formData.goals}
              onChange={(e) => handleInputChange('goals', e.target.value)}
              placeholder={t('plans.form.planGoalsPlaceholder')}
              rows="4"
            />
          </div>

          <div className="reference-sections">
            <div className="hr-zones-reference">
              <h4 className="reference-title">{t('plans.form.hrZones')}</h4>
              <div className="zones-grid">
                {hrZones.map(zone => (
                  <div key={zone.zone} className="zone-card">
                    <div className="zone-header">
                      <div 
                        className="zone-indicator"
                        style={{ backgroundColor: zone.color }}
                      ></div>
                      <div className="zone-info">
                        <span className="zone-number">{t('plans.form.zone')} {zone.zone}</span>
                        <span className="zone-range">{zone.range}</span>
                      </div>
                    </div>
                    <p className="zone-description">{zone.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="training-types-reference">
              <h4 className="reference-title">{t('plans.form.trainingTypes')}</h4>
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
                        <span className="detail-label">{t('plans.form.trainingTypeZone')}</span>
                        <span className="detail-value">{type.zone}</span>
                      </div>
                      <div className="type-detail-item">
                        <span className="detail-label">{t('plans.form.trainingTypeHR')}</span>
                        <span className="detail-value">{type.hrRange}</span>
                      </div>
                      {type.recovery > 0 && (
                        <div className="type-detail-item">
                          <span className="detail-label">{t('plans.form.trainingTypeRecovery')}</span>
                          <span className="detail-value">
                            {type.recovery} {type.recovery > 1 ? t('plans.recovery.days') : t('plans.recovery.day')}
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

        {formData.startDate && formData.endDate && formData.macroPhases.length > 0 && (
          <div className="form-section">
            <h3 className="section-title">{t('plans.form.calendarPlanning')}</h3>
            <p className="section-description">
              {t('plans.form.calendarPlanningDesc')}
            </p>

            <div className="calendar-controls">
              <div className="view-toggle">
                <button
                  type="button"
                  className={`toggle-btn ${calendarView === 'phases' ? 'active' : ''}`}
                  onClick={() => setCalendarView('phases')}
                >
                  {t('plans.form.macroPhaseView')}
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${calendarView === 'weekly' ? 'active' : ''}`}
                  onClick={() => setCalendarView('weekly')}
                >
                  {t('plans.form.weeklyTrainingView')}
                </button>
              </div>
            </div>

            {calendarView === 'phases' && renderPhaseCalendar()}
            {calendarView === 'weekly' && renderWeeklyTraining()}
          </div>
        )}

        <div className="form-section">
          <h3 className="section-title">{t('plans.form.participants')}</h3>
          <p className="section-description">
            {t('plans.form.participantsDesc')}
          </p>
          
          <div className="participants-section">
            <div className="participant-type-selector">
              <button
                type="button"
                className={`type-btn ${selectedParticipantType === 'INDIVIDUAL' ? 'active' : ''}`}
                onClick={() => setSelectedParticipantType('INDIVIDUAL')}
              >
                {t('plans.form.individualSwimmers')}
              </button>
              <button
                type="button"
                className={`type-btn ${selectedParticipantType === 'GROUP' ? 'active' : ''}`}
                onClick={() => setSelectedParticipantType('GROUP')}
              >
                {t('plans.form.groups')}
              </button>
            </div>
            
            {selectedParticipantType === 'INDIVIDUAL' && (
              <div className="individual-selector">
                <select 
                  className="form-select"
                  onChange={(e) => addParticipant('INDIVIDUAL', e.target.value)}
                  value=""
                >
                  <option value="">{t('plans.form.selectSwimmer')}</option>
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
                  <option value="">{t('plans.form.selectGroup')}</option>
                  {availableGroups.map(group => (
                    <option key={group.id} value={group.id}>
                      {group.name} ({group.swimmerCount} {t('plans.form.swimmers')}: {group.swimmerNames.join(', ')}{group.swimmerCount > 3 ? '...' : ''})
                    </option>
                  ))}
                </select>
                
                <div className="groups-preview">
                  {availableGroups.map(group => (
                    <div key={group.id} className="group-preview-card">
                      <h5>{group.name}</h5>
                      <p>{group.swimmerCount} {t('plans.form.swimmers')}</p>
                      <small>{group.swimmerNames.join(', ')}{group.swimmerCount > 3 ? '...' : ''}</small>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="selected-participants">
              {formData.participants && formData.participants.map((participant, index) => (
                <div key={index} className="participant-tag">
                  <span>{participant.participantType === 'INDIVIDUAL' ? t('plans.form.swimmer') : t('plans.form.group')}: {participant.name}</span>
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
              navigate(`/${lang}/admin/traininghub/plans`);
            }}
          >
            {t('plans.form.cancelButton')}
          </button>
          <button 
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading 
              ? (editMode ? t('plans.form.updating') : t('plans.form.creating')) 
              : (editMode ? t('plans.form.updatePlan') : t('plans.form.createPlan'))
            }
          </button>
        </div>
      </form>

      {recoveryAlert && (
        <div className="recovery-alert-modal">
          <div className="alert-modal-content">
            <div className="alert-header">
              <div className="alert-icon">⚠️</div>
              <h3>{t('plans.recoveryModal.title')}</h3>
            </div>
            
            <div className="alert-body">
              <p className="alert-main-message">
                {t('plans.recoveryModal.requiresRecovery', {
                  training: trainingTypes[recoveryAlert.trainingType]?.name,
                  days: recoveryAlert.recoveryNeeded,
                  daysLabel: recoveryAlert.recoveryNeeded === 1 ? t('plans.recovery.day') : t('plans.recovery.days')
                })}
              </p>
              
              <div className="alert-violations">
                <p className="violations-title">{t('plans.recoveryModal.conflictsDetected')}</p>
                <ul className="violations-list">
                  {recoveryAlert.violations.map((violation, index) => (
                    <li key={index}>{violation}</li>
                  ))}
                </ul>
              </div>
              
              <div className="alert-recommendation">
                <p>{t('plans.recoveryModal.recommendation')}</p>
              </div>
            </div>
            
            <div className="alert-actions">
              <button 
                type="button" 
                className="alert-btn alert-btn-cancel"
                onClick={recoveryAlert.onCancel}
              >
                {t('plans.form.cancelButton')}
              </button>
              <button 
                type="button" 
                className="alert-btn alert-btn-confirm"
                onClick={recoveryAlert.onConfirm}
              >
                {t('plans.recoveryModal.continueAnyway')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="plans-container">
      <div className="planificare-header">
        <nav className="planificare-nav">
          <button 
            className="nav-tab"
            onClick={() => navigate(`/${lang}/admin/traininghub`)}
          >
            <span className="tab-icon">📊</span>
            {t('planificare.nav.dashboard')}
          </button>
          <button 
            className="nav-tab"
            onClick={() => navigate(`/${lang}/admin/traininghub/workouts`)}
          >
            <span className="tab-icon">🏊</span>
            {t('planificare.nav.workouts')}
          </button>
          <button 
            className="nav-tab active"
          >
            <span className="tab-icon">📋</span>
            {t('planificare.nav.plans')}
          </button>
        </nav>
      </div>
      
      {activeView === 'overview' && renderOverview()}
      {activeView === 'create' && renderCreatePlan()}
    </div>
  );
};

export default Plans;