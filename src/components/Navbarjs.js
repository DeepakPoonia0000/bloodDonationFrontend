import React, { useEffect, useState, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logo from './images/iinsaf.png';
import logo2 from '../images/favicon.png';

const Navbarjs = ({ setToken, setsignup }) => {
  const navigate = useNavigate();
  const [token, settoken] = useState('');
  const [htoken, sethtoken] = useState('');
  const [atoken, setatoken] = useState('');
  const [navbarExpanded, setNavbarExpanded] = useState(false);
  const navbarRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const htoken = localStorage.getItem('htoken');
    const atoken = localStorage.getItem('adminToken');
    settoken(token);
    sethtoken(htoken);
    setatoken(atoken);
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('htoken');
    localStorage.removeItem('adminToken');
    setToken('');
    navigate('/loginsignup');
  };

  const handleSignup = () => {
    setsignup(true);
    navigate('/loginsignup');
  };

  const handellogin = () => {
    setsignup(false);
    navigate('/loginsignup');
  };

  // Close navbar on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (navbarExpanded && navbarRef.current && !navbarRef.current.contains(event.target)) {
        setNavbarExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [navbarExpanded]);

  return (
    <Navbar
      expand="lg"
      className={`bg-body-tertiary position-sticky top-0 border z-20 font-montserrat lg:text-lg transition-all duration-300 ease-in-out ${navbarExpanded ? 'h-94' : 'h-20'}`}
      expanded={navbarExpanded}
    >
      <Container fluid style={{ paddingLeft: '0px', paddingRight: '0px' }}>
        <Navbar.Brand as={Link} to="/" className="flex-grow-1 flex ml-4">
          <img style={{ height: '40px' }} src={logo} alt="logo" />
          <img style={{ height: '40px' }} src={logo2} alt="logo" />
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="navbarScroll"
          onClick={() => setNavbarExpanded(!navbarExpanded)}
          className="mr-4"
        />
        <Navbar.Collapse id="navbarScroll" className={navbarExpanded ? 'p-0' : 'px-4'}>
          <Nav
            className={`ms-auto my-2 my-lg-0 w-100 transition-all duration-300 ease-in-out justify-content-end ${navbarExpanded ? 'mt-4' : 'mt-0'}`}
            style={{ maxHeight: '400px' }}
            navbarScroll
          >
            {htoken ? (
              <>
                <Nav.Link as={Link} to="/hospitaldashboard" className={navbarExpanded ? 'mt-3' : ''} onClick={() => setNavbarExpanded(false)}>
                  Dashboard
                </Nav.Link>
                <button
                  className={`bg-indigo-500 px-5 text-white rounded-3xl transition duration-300 hover:bg-indigo-600 ${navbarExpanded ? 'mt-3 h-10' : ''}`}
                  onClick={() => {
                    handleLogout();
                    setNavbarExpanded(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : atoken ? (
              <>
                <Nav.Link as={Link} to="/home" className={navbarExpanded ? 'mt-3' : ''} onClick={() => setNavbarExpanded(false)}>
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/eventsadmin" className={navbarExpanded ? 'mt-3' : ''} onClick={() => setNavbarExpanded(false)}>
                  Events
                </Nav.Link>
                <Nav.Link as={Link} to="/admin" className={navbarExpanded ? 'mt-3' : ''} onClick={() => setNavbarExpanded(false)}>
                  Admin Home
                </Nav.Link>
                <Nav.Link as={Link} to="/manageUsers" className={navbarExpanded ? 'mt-3' : ''} onClick={() => setNavbarExpanded(false)}>
                  Manage-Users
                </Nav.Link>
                <Nav.Link as={Link} to="/adminimageupload" className={navbarExpanded ? 'mt-3' : ''} onClick={() => setNavbarExpanded(false)}>
                  Images
                </Nav.Link>
                                <button
                  className={`bg-indigo-500 px-5 text-white rounded-3xl transition duration-300 hover:bg-indigo-600 ${navbarExpanded ? 'mt-3 h-10' : ''}`}
                  onClick={() => {
                    handleLogout();
                    setNavbarExpanded(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : token ? (
              <>
                <Nav.Link as={Link} to="/bloodRequirement" className={navbarExpanded ? 'mt-3 h-10' : ''} onClick={() => setNavbarExpanded(false)}>
                  Blood / Camps Request
                </Nav.Link>
                <Nav.Link as={Link} to="/home" className={navbarExpanded ? 'mt-3 h-10' : ''} onClick={() => setNavbarExpanded(false)}>
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/about" className={navbarExpanded ? 'mt-3 h-10' : ''} onClick={() => setNavbarExpanded(false)}>
                  About
                </Nav.Link>
                <Nav.Link as={Link} to="/userprofile" className={navbarExpanded ? 'mt-3 h-10' : ''} onClick={() => setNavbarExpanded(false)}>
                  Profile
                </Nav.Link>
                <button
                  className={`bg-indigo-500 px-5 text-white rounded-3xl transition duration-300 hover:bg-indigo-600 ${navbarExpanded ? 'mt-3 h-10' : ''}`}
                  onClick={() => {
                    handleLogout();
                    setNavbarExpanded(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/" className={navbarExpanded ? 'mt-3' : ''} onClick={() => setNavbarExpanded(false)}>
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/loginsignup" className={navbarExpanded ? 'mt-3' : ''} onClick={() => setNavbarExpanded(false)}>
                  Emergency Blood Request
                </Nav.Link>
                <Nav.Link as={Link} to="#" className={navbarExpanded ? 'mt-3' : ''} onClick={() => setNavbarExpanded(false)}>
                  Volunteer Vechile
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/hospitalLoginSignup"
                  className={`bg-indigo-500 px-5 text-white rounded-3xl transition duration-300 hover:bg-indigo-600 mr-1 ${navbarExpanded ? 'mt-3' : ''}`}
                  onClick={() => setNavbarExpanded(false)}
                >
                  Hospital / Organization
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/loginsignup"
                  className={`bg-indigo-500 px-5 text-white rounded-3xl transition duration-300 hover:bg-indigo-600 ${navbarExpanded ? 'mt-3' : ''}`}
                  onClick={() => {
                    handellogin();
                    setNavbarExpanded(false);
                  }}
                >
                  Login
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/loginsignup"
                  className={`bg-red-500 px-4 ml-1 text-white rounded-3xl transition duration-300 hover:bg-red-600 ${navbarExpanded ? 'mt-3' : ''}`}
                  onClick={() => {
                    handleSignup();
                    setNavbarExpanded(false);
                  }}
                >
                  Register As a Donor
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navbarjs;
