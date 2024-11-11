// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EventDetailsPage from './pages/EventDetailsPage';
import EventCreationPage from './pages/EventCreationPage';
import UserProfilePage from './pages/UserProfilePage';
import LoginPage from './pages/LoginPage';
import CalendarPage from './pages/CalendarPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

function App() {
  const [user] = useAuthState(auth);

  return (
    <Router>
      {/* Render Navbar only if the user is logged in */}
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfilePage />
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
    </Router>
  );
}

export default App;
