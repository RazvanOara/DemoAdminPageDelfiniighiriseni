import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Planificare.css';
import Workouts from './Workouts';

const Planificare = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [plans, setPlans] = useState([]);

  // Set active tab based on current URL
  useEffect(() => {
    if (location.pathname === '/admin/traininghub') {
      setActiveTab('dashboard');
    } else if (location.pathname === '/admin/traininghub/workouts') {
      setActiveTab('workouts');
    } else if (location.pathname === '/admin/traininghub/plans') {
      setActiveTab('plans');
    }
  }, [location.pathname]);

    // Mock data for workouts
    const mockWorkouts = [
      {
        id: 1,
        name: 'Intervale Sprint Craul',
        duration: 45,
        totalDistance: 2000,
        type: 'Sprint',
        difficulty: 'Avansat',
        lastModified: '2025-09-28',
        sets: 5,
        strokes: ['Craul'],
        rawType: 'SPRINT',
        rawLevel: 'AVANSAT'
      },
      {
        id: 2,
        name: 'Tehnică și Exerciții',
        duration: 60,
        totalDistance: 2500,
        type: 'Tehnic',
        difficulty: 'Intermediar',
        lastModified: '2025-09-30',
        sets: 6,
        strokes: ['Spate', 'Craul'],
        rawType: 'TEHNIC',
        rawLevel: 'INTERMEDIAR'
      },
      {
        id: 3,
        name: 'Anduranță Distanță Lungă',
        duration: 90,
        totalDistance: 5000,
        type: 'Rezistență',
        difficulty: 'Avansat',
        lastModified: '2025-09-25',
        sets: 10,
        strokes: ['Craul'],
        rawType: 'REZISTENTA',
        rawLevel: 'AVANSAT'
      },
      {
        id: 4,
        name: 'Seturi Fluture Putere',
        duration: 40,
        totalDistance: 1500,
        type: 'Sprint',
        difficulty: 'Începător',
        lastModified: '2025-09-20',
        sets: 4,
        strokes: ['Fluture'],
        rawType: 'SPRINT',
        rawLevel: 'INCEPATOR'
      },
      {
        id: 5,
        name: 'Antrenament Mixt Poliatlon',
        duration: 70,
        totalDistance: 3000,
        type: 'General',
        difficulty: 'Intermediar',
        lastModified: '2025-09-18',
        sets: 8,
        strokes: ['Mixt', 'Craul', 'Bras'],
        rawType: 'GENERAL',
        rawLevel: 'INTERMEDIAR'
      }
    ];
  
    // Date mock pentru planuri
    const mockPlans = [
      {
        name: 'Plan Pregătire Competițională',
        status: 'Active',
        participants: [{ cursantId: 'inotator1' }, { cursantId: 'inotator2' }],
        keyRaces: [
          {
            name: 'Campionatul Național de Înot',
            raceDate: '2025-10-15',
            raceType: 'target'
          },
          {
            name: 'Calificări Regionale',
            raceDate: '2025-11-05',
            raceType: 'tuneup'
          }
        ]
      },
      {
        name: 'Sezon Tehnică și Corecții',
        status: 'Planned',
        participants: [{ cursantId: 'inotator3' }],
        keyRaces: []
      }
    ];

  // Calculate comprehensive workout statistics
  const calculateWorkoutStats = (workouts) => {
    const totalDistance = workouts.reduce((sum, workout) => sum + (workout.totalDistance || 0), 0);
    const avgDistance = workouts.length > 0 ? Math.round(totalDistance / workouts.length) : 0;
   
    
    // Calculate total training volume in minutes
    const totalVolume = workouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);
    const avgDuration = workouts.length > 0 ? Math.round(totalVolume / workouts.length) : 0;
    
    // Count workouts by type
    const typeDistribution = workouts.reduce((acc, workout) => {
      const type = workout.type || 'General';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Count workouts by difficulty
    const difficultyDistribution = workouts.reduce((acc, workout) => {
      const difficulty = workout.difficulty || 'Intermediar';
      acc[difficulty] = (acc[difficulty] || 0) + 1;
      return acc;
    }, {});

    // Analyze stroke distribution across all workouts
    const strokeDistribution = {};
    workouts.forEach(workout => {
      workout.strokes.forEach(stroke => {
        if (stroke !== 'Unknown') {
          strokeDistribution[stroke] = (strokeDistribution[stroke] || 0) + 1;
        }
      });
    });

    // Calculate intensity distribution (based on difficulty)
    const intensityScore = workouts.reduce((sum, workout) => {
      const scores = { 'Începător': 1, 'Intermediar': 2, 'Avansat': 3 };
      return sum + (scores[workout.difficulty] || 2);
    }, 0);
    const avgIntensity = workouts.length > 0 ? (intensityScore / workouts.length).toFixed(1) : 0;

    // Recent activity (workouts modified in last 7 days, 30 days)
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentWorkouts = workouts.filter(workout => 
      new Date(workout.lastModified) > oneWeekAgo
    ).length;
    
    const monthlyWorkouts = workouts.filter(workout => 
      new Date(workout.lastModified) > oneMonthAgo
    ).length;

    // Calculate training load per week
    const weeklyLoad = Math.round((totalDistance / 4) / 1000); // Assume 4 weeks, convert to km

    // Identify most used workout type
    const mostUsedType = Object.entries(typeDistribution).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

    // Calculate workout variety score (0-100)
    const uniqueTypes = Object.keys(typeDistribution).length;
    const varietyScore = Math.min(100, (uniqueTypes / 5) * 100);

    return {
      totalDistance,
      avgDistance,
      totalVolume,
      avgDuration,
      typeDistribution,
      difficultyDistribution,
      strokeDistribution,
      avgIntensity,
      recentWorkouts,
      monthlyWorkouts,
      weeklyLoad,
      mostUsedType,
      varietyScore
    };
  };

  const calculatePlanStats = (plans) => {
    const activePlans = plans.filter(p => p.status === 'Active' || p.status === 'ACTIVE').length;
    const totalAthletes = new Set(
      plans.flatMap(plan => 
        (plan.participants || []).map(p => p.cursantId || p.groupId)
      )
    ).size;
    
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const upcomingRaces = plans.flatMap(plan => 
      (plan.keyRaces || []).map(race => {
        const raceDate = new Date(race.raceDate || race.date);
        raceDate.setHours(0, 0, 0, 0);
        const daysUntil = Math.ceil((raceDate - now) / (1000 * 60 * 60 * 24));
        
        return {
          planName: plan.name,
          raceName: race.name,
          date: raceDate,
          type: race.raceType || race.type,
          daysUntil: daysUntil,
          formattedDate: raceDate.toLocaleDateString('ro-RO', { 
            day: '2-digit', 
            month: 'short',
            year: 'numeric'
          })
        };
      })
    ).filter(race => race.daysUntil >= 0)
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 6);
  
    return {
      activePlans,
      totalAthletes,
      upcomingRaces
    };
  };
  

  // Fetch workouts from API
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setWorkouts(mockWorkouts);
      setIsLoading(false);
    }, 500); // fake delay
  }, []);


  const calculateWorkoutDuration = (workout) => {
    if (!workout.items || workout.items.length === 0) return 0;
    
    const calculateItemDuration = (items) => {
      return items.reduce((total, item) => {
        if (item.type === 'REPEAT' && item.childItems) {
          const childDuration = calculateItemDuration(item.childItems);
          return total + (childDuration * item.repeats);
        }
        
        if (item.stepType === 'REST') {
          return total + (item.rest || 30);
        }
        
        const distance = item.distance || 0;
        let pacePerMeter = 1.5;
        
        switch (item.effort) {
          case 'RECOVERY':
          case 'EASY':
            pacePerMeter = 2.0;
            break;
          case 'MODERATE':
            pacePerMeter = 1.5;
            break;
          case 'HARD':
          case 'VERY_HARD':
            pacePerMeter = 1.2;
            break;
          case 'SPRINT':
          case 'ALL_OUT':
            pacePerMeter = 1.0;
            break;
          default:
            pacePerMeter = 1.5;
            break;
        }
        
        const swimTime = distance * pacePerMeter;
        const restTime = 15;
        
        return total + swimTime + restTime;
      }, 0);
    };
    
    const totalSeconds = calculateItemDuration(workout.items);
    return Math.round(totalSeconds / 60);
  };

  // Fetch plans from API
  useEffect(() => {
    setPlans(mockPlans);
  }, []);



  const getWorkoutStrokes = (workout) => {
    if (!workout.items || workout.items.length === 0) return ['Unknown'];
    
    const strokeCounts = {};
    
    const countStrokes = (items) => {
      items.forEach(item => {
        if (item.type === 'REPEAT' && item.childItems) {
          countStrokes(item.childItems);
        } else if (item.stroke && item.stepType !== 'REST') {
          const distance = item.distance || 0;
          const repeats = item.repeats || 1;
          const totalDistance = distance * repeats;
          
          strokeCounts[item.stroke] = (strokeCounts[item.stroke] || 0) + totalDistance;
        }
      });
    };
    
    countStrokes(workout.items);
    
    const strokeLabels = {
      'FREESTYLE': 'Freestyle',
      'BACKSTROKE': 'Backstroke', 
      'BREASTSTROKE': 'Breaststroke',
      'BUTTERFLY': 'Butterfly',
      'IM': 'IM',
      'IM_BY_ROUND': 'IM by Round',
      'REVERSE_IM': 'Reverse IM',
      'CHOICE': 'Choice',
      'MIXED': 'Mixed'
    };
    
    const sortedStrokes = Object.entries(strokeCounts)
      .sort(([,a], [,b]) => b - a)
      .map(([stroke]) => strokeLabels[stroke] || stroke);
    
    if (sortedStrokes.length === 0) return ['Unknown'];
    if (sortedStrokes.length === 1) return sortedStrokes;
    if (sortedStrokes.length > 3) return ['Mixed'];
    
    return sortedStrokes;
  };

  const formatEnumValue = (value) => {
    if (!value) return value;
    
    const enumMappings = {
      'SPRINT': 'Sprint',
      'REZISTENTA': 'Rezistență',
      'TEHNIC': 'Tehnic',
      'RECUPERARE': 'Recuperare',
      'GENERAL': 'General',
      'INCEPATOR': 'Începător',
      'INTERMEDIAR': 'Intermediar',
      'AVANSAT': 'Avansat'
    };
    
    return enumMappings[value] || value;
  };

  const workoutStats = calculateWorkoutStats(workouts);
  const planStats = calculatePlanStats(plans);

  const stats = {
    totalWorkouts: workouts.length,
    activePlans: plans.filter(p => p.status === 'Active').length,
    totalPlans: plans.length,
    totalAthletes: plans.reduce((sum, plan) => sum + (plan.participants?.length || 0), 0),
    weeklyWorkouts: workoutStats.recentWorkouts
  };

  const QuickActionCard = ({ icon, title, description, onClick, className }) => (
    <div className={`quick-action-card ${className}`} onClick={onClick}>
      <div className="quick-action-icon">{icon}</div>
      <h3 className="quick-action-title">{title}</h3>
      <p className="quick-action-description">{description}</p>
      <div className="quick-action-arrow">→</div>
    </div>
  );

  const StatCard = ({ icon, value, label, trend, subtext, highlight }) => (
    <div className={`stat-card ${highlight ? 'highlight' : ''}`}>
      <div className="stat-card-header">
        <span className="stat-card-icon">{icon}</span>
        {trend && <span className={`trend ${trend > 0 ? 'positive' : 'negative'}`}>
          {trend > 0 ? '↗️' : '↘️'} {Math.abs(trend)}%
        </span>}
      </div>
      <div className="stat-card-content">
        <span className="stat-card-value">{value}</span>
        <span className="stat-card-label">{label}</span>
        {subtext && <span className="stat-card-subtext">{subtext}</span>}
      </div>
    </div>
  );

  const InsightCard = ({ title, children, type }) => (
    <div className={`insight-card ${type || ''}`}>
      <h4 className="insight-title">{title}</h4>
      <div className="insight-content">
        {children}
      </div>
    </div>
  );

  const RecentWorkoutCard = ({ workout }) => (
    <div className="recent-workout-card" onClick={() => navigate(`/admin/traininghub/edit-workout/${workout.id}`)}>
      <div className="recent-workout-header">
        <h4 className="recent-workout-name">{workout.name}</h4>
        <span className={`difficulty-mini-badge ${workout.difficulty.toLowerCase()}`}>
          {workout.difficulty}
        </span>
      </div>
      <div className="recent-workout-stats">
        <span className="workout-distance">{workout.totalDistance}m</span>
        <span className="workout-duration">{workout.duration} min</span>
        <span className="workout-type">{workout.type}</span>
      </div>
      <div className="recent-workout-date">
        Modificat: {workout.lastModified}
      </div>
    </div>
  );

  const CoachInsightBadge = ({ type, message }) => {
    const icons = {
      warning: '⚠️',
      success: '✅',
      info: 'ℹ️',
      tip: '💡'
    };
    
    return (
      <div className={`coach-insight-badge ${type}`}>
        <span className="insight-badge-icon">{icons[type]}</span>
        <span className="insight-badge-text">{message}</span>
      </div>
    );
  };

  const renderDashboard = () => {
    const recentWorkouts = workouts
      .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
      .slice(0, 5);

    // Generate coaching insights
    const insights = [];
    
    if (workoutStats.varietyScore < 60) {
      insights.push({
        type: 'warning',
        message: 'Consideră adăugarea mai multei varietăți în tipurile de antrenament'
      });
    }
    
    if (workoutStats.avgIntensity < 1.5) {
      insights.push({
        type: 'tip',
        message: 'Intensitatea medie este scăzută - poate e timpul pentru provocări mai mari'
      });
    }
    
    if (workoutStats.recentWorkouts === 0) {
      insights.push({
        type: 'info',
        message: 'Niciun antrenament nou în ultima săptămână'
      });
    }
    
    const strokeEntries = Object.entries(workoutStats.strokeDistribution);
    if (strokeEntries.length > 0) {
      const dominantStroke = strokeEntries.sort(([,a], [,b]) => b - a)[0][0];
      if (strokeEntries.length === 1) {
        insights.push({
          type: 'warning',
          message: `Toate antrenamentele folosesc ${dominantStroke} - adaugă varietate de stiluri`
        });
      }
    }

    if (workoutStats.weeklyLoad > 15) {
      insights.push({
        type: 'success',
        message: 'Volum săptămânal excelent pentru progres consistent'
      });
    }

    return (
      <div className="planificare-dashboard">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Centrul de Programare</h2>
          <p className="dashboard-subtitle">Gestionează programele și antrenamentele tale</p>
        </div>
        
        <div className="stats-grid">
          <StatCard 
            icon="🏊" 
            value={stats.totalWorkouts} 
            label="Total Antrenamente"
            subtext={`${(workoutStats.totalDistance / 1000).toFixed(1)}km distanță totală`}
          />
          <StatCard 
            icon="⏱️" 
            value={workoutStats.totalVolume} 
            label="Volum Total"
            subtext={`${workoutStats.avgDuration} min per antrenament`}
          />
          <StatCard 
            icon="📊" 
            value={`${(workoutStats.avgDistance / 1000).toFixed(1)}km`}
            label="Distanță Medie"
            subtext="per antrenament"
            highlight={workoutStats.avgDistance > 3000}
          />
          <StatCard 
            icon="🔥" 
            value={workoutStats.avgIntensity} 
            label="Intensitate Medie"
            subtext="1=Începător, 3=Avansat"
          />
          <StatCard 
            icon="📈" 
            value={`${workoutStats.weeklyLoad}km`}
            label="Volum Săptămânal"
            subtext="medie estimată"
          />
          <StatCard 
            icon="⚡" 
            value={workoutStats.recentWorkouts} 
            label="Activitate Recentă"
            subtext="antrenamente în 7 zile"
          />
        </div>

        {insights.length > 0 && (
          <div className="coaching-insights-section">
            <h3 className="section-title">💡 Recomandări pentru Antrenor</h3>
            <div className="coaching-insights-grid">
              {insights.map((insight, idx) => (
                <CoachInsightBadge key={idx} type={insight.type} message={insight.message} />
              ))}
            </div>
          </div>
        )}
        
        <div className="quick-actions-section">
          <h3 className="section-title">Acțiuni Rapide</h3>
          <div className="quick-actions-grid">
            <QuickActionCard
              icon="➕"
              title="Creează Antrenament"
              description="Construiește un antrenament nou cu seturile și intervalele dorite"
              onClick={() => navigate('/admin/traininghub/create-workout')}
              className="create-workout"
            />
           
            <QuickActionCard
              icon="📋"
              title="Planificare Avansată"
              description="Creează planuri pe termen lung pentru competiții și periodizare"
              onClick={() => navigate('/admin/traininghub/plans')}
              className="create-plan"
            />
            <QuickActionCard
              icon="📊"
              title="Analize și Statistici"
              description="Vizualizează progresul și metricile de performanță"
              onClick={() => {}}
              className="analytics"
            />
          </div>
        </div>

        <div className="dashboard-insights">
          <div className="insights-grid">
            <InsightCard title="Distribuție Stiluri de Înot" type="stroke-distribution">
              <div className="stroke-chart">
                {Object.entries(workoutStats.strokeDistribution).length > 0 ? (
                  Object.entries(workoutStats.strokeDistribution)
                    .sort(([,a], [,b]) => b - a)
                    .map(([stroke, count]) => (
                      <div key={stroke} className="stroke-item">
                        <span className="stroke-label">{stroke}</span>
                        <div className="stroke-bar">
                          <div 
                            className="stroke-fill"
                            style={{ 
                              width: `${(count / Math.max(...Object.values(workoutStats.strokeDistribution))) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <span className="stroke-count">{count}</span>
                      </div>
                    ))
                ) : (
                  <p className="no-data">Nu există date disponibile</p>
                )}
              </div>
            </InsightCard>

            <InsightCard title="Distribuție pe Tipuri" type="type-distribution">
              <div className="distribution-chart">
                {Object.entries(workoutStats.typeDistribution).map(([type, count]) => {
                  const percentage = ((count / stats.totalWorkouts) * 100).toFixed(0);
                  return (
                    <div key={type} className="distribution-item">
                      <span className="distribution-label">{type}</span>
                      <div className="distribution-bar">
                        <div 
                          className="distribution-fill"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="distribution-count">{count} ({percentage}%)</span>
                    </div>
                  );
                })}
              </div>
            </InsightCard>

            <InsightCard title="Niveluri de Dificultate" type="difficulty-breakdown">
              <div className="difficulty-breakdown">
                {Object.entries(workoutStats.difficultyDistribution).map(([difficulty, count]) => {
                  const percentage = ((count / stats.totalWorkouts) * 100).toFixed(0);
                  return (
                    <div key={difficulty} className="difficulty-item">
                      <span className={`difficulty-indicator ${difficulty.toLowerCase()}`}></span>
                      <span className="difficulty-name">{difficulty}</span>
                      <span className="difficulty-count">{count} ({percentage}%)</span>
                    </div>
                  );
                })}
              </div>
            </InsightCard>

          </div>
        </div>
        {planStats.upcomingRaces.length > 0 && (
  <div className="upcoming-races-section">
    <h3 className="section-title">Competiții Viitoare</h3>
    <div className="races-timeline">
      {planStats.upcomingRaces.map((race, idx) => (
        <div key={idx} className="race-timeline-item">
          <div className="race-date-badge">
            <span className="race-days">{race.daysUntil}</span>
            <span className="race-days-label">
              {race.daysUntil === 0 ? 'astăzi' : 
               race.daysUntil === 1 ? 'zi' : 'zile'}
            </span>
          </div>
          <div className="race-info">
            <h4 className="race-name">{race.raceName}</h4>
            <p className="race-plan">
              <span className="race-plan-label">Plan:</span> {race.planName}
            </p>
            <p className="race-date-text">{race.formattedDate}</p>
            <span className={`race-type-badge ${race.type}`}>
              {race.type === 'target' ? '🎯 Cursă Țintă' : 
               race.type === 'tuneup' ? '🏃 Pregătire' : 
               '📊 Test'}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
        <div className="training-summary-section">
          <h3 className="section-title">📋 Sumar Planificare</h3>
          <div className="training-summary-grid">
            <div className="summary-card">
              <div className="summary-header">
                <span className="summary-icon">🎯</span>
                <h4>Tipul Predominant</h4>
              </div>
              <div className="summary-value">{workoutStats.mostUsedType}</div>
              <div className="summary-subtext">
                {workoutStats.typeDistribution[workoutStats.mostUsedType] || 0} antrenamente
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-header">
                <span className="summary-icon">📅</span>
                <h4>Activitate Lunară</h4>
              </div>
              <div className="summary-value">{workoutStats.monthlyWorkouts}</div>
              <div className="summary-subtext">antrenamente în ultimele 30 zile</div>
            </div>

            <div className="summary-card">
              <div className="summary-header">
                <span className="summary-icon">💪</span>
                <h4>Progresie</h4>
              </div>
              <div className="summary-value">
                {workoutStats.difficultyDistribution['Avansat'] || 0}
              </div>
              <div className="summary-subtext">antrenamente avansate</div>
            </div>

            <div className="summary-card">
              <div className="summary-header">
                <span className="summary-icon">⏰</span>
                <h4>Durată Medie</h4>
              </div>
              <div className="summary-value">{workoutStats.avgDuration} min</div>
              <div className="summary-subtext">per sesiune de antrenament</div>
            </div>
          </div>
        </div>
        
        {recentWorkouts.length > 0 && (
          <div className="recent-section">
            <div className="section-header">
              <h3 className="section-title">Antrenamente Recente</h3>
              <button 
                className="view-all-btn"
                onClick={() => navigate('/admin/traininghub/workouts')}
              >
                Vezi Toate →
              </button>
            </div>
            <div className="recent-workouts-grid">
              {recentWorkouts.map(workout => (
                <RecentWorkoutCard key={workout.id} workout={workout} />
              ))}
            </div>
          </div>
        )}

        {workouts.length === 0 && !isLoading && (
          <div className="getting-started">
            <div className="getting-started-content">
              <h3>Să începem!</h3>
              <p>Nu ai încă antrenamente create. Începe prin a crea primul tău antrenament pentru a începe să vezi statistici și analize utile.</p>
              <button 
                className="btn-primary"
                onClick={() => navigate('/admin/traininghub/create-workout')}
              >
                Creează Primul Antrenament
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderWorkouts = () => (
    <div className="planificare-workouts">
      <Workouts />
    </div>
  );

  return (
    <div className="planificare-container">
      <div className="planificare-header">
        <nav className="planificare-nav">
          <button 
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => navigate('/admin/traininghub')}
          >
            <span className="tab-icon">📊</span>
            Tablou de Bord
          </button>
          <button 
            className={`nav-tab ${activeTab === 'workouts' ? 'active' : ''}`}
            onClick={() => navigate('/admin/traininghub/workouts')}
          >
            <span className="tab-icon">🏊</span>
            Antrenamente
          </button>
          <button 
            className={`nav-tab ${activeTab === 'plans' ? 'active' : ''}`}
            onClick={() => navigate('/admin/traininghub/plans')}
          >
            <span className="tab-icon">📋</span>
            Planuri
          </button>
        </nav>
      </div>
      
      <div className="planificare-content">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'workouts' && renderWorkouts()}
      </div>
    </div>
  );
};

export default Planificare;