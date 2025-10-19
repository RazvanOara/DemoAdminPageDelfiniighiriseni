import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Planificare.css';
import Workouts from './Workouts';

const Planificare = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const pathWithoutLang = location.pathname.replace(/^\/(ro|en)/, '');
    if (pathWithoutLang === '/admin/traininghub') {
      setActiveTab('dashboard');
    } else if (pathWithoutLang === '/admin/traininghub/workouts') {
      setActiveTab('workouts');
    } else if (pathWithoutLang === '/admin/traininghub/plans') {
      setActiveTab('plans');
    }
  }, [location.pathname]);

  const mockWorkouts = useMemo(() => [
    {
      id: 1,
      name: t('planificare.mockWorkouts.sprintIntervals'),
      duration: 45,
      totalDistance: 2000,
      type: t('planificare.workoutTypes.sprint'),
      difficulty: t('planificare.difficulties.advanced'),
      lastModified: '2025-09-28',
      sets: 5,
      strokes: [t('planificare.strokes.freestyle')],
      rawType: 'SPRINT',
      rawLevel: 'AVANSAT'
    },
    {
      id: 2,
      name: t('planificare.mockWorkouts.techniqueDrills'),
      duration: 60,
      totalDistance: 2500,
      type: t('planificare.workoutTypes.technical'),
      difficulty: t('planificare.difficulties.intermediate'),
      lastModified: '2025-09-30',
      sets: 6,
      strokes: [t('planificare.strokes.backstroke'), t('planificare.strokes.freestyle')],
      rawType: 'TEHNIC',
      rawLevel: 'INTERMEDIAR'
    },
    {
      id: 3,
      name: t('planificare.mockWorkouts.longDistance'),
      duration: 90,
      totalDistance: 5000,
      type: t('planificare.workoutTypes.endurance'),
      difficulty: t('planificare.difficulties.advanced'),
      lastModified: '2025-09-25',
      sets: 10,
      strokes: [t('planificare.strokes.freestyle')],
      rawType: 'REZISTENTA',
      rawLevel: 'AVANSAT'
    },
    {
      id: 4,
      name: t('planificare.mockWorkouts.butterflyPower'),
      duration: 40,
      totalDistance: 1500,
      type: t('planificare.workoutTypes.sprint'),
      difficulty: t('planificare.difficulties.beginner'),
      lastModified: '2025-09-20',
      sets: 4,
      strokes: [t('planificare.strokes.butterfly')],
      rawType: 'SPRINT',
      rawLevel: 'INCEPATOR'
    },
    {
      id: 5,
      name: t('planificare.mockWorkouts.mixedMedley'),
      duration: 70,
      totalDistance: 3000,
      type: t('planificare.workoutTypes.general'),
      difficulty: t('planificare.difficulties.intermediate'),
      lastModified: '2025-09-18',
      sets: 8,
      strokes: [t('planificare.strokes.mixed'), t('planificare.strokes.freestyle'), t('planificare.strokes.breaststroke')],
      rawType: 'GENERAL',
      rawLevel: 'INTERMEDIAR'
    }
  ], [t]);

  const mockPlans = useMemo(() => [
    {
      name: t('planificare.mockPlans.competitionPrep'),
      status: 'Active',
      participants: [{ cursantId: 'inotator1' }, { cursantId: 'inotator2' }],
      keyRaces: [
        {
          name: t('planificare.mockPlans.nationalChampionship'),
          raceDate: '2025-10-15',
          raceType: 'target'
        },
        {
          name: t('planificare.mockPlans.regionalQualifiers'),
          raceDate: '2025-11-05',
          raceType: 'tuneup'
        }
      ]
    },
    {
      name: t('planificare.mockPlans.techniqueSeason'),
      status: 'Planned',
      participants: [{ cursantId: 'inotator3' }],
      keyRaces: []
    }
  ], [t]);

  const calculateWorkoutStats = (workouts) => {
    const totalDistance = workouts.reduce((sum, workout) => sum + (workout.totalDistance || 0), 0);
    const avgDistance = workouts.length > 0 ? Math.round(totalDistance / workouts.length) : 0;
    
    const totalVolume = workouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);
    const avgDuration = workouts.length > 0 ? Math.round(totalVolume / workouts.length) : 0;
    
    const typeDistribution = workouts.reduce((acc, workout) => {
      const type = workout.type || t('planificare.workoutTypes.general');
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const difficultyDistribution = workouts.reduce((acc, workout) => {
      const difficulty = workout.difficulty || t('planificare.difficulties.intermediate');
      acc[difficulty] = (acc[difficulty] || 0) + 1;
      return acc;
    }, {});

    const strokeDistribution = {};
    workouts.forEach(workout => {
      workout.strokes.forEach(stroke => {
        if (stroke !== 'Unknown') {
          strokeDistribution[stroke] = (strokeDistribution[stroke] || 0) + 1;
        }
      });
    });

    const intensityScore = workouts.reduce((sum, workout) => {
      const scores = { 
        [t('planificare.difficulties.beginner')]: 1, 
        [t('planificare.difficulties.intermediate')]: 2, 
        [t('planificare.difficulties.advanced')]: 3 
      };
      return sum + (scores[workout.difficulty] || 2);
    }, 0);
    const avgIntensity = workouts.length > 0 ? (intensityScore / workouts.length).toFixed(1) : 0;

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentWorkouts = workouts.filter(workout => 
      new Date(workout.lastModified) > oneWeekAgo
    ).length;
    
    const monthlyWorkouts = workouts.filter(workout => 
      new Date(workout.lastModified) > oneMonthAgo
    ).length;

    const weeklyLoad = Math.round((totalDistance / 4) / 1000);

    const mostUsedType = Object.entries(typeDistribution).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

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

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setWorkouts(mockWorkouts);
      setIsLoading(false);
    }, 500);
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
      'FREESTYLE': t('planificare.strokes.freestyle'),
      'BACKSTROKE': t('planificare.strokes.backstroke'), 
      'BREASTSTROKE': t('planificare.strokes.breaststroke'),
      'BUTTERFLY': t('planificare.strokes.butterfly'),
      'IM': t('planificare.strokes.im'),
      'IM_BY_ROUND': t('planificare.strokes.imByRound'),
      'REVERSE_IM': t('planificare.strokes.reverseIm'),
      'CHOICE': t('planificare.strokes.choice'),
      'MIXED': t('planificare.strokes.mixed')
    };
    
    const sortedStrokes = Object.entries(strokeCounts)
      .sort(([,a], [,b]) => b - a)
      .map(([stroke]) => strokeLabels[stroke] || stroke);
    
    if (sortedStrokes.length === 0) return ['Unknown'];
    if (sortedStrokes.length === 1) return sortedStrokes;
    if (sortedStrokes.length > 3) return [t('planificare.strokes.mixed')];
    
    return sortedStrokes;
  };

  const formatEnumValue = (value) => {
    if (!value) return value;
    
    const enumMappings = {
      'SPRINT': t('planificare.workoutTypes.sprint'),
      'REZISTENTA': t('planificare.workoutTypes.endurance'),
      'TEHNIC': t('planificare.workoutTypes.technical'),
      'RECUPERARE': t('planificare.workoutTypes.recovery'),
      'GENERAL': t('planificare.workoutTypes.general'),
      'INCEPATOR': t('planificare.difficulties.beginner'),
      'INTERMEDIAR': t('planificare.difficulties.intermediate'),
      'AVANSAT': t('planificare.difficulties.advanced')
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
    <div className="recent-workout-card" onClick={() => navigate(`/${lang}/admin/traininghub/edit-workout/${workout.id}`)}>
      <div className="recent-workout-header">
        <h4 className="recent-workout-name">{workout.name}</h4>
        <span className={`difficulty-mini-badge ${workout.difficulty.toLowerCase()}`}>
          {workout.difficulty}
        </span>
      </div>
      <div className="recent-workout-stats">
        <span className="workout-distance">{workout.totalDistance}m</span>
        <span className="workout-duration">{workout.duration} {t('planificare.units.minutes')}</span>
        <span className="workout-type">{workout.type}</span>
      </div>
      <div className="recent-workout-date">
        {t('planificare.labels.modified')}: {workout.lastModified}
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

    const insights = [];
    
    if (workoutStats.varietyScore < 60) {
      insights.push({
        type: 'warning',
        message: t('planificare.insights.addVariety')
      });
    }
    
    if (workoutStats.avgIntensity < 1.5) {
      insights.push({
        type: 'tip',
        message: t('planificare.insights.lowIntensity')
      });
    }
    
    if (workoutStats.recentWorkouts === 0) {
      insights.push({
        type: 'info',
        message: t('planificare.insights.noRecentWorkouts')
      });
    }
    
    const strokeEntries = Object.entries(workoutStats.strokeDistribution);
    if (strokeEntries.length > 0) {
      const dominantStroke = strokeEntries.sort(([,a], [,b]) => b - a)[0][0];
      if (strokeEntries.length === 1) {
        insights.push({
          type: 'warning',
          message: t('planificare.insights.singleStroke', { stroke: dominantStroke })
        });
      }
    }

    if (workoutStats.weeklyLoad > 15) {
      insights.push({
        type: 'success',
        message: t('planificare.insights.excellentVolume')
      });
    }

    return (
      <div className="planificare-dashboard">
        <div className="dashboard-header">
          <h2 className="dashboard-title">{t('planificare.dashboard.title')}</h2>
          <p className="dashboard-subtitle">{t('planificare.dashboard.subtitle')}</p>
        </div>
        
        <div className="stats-grid">
          <StatCard 
            icon="🏊" 
            value={stats.totalWorkouts} 
            label={t('planificare.stats.totalWorkouts')}
            subtext={t('planificare.stats.totalDistanceSubtext', { distance: (workoutStats.totalDistance / 1000).toFixed(1) })}
          />
          <StatCard 
            icon="⏱️" 
            value={workoutStats.totalVolume} 
            label={t('planificare.stats.totalVolume')}
            subtext={t('planificare.stats.avgDurationSubtext', { duration: workoutStats.avgDuration })}
          />
          <StatCard 
            icon="📊" 
            value={`${(workoutStats.avgDistance / 1000).toFixed(1)}km`}
            label={t('planificare.stats.avgDistance')}
            subtext={t('planificare.stats.perWorkout')}
            highlight={workoutStats.avgDistance > 3000}
          />
          <StatCard 
            icon="🔥" 
            value={workoutStats.avgIntensity} 
            label={t('planificare.stats.avgIntensity')}
            subtext={t('planificare.stats.intensityScale')}
          />
          <StatCard 
            icon="📈" 
            value={`${workoutStats.weeklyLoad}km`}
            label={t('planificare.stats.weeklyVolume')}
            subtext={t('planificare.stats.estimatedAverage')}
          />
          <StatCard 
            icon="⚡" 
            value={workoutStats.recentWorkouts} 
            label={t('planificare.stats.recentActivity')}
            subtext={t('planificare.stats.workoutsIn7Days')}
          />
        </div>

        {insights.length > 0 && (
          <div className="coaching-insights-section">
            <h3 className="section-title">{t('planificare.sections.coachRecommendations')}</h3>
            <div className="coaching-insights-grid">
              {insights.map((insight, idx) => (
                <CoachInsightBadge key={idx} type={insight.type} message={insight.message} />
              ))}
            </div>
          </div>
        )}
        
        <div className="quick-actions-section">
          <h3 className="section-title">{t('planificare.sections.quickActions')}</h3>
          <div className="quick-actions-grid">
            <QuickActionCard
              icon="➕"
              title={t('planificare.quickActions.createWorkout.title')}
              description={t('planificare.quickActions.createWorkout.description')}
              onClick={() => navigate(`/${lang}/admin/traininghub/create-workout`)}
              className="create-workout"
            />
           
            <QuickActionCard
              icon="📋"
              title={t('planificare.quickActions.advancedPlanning.title')}
              description={t('planificare.quickActions.advancedPlanning.description')}
              onClick={() => navigate(`/${lang}/admin/traininghub/plans`)}
              className="create-plan"
            />
            <QuickActionCard
              icon="📊"
              title={t('planificare.quickActions.analytics.title')}
              description={t('planificare.quickActions.analytics.description')}
              onClick={() => {}}
              className="analytics"
            />
          </div>
        </div>

        <div className="dashboard-insights">
          <div className="insights-grid">
            <InsightCard title={t('planificare.insights.strokeDistribution')} type="stroke-distribution">
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
                  <p className="no-data">{t('planificare.labels.noDataAvailable')}</p>
                )}
              </div>
            </InsightCard>

            <InsightCard title={t('planificare.insights.typeDistribution')} type="type-distribution">
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

            <InsightCard title={t('planificare.insights.difficultyBreakdown')} type="difficulty-breakdown">
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
            <h3 className="section-title">{t('planificare.sections.upcomingRaces')}</h3>
            <div className="races-timeline">
              {planStats.upcomingRaces.map((race, idx) => (
                <div key={idx} className="race-timeline-item">
                  <div className="race-date-badge">
                    <span className="race-days">{race.daysUntil}</span>
                    <span className="race-days-label">
                      {race.daysUntil === 0 ? t('planificare.time.today') : 
                       race.daysUntil === 1 ? t('planificare.time.day') : t('planificare.time.days')}
                    </span>
                  </div>
                  <div className="race-info">
                    <h4 className="race-name">{race.raceName}</h4>
                    <p className="race-plan">
                      <span className="race-plan-label">{t('planificare.labels.plan')}:</span> {race.planName}
                    </p>
                    <p className="race-date-text">{race.formattedDate}</p>
                    <span className={`race-type-badge ${race.type}`}>
                      {race.type === 'target' ? t('planificare.raceTypes.target') : 
                       race.type === 'tuneup' ? t('planificare.raceTypes.tuneup') : 
                       t('planificare.raceTypes.test')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="training-summary-section">
          <h3 className="section-title">{t('planificare.sections.trainingSummary')}</h3>
          <div className="training-summary-grid">
            <div className="summary-card">
              <div className="summary-header">
                <span className="summary-icon">🎯</span>
                <h4>{t('planificare.summary.predominantType')}</h4>
              </div>
              <div className="summary-value">{workoutStats.mostUsedType}</div>
              <div className="summary-subtext">
                {t('planificare.summary.workouts', { count: workoutStats.typeDistribution[workoutStats.mostUsedType] || 0 })}
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-header">
                <span className="summary-icon">📅</span>
                <h4>{t('planificare.summary.monthlyActivity')}</h4>
              </div>
              <div className="summary-value">{workoutStats.monthlyWorkouts}</div>
              <div className="summary-subtext">{t('planificare.summary.workoutsLast30Days')}</div>
            </div>

            <div className="summary-card">
              <div className="summary-header">
                <span className="summary-icon">💪</span>
                <h4>{t('planificare.summary.progression')}</h4>
              </div>
              <div className="summary-value">
                {workoutStats.difficultyDistribution[t('planificare.difficulties.advanced')] || 0}
              </div>
              <div className="summary-subtext">{t('planificare.summary.advancedWorkouts')}</div>
            </div>

            <div className="summary-card">
              <div className="summary-header">
                <span className="summary-icon">⏰</span>
                <h4>{t('planificare.summary.avgDuration')}</h4>
              </div>
              <div className="summary-value">{workoutStats.avgDuration} {t('planificare.units.minutes')}</div>
              <div className="summary-subtext">{t('planificare.summary.perTrainingSession')}</div>
            </div>
          </div>
        </div>
        
        {recentWorkouts.length > 0 && (
          <div className="recent-section">
            <div className="section-header">
              <h3 className="section-title">{t('planificare.sections.recentWorkouts')}</h3>
              <button 
                className="view-all-btn"
                onClick={() => navigate(`/${lang}/admin/traininghub/workouts`)}
              >
                {t('planificare.buttons.viewAll')} →
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
              <h3>{t('planificare.gettingStarted.title')}</h3>
              <p>{t('planificare.gettingStarted.description')}</p>
              <button 
                className="btn-primary"
                onClick={() => navigate(`/${lang}/admin/traininghub/create-workout`)}
              >
                {t('planificare.gettingStarted.createFirst')}
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
  onClick={(e) => {
    e.preventDefault();
    navigate(`/${lang || 'ro'}/admin/traininghub`);
  }}
>
            <span className="tab-icon">📊</span>
            {t('planificare.nav.dashboard')}
          </button>
          <button 
  className={`nav-tab ${activeTab === 'workouts' ? 'active' : ''}`}
  onClick={(e) => {
    e.preventDefault();
    navigate(`/${lang || 'ro'}/admin/traininghub/workouts`);
  }}
>
            <span className="tab-icon">🏊</span>
            {t('planificare.nav.workouts')}
          </button>
          <button 
  className={`nav-tab ${activeTab === 'plans' ? 'active' : ''}`}
  onClick={(e) => {
    e.preventDefault();
    navigate(`/${lang || 'ro'}/admin/traininghub/plans`);
  }}
>
            <span className="tab-icon">📋</span>
            {t('planificare.nav.plans')}
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