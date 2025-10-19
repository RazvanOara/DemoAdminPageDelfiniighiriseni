import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import "./GpdrTable.css";

const GdprTable = () => {
  const { t } = useTranslation();
  const [gdprList, setGdprList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newText, setNewText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Compute next version based on highest version in list
  const nextVersion =
    gdprList.length > 0
      ? (
          Math.max(...gdprList.map((g) => parseInt(g.version || "0", 10))) + 1
        ).toString()
      : "1";

  useEffect(() => {
    const fetchGdpr = async () => {
      try {
        setIsLoading(true);

        const csrfResponse = await fetch("/csrf", { credentials: "include" });
        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.token;

        const response = await fetch("/api/admin/gdpr", {
          credentials: "include",
          headers: { "X-XSRF-TOKEN": csrfToken },
        });

        if (response.ok) {
          const data = await response.json();
          setGdprList(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error("Error loading GDPR:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGdpr();
  }, []);

  const handleAddGdpr = async () => {
    if (!newText.trim()) return;
    
    try {
      setIsAdding(true);
      const csrfResponse = await fetch("/csrf", { credentials: "include" });
      const csrfData = await csrfResponse.json();
      const csrfToken = csrfData.token;

      const response = await fetch("/api/admin/gdpr", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify({ text: newText, version: nextVersion }),
      });

      if (response.ok) {
        const saved = await response.json();
        setGdprList((prev) => [...prev, saved]);
        setNewText("");
      }
    } catch (err) {
      console.error("Failed to add GDPR:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("ro-RO", {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPreviewText = (text, maxLength = 80) => {
    if (!text) return "-";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="gdpr-container">
      <div className="gdpr-header">
        <div className="gdpr-header-content">
          <h1 className="gdpr-title">
            <span className="gdpr-icon">🔒</span>
            {t('gdpr.pageTitle')}
          </h1>
          <p className="gdpr-subtitle">
            {t('gdpr.pageSubtitle')}
          </p>
        </div>
        <div className="gdpr-stats">
          <div className="stat-item">
            <span className="stat-number">{gdprList.length}</span>
            <span className="stat-label">{t('gdpr.stats.versions')}</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{nextVersion}</span>
            <span className="stat-label">{t('gdpr.stats.nextVersion')}</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">{t('gdpr.loading')}</p>
        </div>
      ) : (
        <div className="gdpr-table-container">
          {gdprList.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>{t('gdpr.emptyState.title')}</h3>
              <p>{t('gdpr.emptyState.description')}</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="gdpr-table">
                <thead>
                  <tr>
                    <th className="th-id">
                      <span className="th-content">{t('gdpr.table.id')}</span>
                    </th>
                    <th className="th-version">
                      <span className="th-content">{t('gdpr.table.version')}</span>
                    </th>
                    <th className="th-date">
                      <span className="th-content">{t('gdpr.table.createdAt')}</span>
                    </th>
                    <th className="th-text">
                      <span className="th-content">{t('gdpr.table.gdprText')}</span>
                    </th>
                    <th className="th-actions">
                      <span className="th-content">{t('gdpr.table.actions')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {gdprList.map((g, index) => (
                    <tr key={g.id} className="table-row">
                      <td className="td-id">
                        <span className="id-badge">#{g.id}</span>
                      </td>
                      <td className="td-version">
                        <span className="version-badge">v{g.version}</span>
                      </td>
                      <td className="td-date">
                        <span className="date-text">{formatDate(g.createdAt)}</span>
                      </td>
                      <td className="td-text">
                        <div className="text-preview">
                          {getPreviewText(g.text)}
                        </div>
                      </td>
                      <td className="td-actions">
                        {g.text && g.text.length > 80 && (
                          <button
                            className="action-btn view-btn"
                            onClick={() => {
                              setModalText(g.text);
                              setModalOpen(true);
                            }}
                            title={t('gdpr.table.viewFullText')}
                          >
                            <span className="btn-icon">👁️</span>
                            {t('gdpr.table.viewFull')}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="gdpr-form-section">
        <div className="form-header">
          <h2 className="form-title">
            <span className="form-icon">➕</span>
            {t('gdpr.form.title')}
          </h2>
          <p className="form-description">
            {t('gdpr.form.description')}
          </p>
        </div>

        <div className="gdpr-form">
          <div className="form-row">
            <div className="form-group version-group">
              <label className="form-label">
                <span className="label-icon">🏷️</span>
                {t('gdpr.form.versionLabel')}
              </label>
              <div className="version-input-wrapper">
                <input
                  type="text"
                  className="form-input version-input"
                  value={nextVersion}
                  disabled
                />
                <span className="version-prefix">v</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">📝</span>
              {t('gdpr.form.gdprTextLabel')}
              <span className="label-required">*</span>
            </label>
            <textarea
              className="form-textarea gdpr-textarea"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder={t('gdpr.form.gdprTextPlaceholder')}
              rows="8"
            />
            <div className="textarea-info">
              <span className="char-count">
                {t('gdpr.form.characterCount', { count: newText.length })}
              </span>
              {newText.length > 0 && (
                <span className="char-estimate">
                  {t('gdpr.form.paragraphEstimate', { count: Math.ceil(newText.length / 100) })}
                </span>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              className={`btn btn-primary add-btn ${isAdding ? 'loading' : ''}`}
              onClick={handleAddGdpr}
              disabled={!newText.trim() || isAdding}
            >
              {isAdding ? (
                <>
                  <div className="btn-spinner"></div>
                  {t('gdpr.form.adding')}
                </>
              ) : (
                <>
                  <span className="btn-icon">✨</span>
                  {t('gdpr.form.addButton')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {modalOpen && (
        <div className="gdpr-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="gdpr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                <span className="modal-icon">📄</span>
                {t('gdpr.modal.title')}
              </h2>
              <button
                className="modal-close-btn"
                onClick={() => setModalOpen(false)}
                title={t('gdpr.modal.close')}
              >
                ✕
              </button>
            </div>
            <div className="modal-content">
              <div className="gdpr-modal-content">{modalText}</div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setModalOpen(false)}
              >
                <span className="btn-icon">👍</span>
                {t('gdpr.modal.closeButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GdprTable;