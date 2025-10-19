import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import "./AdminAnnouncementsPage.css";

let MOCK_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "announcements.mockData.competition.title",
    subtitle: "announcements.mockData.competition.subtitle",
    content: "announcements.mockData.competition.content",
    imageUrl: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800",
    category: "COMPETITION",
    eventDate: "2024-11-15",
    startTime: "09:00",
    endTime: "18:00",
    location: "announcements.mockData.competition.location",
    priority: 90,
    isActive: true
  },
  {
    id: 2,
    title: "announcements.mockData.training.title",
    subtitle: "announcements.mockData.training.subtitle",
    content: "announcements.mockData.training.content",
    imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800",
    category: "TRAINING",
    eventDate: "2024-10-25",
    startTime: "17:00",
    endTime: "19:00",
    location: "announcements.mockData.training.location",
    priority: 70,
    isActive: true
  },
  {
    id: 3,
    title: "announcements.mockData.maintenance.title",
    subtitle: "announcements.mockData.maintenance.subtitle",
    content: "announcements.mockData.maintenance.content",
    imageUrl: "",
    category: "GENERAL",
    eventDate: "2024-11-10",
    startTime: "",
    endTime: "",
    location: "",
    priority: 100,
    isActive: true
  },
  {
    id: 4,
    title: "announcements.mockData.summerEvent.title",
    subtitle: "announcements.mockData.summerEvent.subtitle",
    content: "announcements.mockData.summerEvent.content",
    imageUrl: "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=800",
    category: "EVENT",
    eventDate: "2024-08-20",
    startTime: "19:00",
    endTime: "22:00",
    location: "announcements.mockData.summerEvent.location",
    priority: 30,
    isActive: false
  }
];

const AdminAnnouncementsPage = () => {
  const { t } = useTranslation();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    content: "",
    imageUrl: "",
    category: "GENERAL",
    eventDate: "",
    startTime: "",
    endTime: "",
    location: "",
    priority: 0,
    isActive: true,
  });

  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const translatedAnnouncements = MOCK_ANNOUNCEMENTS.map(announcement => ({
        ...announcement,
        title: t(announcement.title),
        subtitle: t(announcement.subtitle),
        content: t(announcement.content),
        location: announcement.location ? t(announcement.location) : ""
      }));
      setAnnouncements(translatedAnnouncements);
      setError(null);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [t]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert(t('announcements.alerts.invalidFileType'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(t('announcements.alerts.fileTooLarge'));
      return;
    }
  
    setUploading(true);
    
    setTimeout(() => {
      const mockUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, imageUrl: mockUrl }));
      setUploading(false);
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title.trim(),
      subtitle: formData.subtitle ? formData.subtitle.trim() : null,
      content: formData.content.trim(),
      imageUrl: formData.imageUrl || null,
      category: formData.category,
      eventDate: formData.eventDate || null,
      startTime: formData.startTime || null,
      endTime: formData.endTime || null,
      location: formData.location ? formData.location.trim() : "",
      priority: parseInt(formData.priority) || 0,
      isActive: formData.isActive,
    };

    setTimeout(() => {
      if (editingId) {
        const index = MOCK_ANNOUNCEMENTS.findIndex(a => a.id === editingId);
        if (index !== -1) {
          MOCK_ANNOUNCEMENTS[index] = { ...payload, id: editingId };
        }
        alert(t('announcements.alerts.updateSuccess'));
      } else {
        const newId = Math.max(...MOCK_ANNOUNCEMENTS.map(a => a.id), 0) + 1;
        MOCK_ANNOUNCEMENTS.push({ ...payload, id: newId });
        alert(t('announcements.alerts.createSuccess'));
      }

      fetchAnnouncements();

      setFormData({
        title: "",
        subtitle: "",
        content: "",
        imageUrl: "",
        category: "GENERAL",
        eventDate: "",
        startTime: "",
        endTime: "",
        location: "",
        priority: 0,
        isActive: true,
      });
      setEditingId(null);
    }, 500);
  };

  const handleEdit = (announcement) => {
    setFormData({
      title: announcement.title || "",
      subtitle: announcement.subtitle || "",
      content: announcement.content || "",
      imageUrl: announcement.imageUrl || "",
      category: announcement.category || "GENERAL",
      eventDate: announcement.eventDate || "",
      startTime: announcement.startTime || "",
      endTime: announcement.endTime || "",
      location: announcement.location || "",
      priority: announcement.priority || 0,
      isActive: announcement.isActive ?? true,
    });
    setEditingId(announcement.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('announcements.alerts.confirmDelete'))) return;

    setTimeout(() => {
      const index = MOCK_ANNOUNCEMENTS.findIndex(a => a.id === id);
      if (index !== -1) {
        MOCK_ANNOUNCEMENTS.splice(index, 1);
      }
      fetchAnnouncements();
      alert(t('announcements.alerts.deleteSuccess'));
    }, 300);
  };

  const cancelEdit = () => {
    setFormData({
      title: "",
      subtitle: "",
      content: "",
      imageUrl: "",
      category: "GENERAL",
      eventDate: "",
      startTime: "",
      endTime: "",
      location: "",
      priority: 0,
      isActive: true,
    });
    setEditingId(null);
  };

  return (
    <div className="admin-announcements">
      <div className="admin-announcements-header">
        <h1>{t('announcements.header.title')}</h1>
        <p>{t('announcements.header.subtitle')}</p>
      </div>

      <div className="announcement-form">
        <h2>{editingId ? t('announcements.form.editTitle') : t('announcements.form.createTitle')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('announcements.form.title')} *</label>
            <input
              className="form-input"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={200}
              placeholder={t('announcements.form.titlePlaceholder')}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('announcements.form.subtitle')}</label>
            <input
              className="form-input"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              maxLength={300}
              placeholder={t('announcements.form.subtitlePlaceholder')}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('announcements.form.content')} *</label>
            <textarea
              className="form-textarea"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              maxLength={2000}
              rows={5}
              placeholder={t('announcements.form.contentPlaceholder')}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('announcements.form.uploadImage')}</label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif"
              onChange={handleImageUpload}
              className="form-input"
              disabled={uploading}
            />
            {uploading && <p className="uploading-text">{t('announcements.form.uploading')}</p>}
            {formData.imageUrl && (
              <div className="image-preview">
                <img src={formData.imageUrl} alt={t('announcements.form.preview')} />
                <button 
                  type="button" 
                  onClick={() => setFormData(prev => ({ ...prev, imageUrl: "" }))}
                  className="btn btn-outline"
                >
                  {t('announcements.form.removeImage')}
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">{t('announcements.form.category')} *</label>
            <select
              className="form-select"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="GENERAL">{t('announcements.categories.general')}</option>
              <option value="COMPETITION">{t('announcements.categories.competition')}</option>
              <option value="TRAINING">{t('announcements.categories.training')}</option>
              <option value="EVENT">{t('announcements.categories.event')}</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{t('announcements.form.eventDate')}</label>
            <input
              type="date"
              name="eventDate"
              className="form-input"
              value={formData.eventDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('announcements.form.startTime')}</label>
              <input
                type="time"
                name="startTime"
                className="form-input"
                value={formData.startTime}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t('announcements.form.endTime')}</label>
              <input
                type="time"
                name="endTime"
                className="form-input"
                value={formData.endTime}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('announcements.form.location')}</label>
            <input
              className="form-input"
              name="location"
              placeholder={t('announcements.form.locationPlaceholder')}
              value={formData.location}
              onChange={handleChange}
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('announcements.form.priority')}</label>
            <input
              type="number"
              className="form-input"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              min="0"
              max="100"
            />
          </div>

          {editingId && (
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <label htmlFor="isActive">{t('announcements.form.active')}</label>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {editingId ? t('announcements.buttons.update') : t('announcements.buttons.create')}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="btn btn-secondary">
                {t('announcements.buttons.cancel')}
              </button>
            )}
          </div>
        </form>
      </div>

      {loading ? (
        <div className="announcements-loading">{t('announcements.loading')}</div>
      ) : error ? (
        <div className="announcements-error">
          <p>{error}</p>
          <button onClick={fetchAnnouncements} className="btn btn-secondary">
            {t('announcements.buttons.retry')}
          </button>
        </div>
      ) : (
        <div className="announcements-list">
          {announcements.length === 0 ? (
            <p className="no-announcements">{t('announcements.empty')}</p>
          ) : (
            announcements.map((a) => (
              <div key={a.id} className="announcement-card">
                {a.imageUrl && <img src={a.imageUrl} alt={a.title} />}
                <h3>{a.title}</h3>
                {a.subtitle && <p className="subtitle">{a.subtitle}</p>}
                <p className="content">{a.content}</p>
                <div className="announcement-meta">
                  {a.eventDate && (
                    <p><strong>{t('announcements.card.date')}:</strong> {a.eventDate} {a.startTime && a.endTime && `| ${a.startTime} - ${a.endTime}`}</p>
                  )}
                  {a.location && <p><strong>{t('announcements.card.location')}:</strong> {a.location}</p>}
                  <p><strong>{t('announcements.card.category')}:</strong> {t(`announcements.categories.${a.category.toLowerCase()}`)}</p>
                  <p><strong>{t('announcements.card.priority')}:</strong> {a.priority || 0}</p>
                  <p><strong>{t('announcements.card.status')}:</strong> {a.isActive !== false ? t('announcements.status.active') : t('announcements.status.inactive')}</p>
                </div>
                <div className="announcement-actions">
                  <button className="btn btn-secondary" onClick={() => handleEdit(a)}>
                    {t('announcements.buttons.edit')}
                  </button>
                  <button className="btn btn-outline" onClick={() => handleDelete(a.id)}>
                    {t('announcements.buttons.delete')}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncementsPage;