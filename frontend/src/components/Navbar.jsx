import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="url(#logo-grad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <defs>
              <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <span className="gradient-text">SkillNest</span>
        </Link>

        {/* Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/courses" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                Courses
              </NavLink>
            </li>
            {user && (
              <li>
                <NavLink
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                >
                  {user.role === 'admin' ? 'Admin Panel' : 'My Learning'}
                </NavLink>
              </li>
            )}
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {user ? (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{user.name}</span>
                  <span style={{ 
                    fontSize: '10px', 
                    color: user.role === 'admin' ? '#f43f5e' : '#60a5fa', 
                    fontWeight: '800', 
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    {user.role}
                  </span>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link" style={{ fontSize: '14px', fontWeight: '600' }}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px' }}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
