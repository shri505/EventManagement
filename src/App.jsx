import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EventDetailsPage from './pages/EventDetailsPage';
import EventCreationPage from './pages/EventCreationPage';
import LoginPage from './pages/LoginPage';
import CalendarPage from './pages/CalendarPage';
import AboutPage from './pages/AboutPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

function AppContent() {
  const [user] = useAuthState(auth);
  const location = useLocation();

  return (
    <>
      {/* Show Navbar only if user is logged in and not on the login page */}
      {user && location.pathname !== "/login" && <Navbar />}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <AboutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-event"
          element={
            <ProtectedRoute>
              <EventCreationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/event-details"
          element={
            <ProtectedRoute>
              <EventDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
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
