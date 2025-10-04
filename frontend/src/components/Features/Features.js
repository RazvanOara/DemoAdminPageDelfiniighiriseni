// src/components/Features/Features.jsx
import React from 'react';
import './Features.css';

const Features = () => {
  const features = [
    { 
      icon: '/assets/icons/instructor.svg', 
      title: 'Instructori Calificați', 
      description: 'Echipa noastră de instructori profesioniști are experiență vastă în predarea înotului pentru copii.' 
    },
    { 
      icon: '/assets/icons/siguranta.svg', 
      title: 'Siguranță Maximă', 
      description: 'Bazin securizat cu supraveghere constantă și echipamente de salvare la standarde înalte.' 
    },
    { 
      icon: '/assets/icons/programe.svg', 
      title: 'Programe Personalizate', 
      description: 'Lecții adaptate vârstei și nivelului fiecărui copil, de la începători la avansați.' 
    },
    { 
      icon: '/assets/icons/rezultate.svg', 
      title: 'Rezultate Garantate', 
      description: 'Metodele noastre dovedite ajută copiii să învețe rapid și să-și dezvolte încrederea în apă.' 
    },
    {
      icon: '/assets/icons/activitati.svg', 
      title: 'Activități Recreative', 
      description: 'Copiii se distrează în timp ce învață, prin jocuri interactive și exerciții acvatice menite să facă fiecare lecție plăcută și motivantă.' 
    },
    {
      icon: '/assets/icons/competitii.svg', 
      title: 'Competiții și Evenimente', 
      description: 'Organizăm concursuri amicale și evenimente speciale pentru a stimula spiritul de echipă și dorința de performanță a copiilor.' 
    }
  ];

  return (
    <section className="features" id="features">
      <div className="container">
        <h2 className="section-title">De ce să alegi Delfinii Ghirișeni?</h2>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <img 
                src={feature.icon} 
                alt={feature.title}
                className="feature-icon"
              />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;