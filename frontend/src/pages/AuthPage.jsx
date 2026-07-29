import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AuthPage = ({ defaultIsLogin = true }) => {
  const { login, register, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(defaultIsLogin);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Allow local test choice
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync state if prop changes
  useEffect(() => {
    setIsLogin(defaultIsLogin);
  }, [defaultIsLogin]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const destination = location.state?.from || (user.role === 'admin' ? '/admin' : '/dashboard');
      navigate(destination, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password || (!isLogin && !name)) {
      setErrorMsg('Please complete all required input fields');
      return;
    }

    setLoading(true);

    if (isLogin) {
      const result = await login(email, password);
      if (!result.success) {
        setErrorMsg(result.message || 'Incorrect email address or password combination.');
        setLoading(false);
      }
    } else {
      const result = await register(name, email, password, role);
      if (!result.success) {
        setErrorMsg(result.message || 'Registration failed. Email might already exist.');
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ 
      marginTop: '70px', 
      minHeight: 'calc(100vh - 70px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.05), transparent 60%)',
      padding: '40px 24px'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '40px' }}>
        {/* Toggle Headers */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <button 
            onClick={() => { setIsLogin(true); setErrorMsg(''); }}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: isLogin ? 'var(--text-primary)' : 'var(--text-muted)', 
              fontSize: '20px', 
              fontWeight: '700', 
              cursor: 'pointer',
              position: 'relative',
              paddingBottom: '8px'
            }}
          >
            Sign In
            {isLogin && <span style={{ position: 'absolute', bottom: '-13px', left: 0, right: 0, height: '2px', background: 'var(--primary)' }}></span>}
          </button>
          <button 
            onClick={() => { setIsLogin(false); setErrorMsg(''); }}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: !isLogin ? 'var(--text-primary)' : 'var(--text-muted)', 
              fontSize: '20px', 
              fontWeight: '700', 
              cursor: 'pointer',
              position: 'relative',
              paddingBottom: '8px'
            }}
          >
            Create Account
            {!isLogin && <span style={{ position: 'absolute', bottom: '-13px', left: 0, right: 0, height: '2px', background: 'var(--primary)' }}></span>}
          </button>
        </div>

        {/* Error Callout */}
        {errorMsg && (
          <div style={{ 
            padding: '12px 16px', 
            background: 'rgba(239, 68, 68, 0.12)', 
            border: '1px solid rgba(239, 68, 68, 0.25)', 
            borderRadius: 'var(--border-radius-md)', 
            color: '#f87171', 
            fontSize: '14px', 
            marginBottom: '24px' 
          }}>
            {errorMsg}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit}>
          {/* Name Field (Register only) */}
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
              />
            </div>
          )}

          {/* Email Field */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="e.g. name@student.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              minLength="6"
            />
          </div>

          {/* Role Choice Field (Register only) */}
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Account Role type</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-input"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <option value="student">Student Portal Access</option>
                <option value="admin">Instructor / Admin Portal Access</option>
              </select>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary" 
            style={{ width: '100%', padding: '12px', marginTop: '12px' }}
          >
            {loading ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {/* Auth Subtext Helper */}
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
          {isLogin ? (
            <p>
              New to SkillNest?{' '}
              <button 
                onClick={() => setIsLogin(false)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}
              >
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button 
                onClick={() => setIsLogin(true)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
