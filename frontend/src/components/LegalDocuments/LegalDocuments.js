import React from 'react';
import './LegalDocuments.css';

// Privacy Policy Component
export const PrivacyPolicy = () => {
  return (
    <div className="legal-document">
      <div className="legal-header">
        <h1>Politica de Confidențialitate</h1>
        <p className="last-updated">Ultima actualizare: 1 Octombrie 2025</p>
      </div>

      <div className="legal-content">
        <section className="legal-section">
          <h2>1. Operator de Date</h2>
          <p><strong>Operator:</strong> Municipiul Câmpia Turzii</p>
          <p><strong>Administrator:</strong> Bazinul Didactic de Înot Câmpia Turzii</p>
          <p><strong>Contact:</strong> petric.gabriel@delfiniighiriseni.ro</p>
        </section>

        <section className="legal-section">
          <h2>2. Date Colectate</h2>
          <p>Colectăm următoarele date personale:</p>
          <ul>
            <li>Nume, prenume, data nașterii</li>
            <li>Adresă de domiciliu, CNP</li>
            <li>Număr de telefon și adresă de e-mail</li>
            <li>Date despre starea sănătății (certificat medical)</li>
            <li>Parolă administrativă (criptată cu bcrypt)</li>
            <li>Date tehnice (adresă IP, browser, cookie-uri de sesiune)</li>
            <li>Consimțământ GDPR (versiune acceptată, dată, IP)</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. Scopul Prelucrării</h2>
          <p>Folosim datele pentru:</p>
          <ul>
            <li>Procesarea înregistrării online și generarea automată de documente PDF</li>
            <li>Realizarea programului didactic de înot</li>
            <li>Protecția sănătății și siguranței participanților</li>
            <li>Comunicări prin email despre confirmări de înscriere și anunțuri</li>
            <li>Respectarea obligațiilor legale și gestionarea expirării înregistrărilor (45 zile)</li>
          </ul>
          <p><strong>Temei legal:</strong> Executarea contractului (Art. 6(1)(b) GDPR) și consimțământ explicit pentru datele medicale (Art. 9(2)(a) GDPR)</p>
        </section>

        <section className="legal-section">
          <h2>4. Perioada de Stocare</h2>
          <ul>
            <li>Înregistrări active: 45 zile (expirare automată)</li>
            <li>Înregistrări expirate: păstrate conform obligațiilor legale (3-5 ani)</li>
            <li>Date tehnice (loguri): maximum 12 luni</li>
            <li>La cerere: ștergere imediată (excepție obligații legale de arhivare)</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>5. Destinatarii Datelor</h2>
          <p>Datele au caracter <strong>exclusiv intern</strong>. Nu le împărtășim cu terți, cu excepția:</p>
          <ul>
            <li>Autorități publice (la cerere legală: instanțe, poliție, ANSPDCP)</li>
            <li>Furnizori servicii cloud și hosting (Hetzner - Germania, conformitate GDPR)</li>
            <li>Servicii email (pentru trimiterea confirmărilor de înscriere)</li>
            <li>Personal medical (în caz de urgență)</li>
          </ul>
          <p>Toate datele sunt stocate pe servere localizate în Uniunea Europeană.</p>
        </section>

        <section className="legal-section">
          <h2>6. Drepturile Dumneavoastră GDPR</h2>
          <p>Aveți următoarele drepturi pe care le puteți exercita în orice moment:</p>
          <ul>
            <li><strong>Dreptul de acces (Art. 15)</strong> - Solicitați o copie completă a datelor</li>
            <li><strong>Dreptul la rectificare (Art. 16)</strong> - Corectați datele incorecte</li>
            <li><strong>Dreptul la ștergere - "Dreptul de a fi uitat" (Art. 17)</strong> - Ștergeți toate datele în orice moment (înregistrarea va fi anulată definitiv)</li>
            <li><strong>Dreptul la restricționare (Art. 18)</strong> - Limitați temporar prelucrarea</li>
            <li><strong>Dreptul la portabilitate (Art. 20)</strong> - Primiți datele în format digital transferabil (JSON, PDF)</li>
            <li><strong>Dreptul la opoziție (Art. 21)</strong> - Opuneți-vă anumitor prelucrări</li>
            <li><strong>Retragerea consimțământului (Art. 7(3))</strong> - Oricând, pentru datele medicale</li>
          </ul>
          <p><strong>Cum exercitați drepturile:</strong> Trimiteți cerere la petric.gabriel@delfiniighiriseni.ro cu copie act identitate. Răspuns garantat în maximum 30 zile.</p>
        </section>

        <section className="legal-section">
          <h2>7. Securitatea Datelor</h2>
          <p>Platforma noastră implementează măsuri de securitate avansate, testate independent:</p>
          
          <h3>Măsuri Tehnice Implementate:</h3>
          <ul>
            <li><strong>Criptare SSL/TLS 1.3</strong> - Certificat Grad A+ (SSL Labs, scor 93/100)</li>
            <li><strong>Autentificare securizată</strong> - Parole hash-uite cu bcrypt, JWT tokens</li>
            <li><strong>Protecție CSRF</strong> - Token-uri anti-falsificare pe toate formularele</li>
            <li><strong>Google reCAPTCHA v3</strong> - Protecție împotriva bot-urilor și atacuri automate</li>
            <li><strong>Rate limiting</strong> - Limitare cereri pentru prevenirea abuzurilor</li>
            <li><strong>Validare duală</strong> - Verificare date pe frontend și backend</li>
            <li><strong>Firewall și nginx reverse proxy</strong> - Filtrare trafic rău-intenționat</li>
            <li><strong>Docker containerizare</strong> - Izolare servicii pentru securitate sporită</li>
            <li><strong>Backup-uri zilnice criptate</strong> - Protecție împotriva pierderii datelor</li>
          </ul>

          <h3>Teste de Securitate Efectuate:</h3>
          <ul>
            <li><strong>OWASP ZAP Penetration Testing</strong> - Scanări complete, fără vulnerabilități critice</li>
            <li><strong>Testare SSL/TLS</strong> - Validare configurație criptare</li>
            <li><strong>Audit OWASP Top 10</strong> - Verificare vulnerabilități comune (XSS, SQL injection, etc.)</li>
          </ul>

          <div className="info-box warning">
            <p><strong>⚠️ Limitarea Răspunderii în Materie de Securitate:</strong></p>
            <p>
              Deși aplicăm cele mai bune practici în materie de securitate cibernetică și efectuăm 
              teste regulate de penetrare, <strong>nicio platformă digitală nu poate garanta securitate 
              absolută împotriva tuturor amenințărilor</strong>.
            </p>
            <p>
              În eventualitatea unui incident de securitate (încălcare de date, acces neautorizat, 
              atac cibernetic reușit), Administratorul:
            </p>
            <ul>
              <li>Va notifica ANSPDCP în maxim 72 ore de la descoperire</li>
              <li>Vă va informa direct dacă există risc ridicat pentru drepturile dumneavoastră</li>
              <li>Va implementa măsuri corective imediate</li>
              <li>Va documenta incidentul conform cerințelor GDPR</li>
            </ul>
            <p>
              <strong>Utilizarea platformei implică acceptarea acestui risc rezidual.</strong> 
              Administratorul nu poate fi ținut responsabil pentru daune rezultate din atacuri 
              cibernetice sofisticate care depășesc măsurile de securitate rezonabile implementate, 
              în limita prevederilor legale aplicabile.
            </p>
          </div>
        </section>

        <section className="legal-section">
          <h2>8. Cookie-uri și Tehnologii de Urmărire</h2>
          <p>Folosim <strong>exclusiv cookie-uri esențiale</strong> pentru funcționarea platformei:</p>
          <ul>
            <li><strong>Cookie-uri de sesiune</strong> - Autentificare administratori (expiră la logout)</li>
            <li><strong>Token CSRF</strong> - Securitate formulare (pe durata sesiunii)</li>
            <li><strong>Cookie consimțământ GDPR</strong> - Memorare acceptare/refuz (12 luni)</li>
          </ul>
          <p><strong>NU folosim:</strong> Cookie-uri de marketing, analytics terțe părți, tracking publicitare, profilare comportamentală.</p>
          <p>Puteți șterge cookie-urile din setările browserului în orice moment.</p>
        </section>

        <section className="legal-section">
          <h2>9. Procesarea Automată și Generare PDF</h2>
          <p>Platforma generează automat 2 documente PDF după completarea formularului de înscriere:</p>
          <ul>
            <li><strong>Formular de înscriere</strong> - Date personale, contact, program ales</li>
            <li><strong>Declarație GDPR</strong> - Versiune adaptată pentru minori/adulți</li>
          </ul>
          <p>PDF-urile sunt generate pe baza template-urilor pre-completate și stocate securizat pe server. 
          Accesul la acestea este restricționat doar pentru administratori autorizați.</p>
        </section>

        <section className="legal-section">
          <h2>10. Transfer Internațional de Date</h2>
          <p>
            <strong>Toate datele sunt stocate exclusiv în Uniunea Europeană</strong> (servere Hetzner - Germania). 
            Nu efectuăm transferuri de date în țări din afara spațiului economic european (SEE).
          </p>
        </section>

        <section className="legal-section">
          <h2>11. Modificări ale Politicii</h2>
          <p>Administratorul poate actualiza această Politică pentru conformitate legală sau îmbunătățiri tehnice:</p>
          <ul>
            <li>Notificare prin email cu minimum 30 zile înainte de modificări majore</li>
            <li>Afișare pe site cu evidențiere modificărilor</li>
            <li>Versiune actualizată salvată în baza de date cu timestamp</li>
            <li>Pentru modificări esențiale: necesară re-acceptare la următoarea autentificare</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>12. Contact și Autoritate de Supraveghere</h2>
          
          <div className="contact-box">
            <h3>📧 Contactați Operatorul de Date:</h3>
            <p><strong>Email:</strong> petric.gabriel@delfiniighiriseni.ro</p>
            <p><strong>Telefon:</strong> +40 740 046 575</p>
            <p><strong>Adresă:</strong> Municipiul Câmpia Turzii, județul Cluj, România</p>
            <p><strong>Program:</strong> Luni - Vineri, 08:00 - 16:00</p>
          </div>

          <div className="contact-box">
            <h3>⚖️ Autoritatea Națională de Supraveghere (ANSPDCP):</h3>
            <p><strong>Website:</strong> www.dataprotection.ro</p>
            <p><strong>Email:</strong> anspdcp@dataprotection.ro</p>
            <p><strong>Telefon:</strong> +40 318 059 211</p>
            <p><strong>Adresă:</strong> B-dul G-ral. Gheorghe Magheru 28-30, Sector 1, București</p>
            <p><em>Puteți depune plângere la ANSPDCP dacă considerați că drepturile GDPR v-au fost încălcate.</em></p>
          </div>
        </section>
      </div>
    </div>
  );
};

// Terms and Conditions Component
export const TermsAndConditions = () => {
  return (
    <div className="legal-document">
      <div className="legal-header">
        <h1>Termeni și Condiții</h1>
        <p className="last-updated">Ultima actualizare: 1 Octombrie 2025</p>
      </div>

      <div className="legal-content">
        <section className="legal-section">
          <h2>1. Acceptarea Termenilor</h2>
          <p>
            Prin utilizarea platformei de înscriere online și a site-ului Bazinului Didactic de Înot 
            Câmpia Turzii, acceptați integral acești Termeni și Condiții, Politica de Confidențialitate 
            și prelucrarea datelor conform GDPR.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Procesul de Înregistrare Online</h2>
          <p><strong>Înscrierea se realizează prin:</strong></p>
          <ul>
            <li>Completarea formularului interactiv online (fără cont necesar)</li>
            <li>Validare în timp real a datelor introduse</li>
            <li>Acceptarea explicită a termenilor GDPR</li>
            <li>Încărcarea certificatului medical (format digital)</li>
          </ul>
          
          <p><strong>După trimiterea formularului:</strong></p>
          <ul>
            <li>Generare automată a 2 PDF-uri (formular înscriere + declarație)</li>
            <li>Stocare securizată pe server</li>
            <li>Email de confirmare cu documentele atașate</li>
            <li>Înregistrarea devine activă pentru 45 zile</li>
          </ul>

          <p><strong>Expirarea înregistrării:</strong></p>
          <ul>
            <li>Automată după 45 zile de inactivitate</li>
            <li>Posibilitate de reînnoire la cerere</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. Responsabilitățile Utilizatorului</h2>
          <p><strong>Vă angajați să:</strong></p>
          <ul>
            <li>Furnizați date complete, corecte și actualizate</li>
            <li>Încărcați un certificat medical valid (maximum 1 an vechime)</li>
            <li>Notificați imediat orice modificare a datelor sau a stării de sănătate</li>
            <li>Nu utilizați platforma în scopuri frauduloase</li>
            <li>Nu încercați să accesați zone restricționate (panoul de administrare)</li>
            <li>Respectați drepturile de proprietate intelectuală asupra conținutului</li>
          </ul>

          <p><strong>Ștergerea datelor:</strong> Puteți solicita ștergerea completă a datelor în orice moment 
          prin exercitarea dreptului GDPR "de a fi uitat". Înregistrarea va fi anulată definitiv.</p>
        </section>

        <section className="legal-section">
          <h2>4. Servicii Oferite</h2>
          <p>Bazinul oferă:</p>
          <ul>
            <li>Cursuri de înot pentru toate vârstele și nivelurile</li>
            <li>Instructori calificați și certificați</li>
            <li>Facilități moderne: bazin încălzit, vestiare, dușuri</li>
            <li>Platformă digitală pentru înscriere și comunicare</li>
            <li>Anunțuri și notificări prin email</li>
          </ul>

          <p><strong>Modificări de program:</strong> Administratorul poate modifica orele cursurilor cu 
          preaviz de minimum 48 ore sau anula în caz de forță majoră (probleme tehnice, pandemii, decizii autorităților).</p>
        </section>

        <section className="legal-section">
          <h2>5. Condiții de Participare</h2>
          <p><strong>Cerințe obligatorii:</strong></p>
          <ul>
            <li><strong>Certificat medical valabil</strong> - Maximum 1 an vechime, confirmare aptitudine pentru înot</li>
            <li><strong>Echipament:</strong> Costum de baie, cască înot, ochelari (recomandat), papuci cauciuc</li>
            <li><strong>Igienă:</strong> Duș obligatoriu cu săpun înainte de intrare</li>
            <li><strong>Interzis:</strong> Acces cu răni deschise, boli contagioase, afecțiuni dermatologice active</li>
          </ul>

          <p><strong>Pentru minori (sub 18 ani):</strong></p>
          <ul>
            <li>Consimțământul părintelui/tutorelui legal la înscriere</li>
            <li>Date complete ale reprezentantului legal în formular</li>
            <li>Părintele poate exercita toate drepturile GDPR în numele minorului</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>6. Obligațiile Beneficiarului</h2>
          <ul>
            <li>Respectați regulamentul intern și indicațiile instructorilor</li>
            <li><strong>NU alergați</strong> în zona bazinului</li>
            <li><strong>NU săriți</strong> în apă fără aprobare</li>
            <li><strong>NU împingeți</strong> alți participanți</li>
            <li>Comportament civilizat, respectuos, fără limbaj obscen</li>
            <li>Interzis consumul de alcool sau substanțe interzise</li>
            <li>Punctualitate - sosire cu minimum 10 minute înainte</li>
            <li>Anunțarea absențelor cu minimum 24 ore în avans</li>
            <li>Respectarea confidențialității celorlalți (interzis fotografiat/filmat fără consimțământ)</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>7. Obligațiile Administratorului</h2>
          <ul>
            <li>Menținerea condițiilor sigure și curate</li>
            <li>Asigurarea instructorilor calificați în număr suficient</li>
            <li>Echipament de prim ajutor și personal instruit</li>
            <li>Protecția datelor conform GDPR</li>
            <li>Notificarea modificărilor de program în timp util</li>
            <li>Funcționarea corectă a platformei de înscriere online</li>
            <li>Răspuns la solicitările de exercitare a drepturilor GDPR în 30 zile</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>8. Răspundere și Limitări</h2>
          
          <p><strong>Administratorul răspunde pentru:</strong></p>
          <ul>
            <li>Siguranța facilităților în condiții normale de utilizare</li>
            <li>Acțiunile personalului și instructorilor</li>
            <li>Protecția datelor personale conform GDPR</li>
            <li>Respectarea standardelor de igienă și siguranță</li>
          </ul>

          <p><strong>Administratorul NU răspunde pentru:</strong></p>
          <ul>
            <li>Accidente rezultate din nerespectarea regulamentului</li>
            <li>Vătămări cauzate de ascunderea problemelor medicale</li>
            <li>Bunuri personale pierdute, furate sau deteriorate (folosiți dulapurile cu lacăt)</li>
            <li>Întreruperi cauzate de forță majoră (cutremure, inundații, pandemii, război)</li>
            <li>Probleme tehnice temporare ale platformei online</li>
            <li>Daune rezultate din atacuri cibernetice sofisticate (vezi Politica de Confidențialitate, Secțiunea 7)</li>
          </ul>

          <div className="info-box warning">
            <p><strong>⚠️ Important:</strong> Platforma utilizează măsuri avansate de securitate, însă 
            nicio tehnologie nu este 100% sigură. Utilizarea serviciilor online implică acceptarea 
            unui risc rezidual de securitate cibernetică.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>9. Anularea Înregistrării</h2>
          
          <p><strong>Anulare de către Administrator (fără rambursare):</strong></p>
          <ul>
            <li>Furnizare informații false sau incomplete</li>
            <li>Comportament violent, amenințător sau inadecvat</li>
            <li>Încălcări repetate ale regulamentului</li>
            <li>Punerea în pericol a siguranței proprii sau a altora</li>
            <li>Nerespectarea condițiilor de igienă</li>
          </ul>

          <p><strong>Anulare de către utilizator:</strong></p>
          <ul>
            <li>Solicitare ștergere date conform GDPR (dreptul de a fi uitat)</li>
            <li>Retragere consimțământ pentru prelucrarea datelor medicale</li>
            <li>Cerere scrisă de anulare (petric.gabriel@delfiniighiriseni.ro)</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>10. Utilizarea Platformei Online</h2>
          
          <p><strong>Utilizare permisă:</strong></p>
          <ul>
            <li>Completarea formularului de înscriere</li>
            <li>Consultarea informațiilor despre cursuri, program, instructori</li>
            <li>Vizualizarea galeriei foto și anunțurilor</li>
            <li>Contactarea administratorului prin formularul de contact</li>
          </ul>

          <p><strong>Utilizare interzisă:</strong></p>
          <ul>
            <li>Încercări de acces neautorizat la panoul de administrare</li>
            <li>Atacuri informatice (XSS, SQL injection, DDoS, etc.)</li>
            <li>Trimitere spam sau conținut malițios</li>
            <li>Scraping automat de date fără autorizație</li>
            <li>Folosirea platformei în scopuri ilegale</li>
            <li>Reproducerea sau distribuirea conținutului fără permisiune</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>11. Proprietate Intelectuală</h2>
          <p>
            Toate elementele site-ului (design, logo, imagini, text, cod sursă, PDF-uri generate) 
            sunt protejate de legile drepturilor de autor. Reproducerea, modificarea sau distribuirea 
            fără autorizație scrisă este interzisă și poate atrage răspundere civilă și penală.
          </p>
        </section>

        <section className="legal-section">
          <h2>12. Forță Majoră</h2>
          <p>
            Nicio parte nu răspunde pentru neîndeplinirea obligațiilor din cauza evenimentelor de 
            forță majoră: dezastre naturale, pandemii, război, acte de terorism, decizii ale autorităților, 
            greve generale, defecțiuni majore de infrastructură, atacuri cibernetice masive.
          </p>
        </section>

        <section className="legal-section">
          <h2>13. Modificări ale Termenilor</h2>
          <p>
            Administratorul poate modifica acești termeni cu notificare de minimum 30 zile prin email. 
            Continuarea utilizării platformei după intrarea în vigoare = acceptare tacită. Pentru 
            modificări majore, este necesară acceptare explicită la următoarea autentificare.
          </p>
        </section>

        <section className="legal-section">
          <h2>14. Legea Aplicabilă și Jurisdicție</h2>
          <ul>
            <li>Acești termeni sunt guvernați de <strong>legile României</strong></li>
            <li>Aplicare directivelor și regulamentelor UE (inclusiv GDPR)</li>
            <li>Soluționare amiabilă preferată pentru orice dispută</li>
            <li>În lipsa acordului: jurisdicția instanțelor din <strong>Cluj-Napoca, România</strong></li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>15. Contact</h2>
          <div className="contact-box">
            <p><strong>Municipiul Câmpia Turzii</strong></p>
            <p>Bazinul Didactic de Înot Câmpia Turzii</p>
            <p><strong>Email:</strong> petric.gabriel@delfiniighiriseni.ro</p>
            <p><strong>Telefon:</strong>  +40 740 046 575</p>
            <p><strong>Adresă:</strong> Câmpia Turzii, județul Cluj, România</p>
            <p><strong>Program:</strong> Luni - Vineri, 08:00 - 16:00</p>
          </div>
        </section>
      </div>
    </div>
  );
};