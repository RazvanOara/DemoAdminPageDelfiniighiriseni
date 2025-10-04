import React, { useState, useEffect } from "react";
// DELETED: import { API_BASE_URL } from "../../utils/config";
import "./AdminAnnouncementsPage.css";

// ADD: Mock announcements data
let MOCK_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Competiție Națională de Înot",
    subtitle: "Participă la cel mai mare eveniment al anului",
    content: "Ne bucurăm să anunțăm organizarea competiției naționale de înot pentru toate categoriile de vârstă. Pregătește-te pentru performanțe de excepție!",
    imageUrl: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800",
    category: "COMPETITION",
    eventDate: "2024-11-15",
    startTime: "09:00",
    endTime: "18:00",
    location: "Complexul Sportiv Național",
    priority: 90,
    isActive: true
  },
  {
    id: 2,
    title: "Antrenament Special - Tehnici Avansate",
    subtitle: "Pentru înotători nivel avansat",
    content: "Sesiune specială de antrenament dedicată tehnicilor avansate de înot. Coordonator: antrenor Popescu Gabriel.",
    imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800",
    category: "TRAINING",
    eventDate: "2024-10-25",
    startTime: "17:00",
    endTime: "19:00",
    location: "Piscina Olimpică",
    priority: 70,
    isActive: true
  },
  {
    id: 3,
    title: "Închidere Temporară pentru Întreținere",
    subtitle: "Lucrări de modernizare",
    content: "Vă informăm că în perioada 10-12 noiembrie, piscina va fi închisă pentru lucrări de întreținere și modernizare. Mulțumim pentru înțelegere!",
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
    title: "Serată de Vară - Înot Recreativ",
    subtitle: "Event finalizat",
    content: "Mulțumim tuturor participanților la serata de vară! A fost un eveniment de neuitat.",
    imageUrl: "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=800",
    category: "EVENT",
    eventDate: "2024-08-20",
    startTime: "19:00",
    endTime: "22:00",
    location: "Piscina Exterioară",
    priority: 30,
    isActive: false
  }
];

const AdminAnnouncementsPage = () => {
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

  // REPLACED: Fetch with mock data loading
  const fetchAnnouncements = async () => {
    setLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      setAnnouncements([...MOCK_ANNOUNCEMENTS]);
      setError(null);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // REPLACED: Image upload with mock implementation
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Tip de fișier neacceptat. Folosiți JPEG, PNG sau GIF.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Fișierul este prea mare. Dimensiunea maximă: 5MB.');
      return;
    }
  
    setUploading(true);
    
    // Simulate upload delay and create mock URL
    setTimeout(() => {
      // Create a local URL for the uploaded image
      const mockUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, imageUrl: mockUrl }));
      setUploading(false);
    }, 1000);
  };

  // REPLACED: Submit with mock implementation
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

    // Simulate save delay
    setTimeout(() => {
      if (editingId) {
        // Update existing announcement
        const index = MOCK_ANNOUNCEMENTS.findIndex(a => a.id === editingId);
        if (index !== -1) {
          MOCK_ANNOUNCEMENTS[index] = { ...payload, id: editingId };
        }
        alert("Anunț actualizat cu succes (demo)!");
      } else {
        // Create new announcement
        const newId = Math.max(...MOCK_ANNOUNCEMENTS.map(a => a.id), 0) + 1;
        MOCK_ANNOUNCEMENTS.push({ ...payload, id: newId });
        alert("Anunț creat cu succes (demo)!");
      }

      // Refresh list
      fetchAnnouncements();

      // Reset form
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

  // REPLACED: Delete with mock implementation
  const handleDelete = async (id) => {
    if (!window.confirm("Sigur doriți să ștergeți acest anunț?")) return;

    // Simulate delete delay
    setTimeout(() => {
      const index = MOCK_ANNOUNCEMENTS.findIndex(a => a.id === id);
      if (index !== -1) {
        MOCK_ANNOUNCEMENTS.splice(index, 1);
      }
      fetchAnnouncements();
      alert("Anunț șters cu succes (demo)!");
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
        <h1>Administrare Anunțuri (Demo)</h1>
        <p>Creează și gestionează anunțuri pentru clubul tău de înot - Versiune cu date mock</p>
      </div>

      {/* FORM */}
      <div className="announcement-form">
        <h2>{editingId ? "Editează Anunțul" : "Creează Anunț Nou"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Titlu *</label>
            <input
              className="form-input"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={200}
              placeholder="Introdu titlul anunțului"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Subtitlu</label>
            <input
              className="form-input"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              maxLength={300}
              placeholder="Subtitlu opțional"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Conținut *</label>
            <textarea
              className="form-textarea"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              maxLength={2000}
              rows={5}
              placeholder="Introdu conținutul anunțului"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Încarcă Imagine (Mock - Doar Previzualizare Locală)</label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif"
              onChange={handleImageUpload}
              className="form-input"
              disabled={uploading}
            />
            {uploading && <p className="uploading-text">Se încarcă imaginea...</p>}
            {formData.imageUrl && (
              <div className="image-preview">
                <img src={formData.imageUrl} alt="previzualizare" />
                <button 
                  type="button" 
                  onClick={() => setFormData(prev => ({ ...prev, imageUrl: "" }))}
                  className="btn btn-outline"
                >
                  Elimină Imaginea
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Categorie *</label>
            <select
              className="form-select"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="GENERAL">General</option>
              <option value="COMPETITION">Competiție</option>
              <option value="TRAINING">Antrenament</option>
              <option value="EVENT">Eveniment</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Data Evenimentului</label>
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
              <label className="form-label">Ora de Început</label>
              <input
                type="time"
                name="startTime"
                className="form-input"
                value={formData.startTime}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Ora de Sfârșit</label>
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
            <label className="form-label">Locație</label>
            <input
              className="form-input"
              name="location"
              placeholder="Locația evenimentului"
              value={formData.location}
              onChange={handleChange}
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Prioritate (0-100)</label>
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
              <label htmlFor="isActive">Activ</label>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {editingId ? "Actualizează" : "Creează"} Anunțul
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="btn btn-secondary">
                Anulează
              </button>
            )}
          </div>
        </form>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="announcements-loading">Se încarcă anunțurile...</div>
      ) : error ? (
        <div className="announcements-error">
          <p>{error}</p>
          <button onClick={fetchAnnouncements} className="btn btn-secondary">
            Încearcă Din Nou
          </button>
        </div>
      ) : (
        <div className="announcements-list">
          {announcements.length === 0 ? (
            <p className="no-announcements">Nu există anunțuri încă. Creează primul!</p>
          ) : (
            announcements.map((a) => (
              <div key={a.id} className="announcement-card">
                {a.imageUrl && <img src={a.imageUrl} alt={a.title} />}
                <h3>{a.title}</h3>
                {a.subtitle && <p className="subtitle">{a.subtitle}</p>}
                <p className="content">{a.content}</p>
                <div className="announcement-meta">
                  {a.eventDate && (
                    <p><strong>Data:</strong> {a.eventDate} {a.startTime && a.endTime && `| ${a.startTime} - ${a.endTime}`}</p>
                  )}
                  {a.location && <p><strong>Locație:</strong> {a.location}</p>}
                  <p><strong>Categorie:</strong> {a.category}</p>
                  <p><strong>Prioritate:</strong> {a.priority || 0}</p>
                  <p><strong>Status:</strong> {a.isActive !== false ? "Activ" : "Inactiv"}</p>
                </div>
                <div className="announcement-actions">
                  <button className="btn btn-secondary" onClick={() => handleEdit(a)}>
                    Editează
                  </button>
                  <button className="btn btn-outline" onClick={() => handleDelete(a.id)}>
                    Șterge
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