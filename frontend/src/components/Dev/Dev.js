import React, { useEffect } from "react";
import "./Dev.css";

export default function Dev() {
  useEffect(() => {
    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href && href.startsWith("#")) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    });
    

    // Parallax effect for floating shapes
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const shapes = document.querySelectorAll(".shape");
      shapes.forEach((shape, index) => {
        const speed = 0.5 + index * 0.1;
        shape.style.transform = `translateY(${scrolled * speed}px)`;
      });
    };
    window.addEventListener("scroll", handleScroll);

    // Intersection Observer for animations
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    document.querySelectorAll(".section").forEach((section) => {
      section.style.opacity = "0";
      section.style.transform = "translateY(30px)";
      section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(section);
    });

    // Skill tags hover effect
    document.querySelectorAll(".skill-tag").forEach((tag) => {
      tag.addEventListener("mouseenter", function () {
        this.style.background = "linear-gradient(45deg, #764ba2, #667eea)";
      });
      tag.addEventListener("mouseleave", function () {
        this.style.background = "linear-gradient(45deg, #667eea, #764ba2)";
      });
    });

    // Typing effect
    function typeWriter(element, text, speed = 100) {
      let i = 0;
      element.innerHTML = "";
      function type() {
        if (i < text.length) {
          element.innerHTML += text.charAt(i);
          i++;
          setTimeout(type, speed);
        }
      }
      type();
    }
    const headerText = document.querySelector(".header h1");
    if (headerText) {
      const originalText = headerText.textContent;
      typeWriter(headerText, originalText, 80);
    }

    // CTA button ripple effect
    document.querySelectorAll(".cta-button").forEach(button => {
      button.addEventListener("click", function(e) {
        let ripple = document.createElement("span");
        ripple.classList.add("ripple");
        ripple.style.left = (e.clientX - e.target.offsetLeft) + "px";
        ripple.style.top = (e.clientY - e.target.offsetTop) + "px";
        this.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="dev-page">
      <div className="floating-shapes">
        <div className="shape">🏊‍♂️</div>
        <div className="shape">💻</div>
        <div className="shape">🚀</div>
      </div>

      <div className="container">
        <header className="header">
          <h1>Despre Developer</h1>
          <p>Creatorul din spatele site-ului Delfinii Ghiriseni</p>
        </header>

        <div className="content">
          <aside className="profile-card">
            <div className="profile-img">RZ</div>
            <h2>Razvan</h2>
            <p className="role">Full Stack Developer</p>
            <ul className="contact-info space-y-3">
      <li className="flex items-center space-x-3">
        <span className="icon text-blue-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        </span>
        <a 
          href="mailto:razvanoara2002@gmail.com"
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          Gmail
        </a>
      </li>
      <li className="flex items-center space-x-3">
        <span className="icon text-blue-700">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </span>
        <a 
          href="https://www.linkedin.com/in/oar%C4%83-r%C4%83zvan-b207832b4/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-700 hover:text-blue-900 transition-colors"
        >
          LinkedIn
        </a>
      </li>
      <li className="flex items-center space-x-3">
        <span className="icon text-gray-800">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </span>
        <a 
          href="https://github.com/RazvanOara" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-800 hover:text-black transition-colors"
        >
          GitHub
        </a>
      </li>
      <li className="flex items-center space-x-3">
        <span className="icon text-red-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </span>
        <span className="text-gray-700">Turda, Cluj, România</span>
      </li>
    </ul>
          </aside>

          <main className="main-content">
          <section className="section">
              <h3>Despre Mine</h3>
              <p>Sunt un dezvoltator web pasionat, pe cale de a absolvi Computer Science la UTCN Cluj-Napoca. Am creat site-ul pentru Delfinii Ghiriseni pentru a ajuta această minunată școală de înot să își prezinte serviciile online și să faciliteze comunicarea cu cursanții.</p>
              <p>Îmi place să combin funcționalitatea cu designul elegant pentru a crea experiențe web memorabile. Sunt pasionat de orice ține de domeniul IT și mereu gata de o nouă provocare. Specializarea mea include atât dezvoltarea frontend cât și backend, cu focus pe tehnologii moderne și soluții de digitalizare pentru orice tip de afacere.</p>
            </section>

            <section className="section">
              <h3>Tehnologii Folosite</h3>
              <p>Pentru site-ul Delfinii Ghiriseni am utilizat o combinație de tehnologii moderne:</p>
              <div className="skills">
                <span className="skill-tag">React.js</span>
                <span className="skill-tag">Node.js</span>
                <span className="skill-tag">CSS3</span>
                <span className="skill-tag">HTML5</span>
                <span className="skill-tag">JavaScript</span>
                <span className="skill-tag">Responsive Design</span>
                <span className="skill-tag">Docker</span>
                <span className="skill-tag">Nginx</span>
                <span className="skill-tag">Security Testing</span>
                <span className="skill-tag">bcrypt</span>
              </div>
            </section>

            <section className="section">
              <h3>Experiența Proiectului</h3>
              <div className="timeline">
                <div className="timeline-item">
                  <h4>Planificarea & Arhitectura</h4>
                  <div className="date">Primele Săptămâni</div>
                  <p>Design la flow-ul aplicației, planificarea bazei de date și stabilirea arhitecturii tehnice. Analiza cerințelor și crearea structurii pentru o platformă scalabilă.</p>
                </div>
                <div className="timeline-item">
                  <h4>Prototiparea Frontend-ului</h4>
                  <div className="date">Faza Explorare</div>
                  <p>Implementarea unui frontend basic pentru înțelegerea nevoilor clientului și testarea conceptelor de UI/UX cu React.js.</p>
                </div>
                <div className="timeline-item">
                  <h4>Dezvoltarea Backend-ului</h4>
                  <div className="date">Faza Core</div>
                  <p>Crearea backend-ului și implementarea tuturor funcionalităților esențiale: API-uri, baza de date, autentificare cu bcrypt, și sistemul de PDF generation.</p>
                </div>
                <div className="timeline-item">
                  <h4>Ajustarea & Integrarea</h4>
                  <div className="date">Faza Optimizare</div>
                  <p>Ajustarea frontend-ului pentru integrarea cu backend-ul, testare extensivă și optimizarea funcționalităților pentru o experiență fluidă.</p>
                </div>
                <div className="timeline-item">
                  <h4>Prima Versiune Live</h4>
                  <div className="date">Deploy Inițial</div>
                  <p>Deploy-ul primei variante funcționale cu Docker și nginx. Testare în mediul de producție și colectarea feedback-ului utilizatorilor.</p>
                </div>
                <div className="timeline-item">
                  <h4>Redesign Complet</h4>
                  <div className="date">După 1-2 Săptămâni</div>
                  <p>Crearea unui design frontend complet nou bazat pe feedback și adăugarea de noi funcționalități în backend pentru o experiență îmbunătățită.</p>
                </div>
                <div className="timeline-item">
                  <h4>Securitate & Performance</h4>
                  <div className="date">Faza Finală</div>
                  <p>Testare comprehensivă cu OWASP ZAP, implementarea măsurilor de securitate avansate și optimizarea pentru Grade A+ SSL performance.</p>
                </div>
              </div>
            </section>

            <section className="section">
              <h3>Caracteristicile Site-ului</h3>
              <ul className="features">
                <li><strong>Design Responsive:</strong> Optimizat pentru toate dispozitivele - desktop, tablet, mobile</li>
                <li><strong>Securitate A+:</strong> Grade A+ SSL, CSP headers, bcrypt authentication, zero vulnerabilități critice</li>
                <li><strong>Performanță Optimizată:</strong> Încărcare rapidă a paginilor și imagini optimizate</li>
                <li><strong>SEO Friendly:</strong> Structură optimizată pentru motoarele de căutare</li>
                <li><strong>Contact Integration:</strong> Formular de contact cu Google reCAPTCHA și validare</li>
              </ul>
            </section>
          </main>
        </div>

        <section className="cta-section">
        <h3>Ai nevoie de o soluție digitală?</h3>
          <p>Dacă ești impresionat de proiectul Delfinii Ghiriseni și ai nevoie de servicii de dezvoltare software - site web, aplicație desktop sau orice altă soluție tehnologică pentru afacerea ta, să discutăm!</p>
          <a href="mailto:razvanoara2002@gmail.com" className="cta-button">
            Contactează-mă
          </a>
          <a href="https://delfiniighiriseni.ro" className="cta-button">
            Vezi Site-ul Live
          </a>
        </section>
      </div>
    </div>
  );
}