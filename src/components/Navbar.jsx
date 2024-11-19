import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/navbar.css';

const Navbar = () => {
  const [openBasic, setOpenBasic] = useState(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login'); // Redirect to login after logout
  };

  // Mobile menu toggle logic
  const toggleMobileMenu = () => {
    setOpenBasic(!openBasic);
  };

  const closeMobileMenu = () => {
    setOpenBasic(false);
  };

  return (
    <nav className="header">
      <div className="navbar">
        <Link to="/" className="nav-logo">
          EventManager
        </Link>

        <div
          className={`hamburger ${openBasic ? 'active' : ''}`}
          onClick={toggleMobileMenu}
        >
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        <ul className={`nav-menu ${openBasic ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={closeMobileMenu}>
              Home
            </Link>
          </li>

          {user && (
            <>
              <li className="nav-item">
                <Link to="/create-event" className="nav-link" onClick={closeMobileMenu}>
                  Create Event
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/event-details" className="nav-link" onClick={closeMobileMenu}>
                  Event Details
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/calendar" className="nav-link" onClick={closeMobileMenu}>
                  Calendar
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-link" onClick={closeMobileMenu}>
                  About
                </Link>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link"
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          )}

          {!user && (
            <li className="nav-item">
              <Link to="/login" className="nav-link" onClick={closeMobileMenu}>
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
