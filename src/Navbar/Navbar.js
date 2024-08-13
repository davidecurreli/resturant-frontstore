import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../UserContext';
import './Navbar.css';

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const location = useLocation();

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({ firstName, lastName, email, phone });
    localStorage.setItem('user', JSON.stringify({ firstName, lastName, email, phone }));
    setShowModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
            <Link to="/" className="navbar-logo">H-Ey Demo Restaurant</Link>
            <div className="navbar-links">
            {user ? (
                <div className="user-info">
                <span>Hi {user.firstName}, {user.lastName}</span>
                <button onClick={handleLogout} className="navbar-button">Log Out</button>
                </div>
            ) : (
                <button onClick={() => setShowModal(true)} className="navbar-button">Log In</button>
            )}
            {location.pathname === '/about' ? (
                <Link to="/" className="navbar-button">Home</Link>
            ) : (
                <Link to="/about" className="navbar-button">About Us</Link>
            )}
            
            </div>
        </div>
      </nav>

      {showModal && (
        <div className="nav-modal-overlay">
          <div className="nav-modal-content">
            <h2>Log In</h2>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="phone"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <button style={{'marginLeft' : '0px'}} type="submit" className="navbar-button">Submit</button>
            </form>
            <button onClick={() => setShowModal(false)} className="close-button">&times;</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;