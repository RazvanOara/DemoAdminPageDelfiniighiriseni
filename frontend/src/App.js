import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import './styles/globals.css';
import './styles/animations.css';

// Admin components only
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard.js'));
const AdminUsersPage = lazy(() => import('./pages/Admin/AdminUsersPage'));
const AdminLayout = lazy(() => import('./pages/Admin/AdminLayout'));
const SystemInfo = lazy(() => import('./pages/Admin/SystemInfo.js'));
const AdvancedSwimmers = lazy(() => import('./pages/Admin/AdvancedSwimmers'));
const CreateAdvancedSwimmer = lazy(() => import('./pages/Admin/CreateAdvancedSwimmer.js'));
const ViewAdvancedSwimmer = lazy(() => import('./pages/Admin/ViewAdvancedSwimmer.js'));
const Consimtamant = lazy(() => import('./pages/Admin/Consimtamant.js'));
const GdprTable = lazy(() => import('./pages/Admin/GdprTable.js'));
const CreateSwimmingTimes = lazy(() => import('./pages/Admin/CreateSwimmingTimes'));
const SwimmingTimes = lazy(() => import('./pages/Admin/SwimmingTimes'));
const CursantTimesDetails = lazy(() => import('./pages/Admin/CursantTimesDetails'));
const GroupsManagement = lazy(() => import('./pages/Admin/GroupsManagement'));
const AdminAnnouncements = lazy(() => import('./pages/Admin/AdminAnnouncementsPage.js'));
const SessionManager = lazy(() => import('./pages/Admin/SessionManager.js'));
const TimeRecorder = lazy(() => import('./pages/Admin/TimeRecorder.js'));
const LiveWorkout = lazy(() => import('./pages/Admin/LiveWorkout'));
const AboutDemo = lazy(() => import('./pages/Admin/AboutDemo.js'));


// Training components
const Planificare = lazy(() => import('./pages/Admin/Training/Planificare.js'));
const WorkoutBuilder = lazy(() => import('./pages/Admin/Training/WorkoutBuilder.js'));
const Workouts = lazy(() => import('./pages/Admin/Training/Workouts.js'));
const WorkoutPreview = lazy(() => import('./pages/Admin/Training/WorkoutPreview.js'));
const Plans = lazy(() => import('./pages/Admin/Training/Plans.js'));

// Enhanced loading component
const LoadingSpinner = ({ message = 'Se încarcă...' }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
    color: 'var(--text-secondary, #666)',
    fontSize: '16px'
  }}>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px'
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        border: '3px solid #f3f3f3',
        borderTop: '3px solid var(--primary-color, #007bff)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      {message}
    </div>
  </div>
);

// Page-specific loading messages
const PageLoader = ({ page }) => {
  const messages = {
    admin: 'Se încarcă panoul de administrare...',
    training: 'Se încarcă modulul de antrenament...',
    default: 'Se încarcă...'
  };
  
  return <LoadingSpinner message={messages[page] || messages.default} />;
};

function AppContent() {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return (
    <div className="App">
      <main className="main-content">
        <Routes>
          {/* Redirect root to admin dashboard */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
          
          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <Suspense fallback={<PageLoader page="admin" />}>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <AdminDashboard />
                  </Suspense>
                </AdminLayout>
              </Suspense>
            }
          />
{/* About Demo Page */}
<Route
  path="/admin/about-demo"
  element={
    <Suspense fallback={<PageLoader page="admin" />}>
      <AdminLayout>
        <Suspense fallback={<LoadingSpinner />}>
          <AboutDemo />
        </Suspense>
      </AdminLayout>
    </Suspense>
  }
/>

          {/* Session Manager */}
          <Route
            path="/admin/traininghub/sessionManager"
            element={
              <Suspense fallback={<PageLoader page="training" />}>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <SessionManager />
                  </Suspense>
                </AdminLayout>
              </Suspense>
            }
          />

          {/* Admin Users */}
          <Route
            path="/admin/users"
            element={
              <Suspense fallback={<PageLoader page="admin" />}>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <AdminUsersPage />
                  </Suspense>
                </AdminLayout>
              </Suspense>
            }
          />

          {/* Admin Announcements */}
          <Route
            path="/admin/announcements"
            element={
              <Suspense fallback={<PageLoader page="admin" />}>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <AdminAnnouncements />
                  </Suspense>
                </AdminLayout>
              </Suspense>
            }
          />
          
          {/* Training Hub Dashboard */}
          <Route
            path="/admin/traininghub"
            element={
              <Suspense fallback={<PageLoader page="training" />}>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <Planificare />
                  </Suspense>
                </AdminLayout>
              </Suspense>
            }
          />

          {/* GDPR Consents Dashboard */}
          <Route
            path="/admin/consimtamant"
            element={
              <Suspense fallback={<PageLoader page="admin" />}>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <Consimtamant/>
                  </Suspense>
                </AdminLayout>
              </Suspense>
            }
          />

          {/* GDPR Management */}
          <Route
            path="/admin/gdpr"
            element={
              <Suspense fallback={<PageLoader page="admin" />}>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <GdprTable />
                  </Suspense>
                </AdminLayout>
              </Suspense>
            }
          />

          {/* Workouts page */}
          <Route
            path="/admin/traininghub/workouts"
            element={
              <Suspense fallback={<PageLoader page="training" />}>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <Workouts />
                  </Suspense>
                </AdminLayout>
              </Suspense>
            }
          />

          {/* Plans page */}
          <Route
            path="/admin/traininghub/plans"
            element={
              <Suspense fallback={<PageLoader page="training" />}>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <Plans />
                  </Suspense>
                </AdminLayout>
              </Suspense>
            }
          />

          {/* Plans Edit Mode */}
          <Route
            path="/admin/traininghub/edit-plan/:planId"
            element={
              <Suspense fallback={<PageLoader page="training" />}>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <Plans />
                  </Suspense>
                </AdminLayout>
              </Suspense>
            }
          />

          {/* Workout Builder (create new) */}
          <Route
            path="/admin/traininghub/create-workout"
            element={
              <Suspense fallback={<PageLoader page="training" />}>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <WorkoutBuilder />
                  </Suspense>
                </AdminLayout>
              </Suspense>
            }
          />

          {/* Workout Builder (edit mode) */}
          <Route
            path="/admin/traininghub/edit-workout/:id"
            element={
              <Suspense fallback={<PageLoader page="training" />}>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <WorkoutBuilder />
                  </Suspense>
                </AdminLayout>
              </Suspense>
            }
          />

          {/* Time Recorder Page */}
          <Route
            path="/admin/traininghub/session/:sessionId/times"
            element={
              <Suspense fallback={<PageLoader page="training" />}>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <TimeRecorder />
                  </Suspense>
                </AdminLayout>
              </Suspense>
            }
          />

          {/* Live Workout Session */}
          <Route
            path="/admin/traininghub/session/:sessionId/live"
            element={
              <Suspense fallback={<PageLoader page="admin" />}>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <LiveWorkout />
                  </Suspense>
                </AdminLayout>
              </Suspense>
            }
          />

          {/* Workout Preview */}
          <Route 
            path="/admin/traininghub/workouts/:id/preview" 
            element={
              <Suspense fallback={<PageLoader page="training" />}>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <WorkoutPreview />
                  </Suspense>
                </AdminLayout>
              </Suspense>
            }
          />

          {/* Advanced Swimmers Details */}
          <Route
            path="/admin/advanced-swimmers/:id/details"
            element={
              <Suspense fallback={<PageLoader page="admin" />}>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <ViewAdvancedSwimmer />
                  </Suspense>
                </AdminLayout>
              </Suspense>
            }
          />

          {/* Create Advanced Swimmer */}
          <Route
            path="/admin/advanced-swimmers/create"
            element={
              <Suspense fallback={<PageLoader page="admin" />}>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <CreateAdvancedSwimmer />
                  </Suspense>
                </AdminLayout>
              </Suspense>
            }
          />

          {/* Advanced Swimmers List */}
          <Route
            path="/admin/advanced-swimmers"
            element={
              <Suspense fallback={<PageLoader page="admin" />}>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <AdvancedSwimmers />
                  </Suspense>
                </AdminLayout>
              </Suspense>
            }
          />

          {/* Groups Management */}
          <Route
            path="/admin/groups"
            element={
              <Suspense fallback={<PageLoader page="admin" />}>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <GroupsManagement />
                  </Suspense>
                </AdminLayout>
              </Suspense>
            }
          />

          {/* Swimming Times Management */}
          <Route
            path="/admin/swimming-times"
            element={
              <Suspense fallback={<PageLoader page="admin" />}>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <SwimmingTimes />
                  </Suspense>
                </AdminLayout>
              </Suspense>
            }
          />

          {/* Swimming Times Details for specific cursant */}
          <Route
            path="/admin/swimming-times/cursant/:cursantId/details"
            element={
              <Suspense fallback={<PageLoader page="admin" />}>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <CursantTimesDetails />
                  </Suspense>
                </AdminLayout>
              </Suspense>
            }
          />

          {/* Create Swimming Times */}
          <Route
            path="/admin/swimming-times/create"
            element={
              <Suspense fallback={<PageLoader page="admin" />}>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <CreateSwimmingTimes />
                  </Suspense>
                </AdminLayout>
              </Suspense>
            }
          />

          {/* Swimming Times Statistics for specific cursant */}
          <Route
            path="/admin/swimming-times/cursant/:cursantId/statistics"
            element={
              <Suspense fallback={<PageLoader page="admin" />}>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <CursantTimesDetails />
                  </Suspense>
                </AdminLayout>
              </Suspense>
            }
          />
          
          {/* System Info */}
          <Route
            path="/admin/system"
            element={
              <Suspense fallback={<PageLoader page="admin" />}>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <SystemInfo />
                  </Suspense>
                </AdminLayout>
              </Suspense>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;