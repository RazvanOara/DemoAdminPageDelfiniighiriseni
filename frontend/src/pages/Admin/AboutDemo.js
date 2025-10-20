import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const AboutDemo = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useParams();
  const [expandedSection, setExpandedSection] = useState(null);
  const [showLangMenu, setShowLangMenu] = useState(false);
  
  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };
  const changeLanguage = (newLang) => {
    // Get current path without language
    const pathParts = location.pathname.split('/').filter(p => p);
    
    // Remove current language if it exists at the start
    if (pathParts.length > 0 && ['ro', 'en', 'hu', 'de', 'es'].includes(pathParts[0])) {
      pathParts.shift();
    }
    
    // Build new path with new language
    const newPath = `/${newLang}/${pathParts.join('/')}`;
    
    // Change i18n language and navigate
    i18n.changeLanguage(newLang);
    navigate(newPath);
  };

  // Helper function to create language-aware links
  const createLink = (path) => `/${lang || 'ro'}${path}`;
  const langRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setShowLangMenu(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);
  const sections = [
    {
      id: "users",
      icon: "👥",
      title: t('aboutDemo.sections.users.title'),
      color: "#4F46E5",
      link: createLink('/admin/users'),
      content: (
        <>
          <p>
            {t('aboutDemo.sections.users.intro')}
            <em>{t('aboutDemo.sections.users.enrollmentForm')}</em>, <em>{t('aboutDemo.sections.users.declaration')}</em>, <em>{t('aboutDemo.sections.users.medicalCert')}</em>.
          </p>
          <ul>
            <li>
              {t('aboutDemo.sections.users.canBeFiltered')} <strong>{t('aboutDemo.sections.users.filtered')}</strong> {t('aboutDemo.sections.users.afterCriteria')}
            </li>
            <li>
              {t('aboutDemo.sections.users.expiresAuto')} <strong>{t('aboutDemo.sections.users.expired')}</strong> {t('aboutDemo.sections.users.orDeleted')}
            </li>
            <li>
              {t('aboutDemo.sections.users.allCanExport')} <strong>{t('aboutDemo.sections.users.exported')}</strong> {t('aboutDemo.sections.users.csvReport')}
            </li>
          </ul>
        </>
      )
    },
    {
      id: "sessions",
      icon: "📅",
      title: t('aboutDemo.sections.sessions.title'),
      color: "#10B981",
      link: createLink('/admin/traininghub/sessionManager'),
      content: (
        <>
          <p>
            {t('aboutDemo.sections.sessions.intro')} <strong>{t('aboutDemo.sections.sessions.dayActivity')}</strong>.
          </p>
          <ul>
            <li>
              {t('aboutDemo.sections.sessions.canView')} <strong>{t('aboutDemo.sections.sessions.planned')}</strong> {t('aboutDemo.sections.sessions.orAdHoc')} <em>{t('aboutDemo.sections.sessions.adHoc')}</em>.
            </li>
            <li>
              {t('aboutDemo.sections.sessions.eachHasTime')} <strong>{t('aboutDemo.sections.sessions.scheduledTime')}</strong> {t('aboutDemo.sections.sessions.established')}
            </li>
            <li>
              {t('aboutDemo.sections.sessions.forPlanSessions')} <strong>{t('aboutDemo.sections.sessions.swimmersGroups')}</strong> {t('aboutDemo.sections.sessions.alreadyAllocated')}
            </li>
            <li>
              {t('aboutDemo.sections.sessions.pageContains')} <strong>{t('aboutDemo.sections.sessions.actualWorkouts')}</strong> {t('aboutDemo.sections.sessions.ofPlans')} <em>{t('aboutDemo.sections.sessions.plansSection')}</em> {t('aboutDemo.sections.sessions.onlyDefineTypes')}
            </li>
            <li>
              {t('aboutDemo.sections.sessions.navigationDays')} <strong>{t('aboutDemo.sections.sessions.onDays')}</strong> {t('aboutDemo.sections.sessions.orCalendar')}
            </li>
          </ul>
        </>
      )
    },
    {
      id: "traininghub",
      icon: "🏊",
      title: t('aboutDemo.sections.traininghub.title'),
      color: "#F59E0B",
      link: createLink('/admin/traininghub'),
      content: (
        <>
          <p>
            {t('aboutDemo.sections.traininghub.intro')} <strong>{t('aboutDemo.sections.traininghub.generalStats')}</strong>.
          </p>
          <ul>
            <li>
              {t('aboutDemo.sections.traininghub.offers')} <strong>{t('aboutDemo.sections.traininghub.quickActions')}</strong>: {t('aboutDemo.sections.traininghub.createWorkout')}
            </li>
            <li>
              {t('aboutDemo.sections.traininghub.youView')} <strong>{t('aboutDemo.sections.traininghub.upcomingComps')}</strong> {t('aboutDemo.sections.traininghub.and')} <strong>{t('aboutDemo.sections.traininghub.testSets')}</strong> {t('aboutDemo.sections.traininghub.plannedInPlans')}
            </li>
            <li>
              {t('aboutDemo.sections.traininghub.displays')} <strong>{t('aboutDemo.sections.traininghub.latestWorkouts')}</strong> {t('aboutDemo.sections.traininghub.added')}
            </li>
          </ul>
        </>
      )
    },
    {
      id: "workouts",
      icon: "📋",
      title: t('aboutDemo.sections.workouts.title'),
      color: "#EF4444",
      link: createLink('/admin/traininghub/workouts'),
      content: (
        <>
          <p>
            {t('aboutDemo.sections.workouts.intro')} <strong>{t('aboutDemo.sections.workouts.existingWorkouts')}</strong>, {t('aboutDemo.sections.workouts.whichCan')} <strong>{t('aboutDemo.sections.workouts.filtered')}</strong> {t('aboutDemo.sections.workouts.or')} <strong>{t('aboutDemo.sections.workouts.searched')}</strong>.
          </p>
          <ul>
            <li>
              {t('aboutDemo.sections.workouts.forEachWorkout')} <em>{t('aboutDemo.sections.workouts.edit')}</em>, <em>{t('aboutDemo.sections.workouts.duplicate')}</em>, <em>{t('aboutDemo.sections.workouts.viewPrint')}</em>, <em>{t('aboutDemo.sections.workouts.delete')}</em>.
            </li>
            <li>
              <strong>{t('aboutDemo.sections.workouts.creating')}</strong> {t('aboutDemo.sections.workouts.viaClick')} <em>"{t('aboutDemo.sections.workouts.createWorkout')}"</em>.
            </li>
            <li>
              {t('aboutDemo.sections.workouts.canHaveLevels')} <strong>{t('aboutDemo.sections.workouts.levels')}</strong>: {t('aboutDemo.sections.workouts.beginner')}
            </li>
            <li>
              {t('aboutDemo.sections.workouts.typesAvailable')} <em>{t('aboutDemo.sections.workouts.endurance')}</em>, <em>{t('aboutDemo.sections.workouts.technique')}</em>, <em>{t('aboutDemo.sections.workouts.tempo')}</em>, <em>{t('aboutDemo.sections.workouts.vo2max')}</em>, <em>{t('aboutDemo.sections.workouts.sprint')}</em>, <em>{t('aboutDemo.sections.workouts.recovery')}</em>.
            </li>
          </ul>
          <div style={styles.detailsBox}>
            <h4 style={styles.detailsTitle}>{t('aboutDemo.sections.workouts.eachStepHas')}</h4>
            <ul>
              <li>{t('aboutDemo.sections.workouts.category')}</li>
              <li>{t('aboutDemo.sections.workouts.distance')}</li>
              <li>{t('aboutDemo.sections.workouts.style')}</li>
              <li>{t('aboutDemo.sections.workouts.drillType')}</li>
              <li>{t('aboutDemo.sections.workouts.intensity')}</li>
              <li>{t('aboutDemo.sections.workouts.equipment')}</li>
              <li>{t('aboutDemo.sections.workouts.notes')}</li>
            </ul>
          </div>
          <p>
            <strong>{t('aboutDemo.sections.workouts.repetitions')}</strong> {t('aboutDemo.sections.workouts.addedWith')} <em>"{t('aboutDemo.sections.workouts.addRepetition')}"</em>, {t('aboutDemo.sections.workouts.creatingBlock')}
          </p>
        </>
      )
    },
    {
      id: "plans",
      icon: "🗂️",
      title: t('aboutDemo.sections.plans.title'),
      color: "#8B5CF6",
      link: createLink('/admin/traininghub/plans'),
      content: (
        <>
          <p>
            {t('aboutDemo.sections.plans.accessedFrom')} <strong>{t('aboutDemo.sections.plans.trainingHub')}</strong>.
          </p>
          <p>
            {t('aboutDemo.sections.plans.displayedCurrent')} <strong>{t('aboutDemo.sections.plans.currentPlans')}</strong>. {t('aboutDemo.sections.plans.creatingPlan')} <em>"{t('aboutDemo.sections.plans.createNewPlan')}"</em>.
          </p>
          <div style={styles.detailsBox}>
            <h4 style={styles.detailsTitle}>{t('aboutDemo.sections.plans.planContains')}</h4>
            <ul>
              <li>{t('aboutDemo.sections.plans.nameDesc')}</li>
              <li>{t('aboutDemo.sections.plans.startEndDate')}</li>
              <li>{t('aboutDemo.sections.plans.status')}</li>
              <li>{t('aboutDemo.sections.plans.macroPhases')}</li>
              <li>{t('aboutDemo.sections.plans.keyComps')}</li>
            </ul>
          </div>
          <ul>
            <li>
              {t('aboutDemo.sections.plans.presentedTheoretically')} <strong>{t('aboutDemo.sections.plans.theoretically')}</strong> {t('aboutDemo.sections.plans.macroTypes')}
            </li>
            <li>
              <strong>{t('aboutDemo.sections.plans.calendarPlanning')}</strong> {t('aboutDemo.sections.plans.weekAssignment')}
            </li>
            <li>
              {t('aboutDemo.sections.plans.canAddIndividual')} <strong>{t('aboutDemo.sections.plans.entireGroups')}</strong> {t('aboutDemo.sections.plans.toPlan')}
            </li>
            <li>
              <em>{t('aboutDemo.sections.plans.actualWorkouts')}</em> {t('aboutDemo.sections.plans.addedLater')} <strong>{t('aboutDemo.sections.plans.trainingSessions')}</strong>.
            </li>
          </ul>
          <div style={styles.warningCard}>
            <span style={styles.warningIcon}>⚠️</span>
            <div>
              <strong>{t('aboutDemo.sections.plans.warningAttention')}</strong> {t('aboutDemo.sections.plans.toTestPlanning')} <em>"{t('aboutDemo.sections.plans.edit')}"</em>. {t('aboutDemo.sections.plans.notAvailableDemo')}
            </div>
          </div>
        </>
      )
    },
    {
      id: "advanced",
      icon: "🥇",
      title: t('aboutDemo.sections.advanced.title'),
      color: "#EC4899",
      link: createLink('/admin/advanced-swimmers'),
      content: (
        <>
          <p>
            {t('aboutDemo.sections.advanced.initially')} <strong>{t('aboutDemo.sections.advanced.noFeatureActive')}</strong>.
          </p>
          <ul>
            <li>
              {t('aboutDemo.sections.advanced.toTransform')} <strong>{t('aboutDemo.sections.advanced.advancedSwimmer')}</strong>, {t('aboutDemo.sections.advanced.selectFromList')}
            </li>
            <li>
              {t('aboutDemo.sections.advanced.afterActivation')} <strong>{t('aboutDemo.sections.advanced.trainingSessions')}</strong>, <strong>{t('aboutDemo.sections.advanced.trainingZones')}</strong> {t('aboutDemo.sections.advanced.specificDetails')}
            </li>
          </ul>
          <div style={styles.detailsBox}>
            <h4 style={styles.detailsTitle}>{t('aboutDemo.sections.advanced.configureParams')}</h4>
            <ul>
              <li><em>{t('aboutDemo.sections.advanced.hrMax')}</em></li>
              <li><em>{t('aboutDemo.sections.advanced.threshold')}</em></li>
              <li><em>{t('aboutDemo.sections.advanced.rest')}</em></li>
            </ul>
            <p style={{marginTop: '0.5rem', fontSize: '0.9rem', color: '#94a3b8'}}>
              {t('aboutDemo.sections.advanced.valuesCalculated')} <strong>{t('aboutDemo.sections.advanced.autoByAge')}</strong>, {t('aboutDemo.sections.advanced.canBeManual')}
            </p>
          </div>
        </>
      )
    },
    {
      id: "groups",
      icon: "👨‍👩‍👧‍👦",
      title: t('aboutDemo.sections.groups.title'),
      color: "#06B6D4",
      link: createLink('/admin/groups'),
      content: (
        <>
          <p>
            {t('aboutDemo.sections.groups.canBeOrganized')} <strong>{t('aboutDemo.sections.groups.organized')}</strong> {t('aboutDemo.sections.groups.efficientManagement')}
          </p>
          <ul>
            <li>
              {t('aboutDemo.sections.groups.groupsAllow')} <strong>{t('aboutDemo.sections.groups.fasterAssignment')}</strong> {t('aboutDemo.sections.groups.plansAndSessions')}
            </li>
          </ul>
          <div style={styles.detailsBox}>
            <h4 style={styles.detailsTitle}>{t('aboutDemo.sections.groups.eachGroupHas')}</h4>
            <ul>
              <li><em>{t('aboutDemo.sections.groups.name')}</em></li>
              <li><em>{t('aboutDemo.sections.groups.color')}</em> {t('aboutDemo.sections.groups.visualDiff')}</li>
              <li><em>{t('aboutDemo.sections.groups.description')}</em></li>
            </ul>
          </div>
        </>
      )
    },
    {
      id: "announcements",
      icon: "📢",
      title: t('aboutDemo.sections.announcements.title'),
      color: "#14B8A6",
      link: createLink('/admin/announcements'),
      content: (
        <>
          <p>
            {t('aboutDemo.sections.announcements.adminCanCreate')} <strong>{t('aboutDemo.sections.announcements.createEvents')}</strong> {t('aboutDemo.sections.announcements.appearOnMain')}
          </p>
          <ul>
            <li>{t('aboutDemo.sections.announcements.canBeComps')}</li>
            <li>
              {t('aboutDemo.sections.announcements.canAddDetails')} <em>{t('aboutDemo.sections.announcements.title')}</em>, <em>{t('aboutDemo.sections.announcements.description')}</em>, <em>{t('aboutDemo.sections.announcements.dateTime')}</em>, <em>{t('aboutDemo.sections.announcements.location')}</em>, <em>{t('aboutDemo.sections.announcements.image')}</em>.
            </li>
          </ul>
        </>
      )
    },
    {
      id: "gdpr",
      icon: "📜",
      title: t('aboutDemo.sections.gdpr.title'),
      color: "#64748B",
      link: createLink('/admin/consimtamant'),
      content: (
        <>
          <p>
            {t('aboutDemo.sections.gdpr.inThisPage')} <strong>{t('aboutDemo.sections.gdpr.userConsents')}</strong>.
          </p>
          <div style={styles.detailsBox}>
            <h4 style={styles.detailsTitle}>{t('aboutDemo.sections.gdpr.includesSignature')}</h4>
            <ul>
              <li>{t('aboutDemo.sections.gdpr.ipAddress')}</li>
              <li>{t('aboutDemo.sections.gdpr.exactDateTime')}</li>
              <li>{t('aboutDemo.sections.gdpr.gdprVersion')}</li>
            </ul>
          </div>
          <p>{t('aboutDemo.sections.gdpr.adminCanTrack')}</p>
        </>
      )
    },
    {
      id: "system",
      icon: "⚙️",
      title: t('aboutDemo.sections.system.title'),
      color: "#6366F1",
      link: createLink('/admin/system'),
      content: (
        <>
          <p>
            {t('aboutDemo.sections.system.pageOffers')} <strong>{t('aboutDemo.sections.system.essentialInfo')}</strong>.
          </p>
          <ul>
            <li>
              {t('aboutDemo.sections.system.containsTechnical')} <strong>{t('aboutDemo.sections.system.technicalData')}</strong> {t('aboutDemo.sections.system.monitoring')}
            </li>
            <li>
              {t('aboutDemo.sections.system.canBeUsed')} <strong>{t('aboutDemo.sections.system.troubleshooting')}</strong> {t('aboutDemo.sections.system.checkingState')}
            </li>
          </ul>
        </>
      )
    }
  ];

  return (
    <div style={styles.container}>
      <style>{cssString}</style>

      {/* Language Selector */}
<div style={styles.languageSelector} ref={langRef}>
  <button
    style={styles.langBtn}
    onClick={() => setShowLangMenu((prev) => !prev)}
  >
    <img
      src={`https://flagcdn.com/24x18/${
        { ro: 'ro', hu: 'hu', de: 'de', es: 'es' }[i18n.language] || 'gb'
      }.png`}
      srcSet={`https://flagcdn.com/48x36/${
        { ro: 'ro', hu: 'hu', de: 'de', es: 'es' }[i18n.language] || 'gb'
      }.png 2x`}
      width="24"
      height="18"
      alt={i18n.language.toUpperCase()}
      style={styles.flagImg}
    />
    <span style={styles.langCode}>{i18n.language.toUpperCase()}</span>
  </button>

  {showLangMenu && (
    <div style={styles.langMenu}>
      {[
        { code: 'ro', label: 'RO' },
        { code: 'en', label: 'EN' },
        { code: 'hu', label: 'HU' },
        { code: 'de', label: 'DE' },
        { code: 'es', label: 'ES' },
      ].map(({ code, label }) => (
        <button
          key={code}
          onClick={() => {
            changeLanguage(code);
            setShowLangMenu(false);
          }}
          style={styles.langMenuItem}
        >
          <img
            src={`https://flagcdn.com/24x18/${
              code === 'en' ? 'gb' : code
            }.png`}
            srcSet={`https://flagcdn.com/48x36/${
              code === 'en' ? 'gb' : code
            }.png 2x`}
            width="24"
            height="18"
            alt={label}
            style={styles.flagImg}
          />
          {label}
        </button>
      ))}
    </div>
  )}
</div>

      {/* Read First Alert */}
      <div style={styles.alertBox}>
        <div style={styles.alertHeader}>
          <span style={styles.alertIcon}>📌</span>
          <h2 style={styles.alertTitle}>{t('aboutDemo.readFirst')}</h2>
        </div>
        <div style={styles.alertContent}>
          <p>{t('aboutDemo.alertIntro')}</p>
          <p>
            {t('aboutDemo.alertAdminNote')} <strong>{t('aboutDemo.administrators')}</strong>. {t('aboutDemo.alertLiveVersion')}{" "}
            <a 
              href="https://delfiniighiriseni.ro" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.link}
            >
              delfiniighiriseni.ro
            </a>
          </p>
          <div style={styles.warningBox}>
            <strong>⚠️ {t('aboutDemo.warningTitle')}</strong>
            <ul style={styles.warningList}>
              <li>{t('aboutDemo.warningNoCreate')}</li>
              <li>{t('aboutDemo.warningNoEdit')}</li>
              <li>{t('aboutDemo.warningSimulated')}</li>
            </ul>
          </div>
          <p style={{marginTop: '1rem'}}>
            {t('aboutDemo.alertFooter')} <strong>{t('aboutDemo.quickLinks')}</strong> {t('aboutDemo.toEachSection')}
          </p>
        </div>
      </div>

      {/* Sections Grid */}
      <div style={styles.sectionsContainer}>
        {sections.map((section, index) => (
          <div 
            key={section.id}
            className="section-card"
            style={{
              ...styles.card,
              animationDelay: `${index * 0.08}s`
            }}
          >
            <div 
              className="card-header-clickable"
              style={{
                ...styles.cardHeader,
                background: `linear-gradient(135deg, ${section.color}20, ${section.color}05)`,
                borderLeft: `4px solid ${section.color}`
              }}
              onClick={() => toggleSection(section.id)}
            >
              <div style={styles.cardHeaderContent}>
                <div style={styles.cardIcon}>{section.icon}</div>
                <h3 style={{...styles.cardTitle, color: section.color}}>
                  {section.title}
                </h3>
              </div>
              <div className="expand-icon" style={{
                ...styles.expandIcon,
                transform: expandedSection === section.id ? 'rotate(180deg)' : 'rotate(0deg)'
              }}>
                ▼
              </div>
            </div>

            <div 
              className="card-body-expandable"
              style={{
                ...styles.cardBody,
                maxHeight: expandedSection === section.id ? "3000px" : "0",
                opacity: expandedSection === section.id ? 1 : 0,
                padding: expandedSection === section.id ? "1.25rem" : "0 1.25rem"
              }}
            >
              <div style={styles.contentWrapper}>
                {section.content}
              </div>

              <button
  className="view-button"
  style={{...styles.viewButton, backgroundColor: section.color}}
  onClick={(e) => {
    e.stopPropagation();
    navigate(section.link);
  }}
>
  ➡️ {t('aboutDemo.viewPage')}
</button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.footerIcon}>🚀</div>
        <p style={styles.footerText}>
          {t('aboutDemo.footerText')}
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "100%",
    margin: "0",
    padding: "0",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    minHeight: "100vh",
    color: "#e2e8f0"
  },
  languageSelector: {
    position: "fixed",
    top: "1rem",
    right: "1rem",
    zIndex: 1000
  },
  langBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    background: "rgba(30, 41, 59, 0.95)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "12px",
    color: "#e2e8f0",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)"
  },
  langCode: {
    fontSize: "0.9rem",
    fontWeight: "600"
  },
  flagImg: {
    borderRadius: "2px"
  },
  langMenu: {
    position: "absolute",
    top: "calc(100% + 0.5rem)",
    right: 0,
    background: "rgba(30, 41, 59, 0.98)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "12px",
    padding: "0.5rem",
    minWidth: "140px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(10px)",
    zIndex: 1001
  },
  langMenuItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    width: "100%",
    padding: "0.75rem 1rem",
    background: "transparent",
    border: "none",
    borderRadius: "8px",
    color: "#cbd5e1",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
    textAlign: "left"
  },
  alertBox: {
    background: "linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(220, 38, 38, 0.06))",
    border: "2px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "16px",
    padding: "1.25rem",
    margin: "0 1rem 2rem",
    animation: "slideIn 0.5s ease-out",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)"
  },
  alertHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "1rem"
  },
  alertIcon: {
    fontSize: "1.5rem",
    flexShrink: 0
  },
  alertTitle: {
    fontSize: "clamp(1.25rem, 4vw, 1.5rem)",
    color: "#fca5a5",
    margin: 0,
    fontWeight: "700"
  },
  alertContent: {
    lineHeight: "1.7",
    fontSize: "clamp(0.9rem, 2.5vw, 1rem)"
  },
  warningBox: {
    background: "rgba(0, 0, 0, 0.3)",
    padding: "1rem",
    borderRadius: "10px",
    marginTop: "1rem",
    border: "1px solid rgba(239, 68, 68, 0.2)"
  },
  warningList: {
    marginTop: "0.5rem",
    paddingLeft: "1.5rem"
  },
  link: {
    color: "#60a5fa",
    textDecoration: "none",
    fontWeight: "600",
    borderBottom: "2px solid transparent",
    transition: "border-color 0.3s ease",
    wordBreak: "break-word"
  },
  sectionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "0 1rem 2rem",
    maxWidth: "100%"
  },
  card: {
    background: "rgba(30, 41, 59, 0.7)",
    borderRadius: "16px",
    border: "1px solid rgba(148, 163, 184, 0.15)",
    overflow: "hidden",
    transition: "all 0.3s ease",
    animation: "fadeInUp 0.6s ease-out",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)"
  },
  cardHeader: {
    padding: "1rem 1.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    transition: "all 0.3s ease",
    borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
    gap: "1rem"
  },
  cardHeaderContent: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    flex: 1,
    minWidth: 0
  },
  cardIcon: {
    fontSize: "2rem",
    flexShrink: 0
  },
  cardTitle: {
    fontSize: "clamp(1.1rem, 3.5vw, 1.35rem)",
    fontWeight: "700",
    margin: 0,
    lineHeight: "1.3",
    wordBreak: "break-word"
  },
  expandIcon: {
    fontSize: "1rem",
    color: "#94a3b8",
    fontWeight: "300",
    transition: "transform 0.3s ease",
    flexShrink: 0
  },
  cardBody: {
    overflow: "hidden",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
  },
  contentWrapper: {
    fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
    lineHeight: "1.7",
    color: "#cbd5e1"
  },
  detailsBox: {
    background: "rgba(0, 0, 0, 0.25)",
    borderRadius: "10px",
    padding: "1rem",
    margin: "1rem 0",
    border: "1px solid rgba(148, 163, 184, 0.15)"
  },
  detailsTitle: {
    fontSize: "clamp(0.95rem, 2.5vw, 1rem)",
    fontWeight: "600",
    marginBottom: "0.75rem",
    color: "#e2e8f0"
  },
  warningCard: {
    background: "linear-gradient(135deg, rgba(251, 191, 36, 0.12), rgba(245, 158, 11, 0.06))",
    border: "1px solid rgba(251, 191, 36, 0.3)",
    borderRadius: "10px",
    padding: "0.875rem 1rem",
    margin: "1rem 0",
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
    fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)"
  },
  warningIcon: {
    flexShrink: 0,
    fontSize: "1.2rem"
  },
  viewButton: {
    display: "block",
    width: "100%",
    padding: "0.875rem 1.5rem",
    borderRadius: "10px",
    color: "white",
    textDecoration: "none",
    fontWeight: "600",
    marginTop: "1.5rem",
    transition: "all 0.3s ease",
    border: "none",
    cursor: "pointer",
    fontSize: "clamp(0.9rem, 2.5vw, 0.95rem)",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
  },
  footer: {
    textAlign: "center",
    padding: "2rem 1.5rem",
    borderTop: "1px solid rgba(148, 163, 184, 0.1)",
    margin: "2rem 1rem 0"
  },
  footerIcon: {
    fontSize: "2rem",
    marginBottom: "0.75rem",
    animation: "float 3s ease-in-out infinite",
    animationDelay: "1s"
  },
  footerText: {
    color: "#94a3b8",
    fontSize: "clamp(0.875rem, 2.5vw, 0.95rem)",
    lineHeight: "1.6"
  }
};

const cssString = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  a[href]:hover {
    border-bottom-color: currentColor !important;
  }
  
  .card-header-clickable:active {
    transform: scale(0.98);
  }
  
  .view-button:active {
    transform: scale(0.97);
  }
  
  .section-card {
    -webkit-tap-highlight-color: transparent;
  }
  
  .contentWrapper ul {
    padding-left: 1.5rem;
    margin: 0.75rem 0;
  }
  
  .contentWrapper li {
    margin: 0.5rem 0;
  }
  
  .contentWrapper p {
    margin: 0.75rem 0;
  }
  
  .contentWrapper strong {
    color: #e2e8f0;
    font-weight: 600;
  }
  
  .contentWrapper em {
    color: #94a3b8;
    font-style: italic;
  }
  
  .langBtn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  }

  .langMenuItem:hover {
    background: rgba(99, 102, 241, 0.2);
    color: #e2e8f0;
  }
  
@media (min-width: 969px) {
    .sectionsContainer {
      max-width: 900px !important;
      margin: 0 auto 3rem !important;
      padding: 0 2rem 2rem !important;
    }
    
    .card-header-clickable:hover {
      transform: translateX(5px);
    }
    
    .view-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      filter: brightness(1.1);
    }
    
    .alertBox {
      margin: 0 2rem 3rem !important;
      padding: 1.5rem !important;
    }
    
    .langButton:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
  }
  
  @media (max-width: 968px) {
    .languageSelector {
      top: 4.5rem !important;
      right: 1rem !important;
    }
    
    .cardHeaderContent {
      flex-direction: row;
      align-items: center;
    }
  }
  
  @media (max-width: 480px) {
    .languageSelector {
      top: 4.5rem !important;
      right: 1rem !important;
    }
    
    .cardIcon {
      font-size: 1.75rem !important;
    }
    
    .langBtn {
      padding: 0.4rem 0.75rem !important;
      font-size: 0.85rem !important;
    }
  }
`;
export default AboutDemo;