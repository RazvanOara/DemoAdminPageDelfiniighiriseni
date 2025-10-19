import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import "./Consimtamant.css";

// Mock consents data
const MOCK_CONSENTS = [
  {
    id: 1,
    numePrenume: "Popescu Ion",
    dataAcord: "2024-10-01T10:30:00",
    ipDispozitiv: "192.168.1.100",
    gdpr: { version: "1.0" }
  },
  {
    id: 2,
    numePrenume: "Ionescu Maria",
    dataAcord: "2024-09-28T14:20:00",
    ipDispozitiv: "192.168.1.101",
    gdpr: { version: "1.0" }
  },
  {
    id: 3,
    numePrenume: "Georgescu Andrei",
    dataAcord: "2024-09-25T09:15:00",
    ipDispozitiv: "192.168.1.102",
    gdpr: { version: "1.0" }
  },
  {
    id: 4,
    numePrenume: "Popa Elena",
    dataAcord: "2024-09-20T16:45:00",
    ipDispozitiv: "192.168.1.103",
    gdpr: { version: "1.0" }
  },
  {
    id: 5,
    numePrenume: "Dumitrescu Alex",
    dataAcord: "2024-09-18T11:00:00",
    ipDispozitiv: "192.168.1.104",
    gdpr: { version: "1.1" }
  },
  {
    id: 6,
    numePrenume: "Stan Cristina",
    dataAcord: "2024-08-15T13:30:00",
    ipDispozitiv: "192.168.1.105",
    gdpr: { version: "1.0" }
  }
];

const ConsimtamantTable = () => {
  const { t } = useTranslation();
  const [consents, setConsents] = useState([]);
  const { lang } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCards, setExpandedCards] = useState(new Set());

  // Fetch with mock data loading
  useEffect(() => {
    const fetchConsents = () => {
      setIsLoading(true);
      
      // Simulate loading delay
      setTimeout(() => {
        const mappedConsents = MOCK_CONSENTS.map(consent => ({
          id: consent.id,
          fullName: consent.numePrenume,
          agreementDate: consent.dataAcord,
          deviceIp: consent.ipDispozitiv,
          gdprVersion: consent.gdpr?.version
        }));
        setConsents(mappedConsents);
        setIsLoading(false);
      }, 500);
    };

    fetchConsents();
  }, []);

  const filteredConsents = consents.filter((consent) =>
    consent.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGDPRClick = () => {
    window.location.href = `/${lang}/admin/gdpr`;
  };

  const toggleCard = (id) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="consimtamant-page">
      <div className="consimtamant-container">
        <div className="consimtamant-header">
          <div className="header-content">
            <h1>{t('consents.pageTitle')}</h1>
            <p className="subtitle">{t('consents.pageSubtitle')}</p>
          </div>
          <button onClick={handleGDPRClick} className="btn-gdpr">
            <span className="btn-icon">📜</span>
            {t('consents.gdprButton')}
          </button>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder={t('consents.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>{t('consents.loading')}</p>
          </div>
        ) : filteredConsents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p className="empty-title">
              {searchTerm ? t('consents.emptyState.noResults') : t('consents.emptyState.noConsents')}
            </p>
            <p className="empty-subtitle">
              {searchTerm
                ? t('consents.emptyState.modifySearch')
                : t('consents.emptyState.willAppear')}
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            {/* Desktop Table */}
            <table className="consimtamant-table">
              <thead>
                <tr>
                  <th>{t('consents.table.id')}</th>
                  <th>{t('consents.table.fullName')}</th>
                  <th>{t('consents.table.agreementDate')}</th>
                  <th>{t('consents.table.deviceIp')}</th>
                  <th>{t('consents.table.gdprVersion')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredConsents.map((consent) => (
                  <tr key={consent.id}>
                    <td data-label={t('consents.table.id')}>
                      <span className="id-badge">{consent.id}</span>
                    </td>
                    <td data-label={t('consents.table.fullName')}>
                      <div className="user-info">
                        <div className="avatar">
                          {consent.fullName?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <span>{consent.fullName}</span>
                      </div>
                    </td>
                    <td data-label={t('consents.table.agreementDate')}>
                      {consent.agreementDate
                        ? new Date(consent.agreementDate).toLocaleString("ro-RO", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "-"}
                    </td>
                    <td data-label={t('consents.table.deviceIp')}>
                      <span className="ip-badge">{consent.deviceIp || "-"}</span>
                    </td>
                    <td data-label={t('consents.table.gdprVersion')}>
                      <span className="version-badge">v{consent.gdprVersion || "N/A"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="mobile-cards">
              {filteredConsents.map((consent) => {
                const isExpanded = expandedCards.has(consent.id);
                return (
                  <div 
                    key={consent.id} 
                    className={`mobile-card ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => toggleCard(consent.id)}
                  >
                    <div className="mobile-card-header">
                      <div className="mobile-user-info">
                        <div className="avatar">
                          {consent.fullName?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div className="mobile-user-details">
                          <span className="mobile-user-name">{consent.fullName}</span>
                          <span className="mobile-user-id">ID: {consent.id}</span>
                        </div>
                      </div>
                      <div className="mobile-expand-icon">
                        <svg 
                          width="20" 
                          height="20" 
                          viewBox="0 0 20 20" 
                          fill="none" 
                          stroke="currentColor"
                          className={isExpanded ? 'rotated' : ''}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className={`mobile-card-content ${isExpanded ? 'show' : ''}`}>
                      <div className="mobile-info-row">
                        <span className="mobile-label">{t('consents.mobile.agreementDate')}</span>
                        <span className="mobile-value">
                          {consent.agreementDate
                            ? new Date(consent.agreementDate).toLocaleString("ro-RO", {
                                dateStyle: "short",
                                timeStyle: "short",
                              })
                            : "-"}
                        </span>
                      </div>
                      <div className="mobile-info-row">
                        <span className="mobile-label">{t('consents.mobile.deviceIp')}</span>
                        <span className="mobile-value ip-badge">{consent.deviceIp || "-"}</span>
                      </div>
                      <div className="mobile-info-row">
                        <span className="mobile-label">{t('consents.mobile.gdprVersion')}</span>
                        <span className="version-badge">v{consent.gdprVersion || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="results-counter">
              <p>
                {t('consents.resultsCounter.showing')} <span className="highlight">{filteredConsents.length}</span>{" "}
                {filteredConsents.length === 1 ? t('consents.resultsCounter.resultSingular') : t('consents.resultsCounter.resultPlural')}
                {searchTerm && ` ${t('consents.resultsCounter.filtered')}`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsimtamantTable;