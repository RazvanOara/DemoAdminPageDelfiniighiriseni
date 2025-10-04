# Swimming Club Management Platform - Admin Interface

**Public demonstration of the admin interface** for a comprehensive swimming club management system currently running in production at [delfiniighiriseni.ro](https://delfiniighiriseni.ro).

> **Purpose:** This repository makes the admin interface publicly visible with mock data. The actual production system contains real data and is access-restricted. This demo showcases the platform's capabilities for portfolio and educational purposes.

---

## 🎯 Project Context

This platform solves two major operational challenges for competitive swimming clubs:

### 1. Digital Registration System
Transforms paper-based registration (3 physical documents) into a streamlined online process:
- Single web form with real-time validation
- Auto-generates 2 PDFs server-side (registration + declaration)
- Email delivery with attachments
- Medical certificate upload handling
- GDPR-compliant consent tracking

### 2. Professional Training Management
Provides coaches with comprehensive tools for competitive swimming programs:
- Structured workout creation with complex intervals
- Long-term periodization planning (macro-cycles)
- Session management with live time recording
- Athlete performance tracking and progression
- Group organization and bulk operations

---

## 🏗️ System Architecture

### Dual Interface Design

**Public Interface (Production):**
- Registration forms with progress tracking
- Gallery, announcements, contact pages
- Mobile-responsive with animations
- Real-time validation and user feedback

**Admin Interface (This Repository):**
- Registration management dashboard
- Training module (workouts, plans, sessions)
- Athlete profiles and performance tracking
- Group management
- GDPR compliance tools
- System monitoring

### Technology Stack

**Frontend:**
- React 18 with functional components
- React Router for navigation
- CSS Modules for styling
- Mock data layer (demo version)

**Backend (Production):**
- Spring Boot REST API
- PostgreSQL database
- Docker containerization
- nginx reverse proxy

**Deployment:**
- Hetzner Cloud VPS
- Docker Compose orchestration
- Let's Encrypt SSL/TLS (Grade A+)
- Hostinger domain management
- SSH key authentication only

---

## 🔒 Security Implementation

The production system has undergone comprehensive security hardening:

**Penetration Testing (OWASP ZAP):**
- No high-severity vulnerabilities found
- Clean results for XSS, SQL injection
- No authentication bypass vulnerabilities
- Proper session management

**SSL/TLS Analysis:**
- SSL Labs Grade A+ (93/100)
- TLS 1.2/1.3 exclusively
- Forward secrecy enabled
- Protected against known attacks

**Application Security:**
- bcrypt password hashing
- JWT-based authentication
- Rate limiting on all endpoints
- Google reCAPTCHA integration
- Input validation (frontend + backend)
- Security headers (CSP, HSTS)
- Comprehensive audit logging

---

## 📋 Feature Overview

### Registration & Athlete Management

**Digital Registration:**
- Replaces 3 paper forms with single online submission
- Generates professional PDF documents automatically
- Email confirmation system
- Medical certificate storage
- Progress indicators and field validation

**Admin Controls:**
- View all registrations with filtering
- Auto-expiration after 45 days
- Manual status management
- Export to CSV
- Time-based search (hour, day, date range)

**GDPR Compliance:**
- Digital signature tracking (IP, timestamp, version)
- Consent version management
- Complete audit trail
- Privacy policy updates pushed to registration forms

---

### Training Management Suite

#### Advanced Swimmer Profiles
- Convert registrations to athlete profiles
- HR zone configuration:
  - Maximum heart rate
  - Threshold zones
  - Resting heart rate
  - Age-based auto-calculation with manual override
- Competition times per event
- Performance progression graphs
- Training history tracking

#### Workout Builder
Comprehensive workout creation system:

**Structure:**
- Nested repetitions (unlimited depth)
- Example: 3 × (4 × (2 × 100m Free)) = 2,400m structured set

**Configuration Options:**
- Training types: Endurance, Technique, Tempo, VO2max, Sprint, Recovery
- Skill levels: Beginner, Intermediate, Advanced
- Categories: Warm-up, Main Set, Swim, Cooldown
- Strokes: Free, Back, Breast, Fly, IM, Choice
- Drill types: Kick, Pull, Full stroke
- Intensity: HR-based, Pace-based, CSS
- Equipment: Paddles, Pull buoy, Fins, Snorkel, Kickboard
- Distance: 25m increments with rapid entry
- Notes per step

**Management:**
- Search and filter library
- Duplicate for quick variants
- Print view for poolside use
- Delete with confirmation

#### Training Plans (Periodization)
Long-term planning with scientific periodization:

**Macro-Phases:**
- Accumulation (4-6 weeks) - Volume focus
- Intensification (2-4 weeks) - High intensity
- Realization (1-2 weeks) - Competition-specific
- Taper (1-3 weeks) - Volume reduction
- Transition (2-4 weeks) - Active recovery

**Planning Tools:**
- Phase calendar: Assign phases to week ranges
- Daily training grid: 7-day view with training types
- Training type system:
  - REZ (Endurance) - Zone 1-2
  - TEHNICA (Technique) - Zone 1-2
  - PA (Anaerobic Threshold) - Zone 3, 1-day recovery
  - TOL (Lactate Tolerance) - Zone 4, 2-day recovery
  - VO2 (VO2 Max) - Zone 5, 3-day recovery
  - TEMPO (Race Pace) - Zone 6, 3-day recovery
- Smart recovery validation: Prevents scheduling conflicts
- Competition scheduling: Target races, tune-ups, test sets

**Participant Management:**
- Assign individual swimmers
- Assign entire groups
- Multiple plan participation
- Automatic session creation from plans

#### Session Management
Daily training orchestration:

**Session Types:**
- Plan-based (auto-created from training plans)
- Ad-hoc (coach-created for specific needs)

**Features:**
- Date navigation with calendar picker
- Display all sessions for selected date
- Workout assignment from library
- Session time configuration
- Real-time attendance tracking:
  - Present
  - Absent
  - Late
  - Injured
- Participant roster management

**Time Recording:**
- Individual swimmer time entry
- Interval-by-interval logging
- Format: mm:ss:cs (minutes:seconds:centiseconds)
- Auto-formatting on input
- Live workout progression interface
- Multi-swimmer simultaneous entry
- REST step indicators
- Stores times as milliseconds in database

**Technical Implementation:**
- Flattened workout structure for tracking
- Hierarchical path system (e.g., "1.2.3" for nested reps)
- Single table design: `session_swimmer_performance`
- Handles both attendance and performance data

#### Group Management
Organize swimmers efficiently:
- Create training groups
- Color-coded differentiation
- Bulk plan assignment
- Bulk session assignment
- Group-level analytics

---

## 📂 Repository Structure

```
src/
├── components/
│   ├── Admin/              # Admin-specific components
│   ├── TrainingHub/        # Training management module
│   │   ├── Dashboard/      # Training overview
│   │   ├── Workouts/       # Workout builder
│   │   ├── Plans/          # Training plans
│   │   └── Sessions/       # Session manager
│   ├── AdvancedSwimmers/   # Athlete profiles
│   ├── Groups/             # Group management
│   └── Common/             # Reusable components
├── pages/
│   ├── Dashboard/
│   ├── Users/              # Registration management
│   ├── TrainingHub/
│   ├── Announcements/
│   └── GDPR/
├── styles/                 # CSS modules
├── utils/                  # Helper functions
└── mockData/               # Demo data
```

---

## 🚀 Running the Demo

### Prerequisites
- Node.js 14+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/razvanoara/DemoAdminPageDelfiniighiriseni.git

# Navigate to directory
cd DemoAdminPageDelfiniighiriseni

# Install dependencies
npm install

# Start development server
npm start
```

Access at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

---

## ⚙️ Demo Limitations

This repository demonstrates the interface only:

**What's Included:**
- Complete UI/UX
- Form validation logic
- Interactive components
- Mock data responses

**What's Not Included:**
- Backend API
- Database connections
- Authentication system
- Real data persistence
- PDF generation
- Email sending

**Use Cases:**
- Portfolio demonstration
- UI/UX evaluation
- Feature exploration
- Reference for similar implementations

---

## 📊 Development Approach

**Client-Focused Development:**
- Iterative feedback cycles
- Regular feature demonstrations
- Requirement adaptation
- User-centered design decisions

**Technical Decisions:**
- Security-first architecture
- Mobile-responsive from start
- Performance optimization
- Accessibility considerations

**Custom Work:**
- Interactive PDF form field mapping
- Icon and logo design
- Image optimization
- Animation implementation

---

## 🔐 Production Security Notes

The live system implements:
- Multi-layer authentication
- Database encryption
- Secure file storage
- API rate limiting
- Input sanitization
- Output encoding
- CSRF protection
- XSS prevention

**Deployment Security:**
- Firewall configuration
- SSH key-only access
- Automated security updates
- Regular backup procedures
- SSL certificate auto-renewal
- Container isolation

---

## 📧 Contact

**Developer:** Răzvan Oara  
**Email:** razvanoara2002@gmail.com  
**Live Platform:** [delfiniighiriseni.ro](https://delfiniighiriseni.ro)

---

## 📝 License

This demonstration repository is provided for educational and portfolio purposes. The code may be viewed and studied, but commercial use or redistribution requires explicit permission.

**Note:** The production system contains proprietary business logic and is not included in this repository.

---

## 🎓 Educational Value

This project demonstrates:
- Full-stack web application development
- RESTful API design
- Secure authentication implementation
- Complex form handling
- Real-time data management
- Performance optimization
- Production deployment
- Security best practices
- User experience design
- Client communication

---

**Version:** 1.0.0 (Demo)  
**Last Updated:** October 2025
