import React, { useState } from "react";

const AboutDemo = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const sections = [
    {
      id: "users",
      icon: "👥",
      title: "Înregistrări / Cursanți",
      color: "#4F46E5",
      link: "/admin/users",
      content: (
        <>
          <p>Păstrează toate datele despre cei înscriși la club, inclusiv documentele autogenerate (<em>fișa de înscriere</em>, <em>declarație pe propria răspundere</em>) și <em>adeverința medicală</em>.</p>
          <ul>
            <li>Cursanții pot fi <strong>filtrați</strong> după criterii specifice.</li>
            <li>Expiră automat după o perioadă prestabilită sau pot fi marcați manual ca <strong>expirați</strong> ori șterși definitiv.</li>
            <li>Toți cursanții pot fi <strong>exportați</strong> într-un fișier CSV pentru raportare.</li>
          </ul>
        </>
      )
    },
    {
      id: "sessions",
      icon: "📅",
      title: "Sesiuni de Antrenament",
      color: "#10B981",
      link: "/admin/traininghub/sessionManager",
      content: (
        <>
          <p>O sesiune de antrenament reprezintă <strong>activitatea dintr-o zi</strong>.</p>
          <ul>
            <li>Poți vizualiza sesiunile <strong>planificate dintr-un plan</strong> sau create <em>ad-hoc</em>.</li>
            <li>Fiecare sesiune are <strong>ora de desfășurare</strong> stabilită.</li>
            <li>Pentru sesiunile din plan, <strong>înotătorii sau grupele</strong> sunt deja alocate; pentru cele ad-hoc, se adaugă manual.</li>
            <li>Această pagină conține <strong>antrenamentele efective</strong> ale planurilor. În secțiunea de <em>Planuri</em> se definesc doar tipurile de antrenamente necesare pentru fiecare zi.</li>
            <li>Navigarea se poate face <strong>pe zile</strong> sau prin iconița de calendar 📆 pentru a sări rapid la o dată anume.</li>
          </ul>
        </>
      )
    },
    {
      id: "traininghub",
      icon: "🏊",
      title: "Centru de Antrenament",
      color: "#F59E0B",
      link: "/admin/traininghub",
      content: (
        <>
          <p>Pagina principală a modulului de antrenament, unde sunt afișate <strong>statistici generale</strong>.</p>
          <ul>
            <li>Oferă <strong>acțiuni rapide</strong>: creare antrenament, accesare planuri.</li>
            <li>Vizualizezi <strong>competițiile viitoare</strong> și <strong>seturile de verificare</strong> planificate în planuri.</li>
            <li>Afișează <strong>ultimele antrenamente</strong> adăugate.</li>
          </ul>
        </>
      )
    },
    {
      id: "workouts",
      icon: "📋",
      title: "Antrenamente",
      color: "#EF4444",
      link: "/admin/traininghub/workouts",
      content: (
        <>
          <p>Pagina afișează toate <strong>antrenamentele existente</strong>, care pot fi <strong>filtrate</strong> sau <strong>căutate</strong>.</p>
          <ul>
            <li>Pentru fiecare antrenament există acțiuni: <em>editare</em>, <em>duplicare</em>, <em>vizualizare pentru print</em>, <em>ștergere</em>.</li>
            <li><strong>Crearea unui antrenament</strong> se face prin click pe <em>"Creează Antrenament"</em>.</li>
            <li>Un antrenament poate avea <strong>niveluri</strong>: Începător, Intermediar, Avansat.</li>
            <li>Tipuri disponibile: <em>Rezistență</em>, <em>Tehnică</em>, <em>Tempo</em>, <em>VO2max</em>, <em>Sprint</em>, <em>Recuperare</em>.</li>
          </ul>
          <div style={styles.detailsBox}>
            <h4 style={styles.detailsTitle}>Fiecare pas are:</h4>
            <ul>
              <li>Categoria: Warm-up, Main Set, Swim, Cooldown</li>
              <li>Distanța (multiplu de 25m) – pentru a introduce rapid: selectează câmpul și scrie noua valoare</li>
              <li>Stil: Freestyle, Backstroke, Breaststroke, Butterfly etc.</li>
              <li>Tip drill: Kick, Pull, Drill</li>
              <li>Intensitate: Effort-based (HR), Pace-based, CSS (Critical Swim Speed)</li>
              <li>Echipament: Paddles, Pull buoy, Fins, Snorkel etc.</li>
              <li>Notițe</li>
            </ul>
          </div>
          <p><strong>Repetări:</strong> se adaugă cu <em>"Adaugă Repetare"</em>, creând un bloc unde poți introduce mai mulți pași sau alte repetări.</p>
        </>
      )
    },
    {
      id: "plans",
      icon: "🗂️",
      title: "Planuri",
      color: "#8B5CF6",
      link: "/admin/traininghub/plans",
      content: (
        <>
          <p>Se accesează din <strong>Centru de Antrenament → Planuri</strong>.</p>
          <p>Sunt afișate <strong>planurile curente</strong>. Crearea unui plan se face prin <em>"Creează plan nou"</em>.</p>
          <div style={styles.detailsBox}>
            <h4 style={styles.detailsTitle}>Un plan conține:</h4>
            <ul>
              <li>Nume și descriere</li>
              <li>Data de start și de sfârșit</li>
              <li>Status: Draft, Activ, Pauză, Completat</li>
              <li>Fazele macro (Acumulare, Intensificare, Realizare, Descărcare, Tranziție)</li>
              <li>Competiții cheie și obiective</li>
            </ul>
          </div>
          <ul>
            <li>Sunt prezentate <strong>teoretic</strong> fazele macro, tipurile de antrenament și zonele de frecvență cardiacă.</li>
            <li><strong>Planificare calendar:</strong> asignarea pe săptămâni a fazelor macro și tipurilor de antrenamente pe zile.</li>
            <li>Se pot adăuga sportivi individuali sau <strong>întregi grupe</strong> la plan.</li>
            <li><em>Antrenamentele efective</em> se adaugă ulterior din secțiunea <strong>Sesiuni de antrenament</strong>.</li>
          </ul>
          <div style={styles.warningCard}>
            <span style={styles.warningIcon}>⚠️</span>
            <div>
              <strong>Atenție:</strong> Pentru a testa planificarea în calendar, trebuie să accesezi un plan deja creat și să alegi <em>"Editează"</em>. În versiunea demo, această opțiune nu este disponibilă în faza de creare.
            </div>
          </div>
        </>
      )
    },
    {
      id: "advanced",
      icon: "🥇",
      title: "Înotători Avansați",
      color: "#EC4899",
      link: "/admin/advanced-swimmers",
      content: (
        <>
          <p>Inițial, orice nou cursant <strong>nu are această funcționalitate activă</strong>.</p>
          <ul>
            <li>Pentru a-l transforma în <strong>înotător avansat</strong>, se selectează din lista de cursanți obișnuiți.</li>
            <li>După activare, se pot asigna <strong>sesiuni de antrenament</strong>, <strong>zone de antrenament</strong> și alte detalii specifice.</li>
          </ul>
          <div style={styles.detailsBox}>
            <h4 style={styles.detailsTitle}>Se configurează parametri precum:</h4>
            <ul>
              <li><em>HR maxim</em></li>
              <li><em>Prag</em></li>
              <li><em>Repaus</em></li>
            </ul>
            <p style={{marginTop: '0.5rem', fontSize: '0.9rem', color: '#94a3b8'}}>
              Valorile sunt calculate <strong>automat în funcție de vârstă</strong>, dar pot fi introduse manual.
            </p>
          </div>
        </>
      )
    },
    {
      id: "groups",
      icon: "👨‍👩‍👧‍👦",
      title: "Grupuri",
      color: "#06B6D4",
      link: "/admin/groups",
      content: (
        <>
          <p>Înotătorii avansați pot fi <strong>organizați în grupuri</strong> pentru o gestionare mai eficientă.</p>
          <ul>
            <li>Grupurile permit <strong>asignarea mai rapidă</strong> a planurilor și sesiunilor de antrenament.</li>
          </ul>
          <div style={styles.detailsBox}>
            <h4 style={styles.detailsTitle}>Fiecare grup are:</h4>
            <ul>
              <li><em>Denumire</em></li>
              <li><em>Culoare</em> (pentru diferențiere vizuală)</li>
              <li><em>Descriere</em></li>
            </ul>
          </div>
        </>
      )
    },
    {
      id: "announcements",
      icon: "📢",
      title: "Evenimente",
      color: "#14B8A6",
      link: "/admin/announcements",
      content: (
        <>
          <p>Administratorul poate <strong>crea evenimente</strong> ce vor apărea pe pagina principală.</p>
          <ul>
            <li>Evenimentele pot fi competiții, anunțuri sau activități speciale.</li>
            <li>Se pot adăuga detalii precum: <em>titlu</em>, <em>descriere</em>, <em>data și ora</em>, <em>locație</em>, <em>imagine</em>.</li>
          </ul>
        </>
      )
    },
    {
      id: "gdpr",
      icon: "📜",
      title: "GDPR",
      color: "#64748B",
      link: "/admin/consimtamant",
      content: (
        <>
          <p>În această pagină sunt accesibile <strong>consimțămintele utilizatorilor</strong>.</p>
          <div style={styles.detailsBox}>
            <h4 style={styles.detailsTitle}>Include semnătura digitală, care conține:</h4>
            <ul>
              <li>Adresa IP</li>
              <li>Data și ora exactă</li>
              <li>Versiunea de GDPR acceptată</li>
            </ul>
          </div>
          <p>Administratorul poate ține evidența și actualiza versiunile de GDPR.</p>
        </>
      )
    },
    {
      id: "system",
      icon: "⚙️",
      title: "Informații Sistem",
      color: "#6366F1",
      link: "/admin/system",
      content: (
        <>
          <p>Pagina oferă acces administratorului la <strong>informațiile esențiale despre server</strong>.</p>
          <ul>
            <li>Conține <strong>date tehnice utile</strong> pentru monitorizare și mentenanță.</li>
            <li>Poate fi folosită pentru <strong>depanare</strong> și pentru verificarea stării generale a sistemului.</li>
          </ul>
        </>
      )
    }
  ];

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroIcon}>ℹ️</div>
        <h1 style={styles.heroTitle}>Despre Această Versiune Demo</h1>
        <p style={styles.heroSubtitle}>
          Ghid complet pentru funcționalitățile platformei de management
        </p>
      </div>

      {/* Read First Alert */}
      <div style={styles.alertBox}>
        <div style={styles.alertHeader}>
          <span style={styles.alertIcon}>📌</span>
          <h2 style={styles.alertTitle}>Citește mai întâi</h2>
        </div>
        <div style={styles.alertContent}>
          <p>Această pagină îți arată unde găsești principalele secțiuni ale platformei demo.</p>
          <p>
            Interfața este destinată <strong>administratorilor</strong>. Pentru versiunea live, vizitează:{" "}
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
            <strong>⚠️ Toate datele afișate sunt doar pentru exemplificare:</strong>
            <ul style={styles.warningList}>
              <li>nu se pot crea înregistrări reale,</li>
              <li>nu se pot edita sau șterge date,</li>
              <li>operațiile sunt doar simulate.</li>
            </ul>
          </div>
          <p style={{marginTop: '1rem'}}>
            Mai jos găsești prezentarea funcționalităților, împreună cu <strong>linkuri rapide</strong> către fiecare secțiune.
          </p>
        </div>
      </div>

      {/* Sections List */}
      <div style={styles.sectionsContainer}>
        {sections.map((section, index) => (
          <div 
            key={section.id}
            style={{
              ...styles.card,
              animationDelay: `${index * 0.08}s`
            }}
          >
            <div 
              style={{
                ...styles.cardHeader,
                background: `linear-gradient(135deg, ${section.color}20, ${section.color}05)`,
                borderLeft: `4px solid ${section.color}`
              }}
              onClick={() => toggleSection(section.id)}
            >
              <div style={styles.cardIcon}>{section.icon}</div>
              <h3 style={{...styles.cardTitle, color: section.color}}>
                {section.title}
              </h3>
              <div style={{
                ...styles.expandIcon,
                transform: expandedSection === section.id ? 'rotate(180deg)' : 'rotate(0deg)'
              }}>
                ▼
              </div>
            </div>

            <div 
              style={{
                ...styles.cardBody,
                maxHeight: expandedSection === section.id ? "2000px" : "0",
                opacity: expandedSection === section.id ? 1 : 0,
                padding: expandedSection === section.id ? "1.5rem" : "0 1.5rem"
              }}
            >
              <div style={styles.contentWrapper}>
                {section.content}
              </div>

              <a 
                href={section.link} 
                style={{...styles.viewButton, backgroundColor: section.color}}
                onClick={(e) => e.stopPropagation()}
              >
                ➡️ Vezi pagina
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.footerText}>
          Navighează prin secțiuni și explorează funcționalitățile platformei
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    minHeight: "100vh",
    color: "#e2e8f0"
  },
  hero: {
    textAlign: "center",
    padding: "3rem 1rem",
    marginBottom: "3rem",
    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))",
    borderRadius: "24px",
    border: "1px solid rgba(99, 102, 241, 0.2)",
    backdropFilter: "blur(10px)"
  },
  heroIcon: {
    fontSize: "4rem",
    marginBottom: "1rem",
    animation: "float 3s ease-in-out infinite"
  },
  heroTitle: {
    fontSize: "2.5rem",
    fontWeight: "800",
    background: "linear-gradient(135deg, #6366f1, #a855f7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "0.5rem"
  },
  heroSubtitle: {
    fontSize: "1.1rem",
    color: "#94a3b8",
    maxWidth: "600px",
    margin: "0 auto"
  },
  alertBox: {
    background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))",
    border: "2px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "16px",
    padding: "1.5rem",
    marginBottom: "3rem",
    animation: "slideIn 0.5s ease-out"
  },
  alertHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "1rem"
  },
  alertIcon: {
    fontSize: "1.5rem"
  },
  alertTitle: {
    fontSize: "1.5rem",
    color: "#fca5a5",
    margin: 0
  },
  alertContent: {
    lineHeight: "1.7",
    fontSize: "1rem"
  },
  warningBox: {
    background: "rgba(0, 0, 0, 0.2)",
    padding: "1rem",
    borderRadius: "8px",
    marginTop: "1rem"
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
    transition: "border-color 0.3s ease"
  },
  sectionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    marginBottom: "3rem",
    maxWidth: "900px",
    margin: "0 auto 3rem"
  },
  card: {
    background: "rgba(30, 41, 59, 0.6)",
    borderRadius: "16px",
    border: "1px solid rgba(148, 163, 184, 0.1)",
    overflow: "hidden",
    transition: "all 0.3s ease",
    animation: "fadeInUp 0.6s ease-out",
    backdropFilter: "blur(10px)",
    width: "100%"
  },
  cardHeader: {
    padding: "1.25rem 1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    borderBottom: "1px solid rgba(148, 163, 184, 0.1)"
  },
  cardIcon: {
    fontSize: "2rem",
    flexShrink: 0
  },
  cardTitle: {
    fontSize: "1.35rem",
    fontWeight: "700",
    margin: 0,
    flex: 1
  },
  expandIcon: {
    fontSize: "1.2rem",
    color: "#94a3b8",
    fontWeight: "300",
    transition: "transform 0.3s ease"
  },
  cardBody: {
    overflow: "hidden",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
  },
  contentWrapper: {
    fontSize: "1rem",
    lineHeight: "1.7",
    color: "#cbd5e1"
  },
  detailsBox: {
    background: "rgba(0, 0, 0, 0.2)",
    borderRadius: "8px",
    padding: "1rem",
    margin: "1rem 0",
    border: "1px solid rgba(148, 163, 184, 0.1)"
  },
  detailsTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "0.75rem",
    color: "#e2e8f0"
  },
  warningCard: {
    background: "linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.05))",
    border: "1px solid rgba(251, 191, 36, 0.3)",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    margin: "1rem 0",
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
    fontSize: "0.95rem"
  },
  warningIcon: {
    flexShrink: 0,
    fontSize: "1.2rem"
  },
  viewButton: {
    display: "inline-block",
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    color: "white",
    textDecoration: "none",
    fontWeight: "600",
    marginTop: "1.5rem",
    transition: "all 0.3s ease",
    border: "none",
    cursor: "pointer",
    fontSize: "0.95rem"
  },
  footer: {
    textAlign: "center",
    padding: "2rem",
    borderTop: "1px solid rgba(148, 163, 184, 0.1)",
    marginTop: "3rem"
  },
  footerText: {
    color: "#94a3b8",
    fontSize: "0.95rem"
  }
};

// Add keyframes via style tag
const styleSheet = document.createElement("style");
styleSheet.textContent = `
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
  
  div[style*="cardHeader"]:hover {
    transform: translateX(5px);
  }
  
  a[style*="viewButton"]:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    filter: brightness(1.1);
  }
  
  div[style*="contentWrapper"] ul {
    padding-left: 1.5rem;
    margin: 0.75rem 0;
  }
  
  div[style*="contentWrapper"] li {
    margin: 0.5rem 0;
  }
  
  div[style*="contentWrapper"] p {
    margin: 0.75rem 0;
  }
  
  div[style*="contentWrapper"] strong {
    color: #e2e8f0;
    font-weight: 600;
  }
  
  div[style*="contentWrapper"] em {
    color: #94a3b8;
    font-style: italic;
  }
`;
document.head.appendChild(styleSheet);

export default AboutDemo;