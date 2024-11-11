import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/navbar.css';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
} from 'mdb-react-ui-kit';


const Navbar = () => {
  const [openBasic, setOpenBasic] = useState(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <MDBNavbar expand='lg' light bgColor='light' className="navbar">
      <MDBContainer fluid>
        {/* <MDBNavbarBrand href='/'>Event Manager</MDBNavbarBrand> */}

        <MDBNavbarToggler
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
          onClick={() => setOpenBasic(!openBasic)}
        >
          <MDBIcon icon='bars' fas />
        </MDBNavbarToggler>

        <MDBCollapse navbar show={openBasic}>
          <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
            <MDBNavbarItem>
              <MDBNavbarLink tag={Link} to="/" aria-current='page' className="navbar-link">
                Home
              </MDBNavbarLink>
            </MDBNavbarItem>

            {user && (
              <>
                <MDBNavbarItem>
                  <MDBNavbarLink tag={Link} to="/create-event" className="navbar-link">
                    Create Event
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                <MDBNavbarLink tag={Link} to="/event-details" className="navbar-link">
                    Event Details
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink tag={Link} to="/calendar" className="navbar-link">
                    Calendar
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink tag={Link} to="/profile" className="navbar-link">
                    Profile
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink onClick={handleLogout} className="navbar-link">
                    Logout
                  </MDBNavbarLink>
                </MDBNavbarItem>
              </>
            )}
            {!user && (
              <MDBNavbarItem>
                <MDBNavbarLink tag={Link} to="/login" className="navbar-link">
                  Login
                </MDBNavbarLink>
              </MDBNavbarItem>
            )}
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
};

export default Navbar;
