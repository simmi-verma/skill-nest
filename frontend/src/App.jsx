import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Styling resets and components
import './styles/theme.css';
import './styles/global.css';
import './styles/components.css';

// Components
import Navbar from './components/Navbar';

// Pages
import LandingPage from './pages/LandingPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import AuthPage from './pages/AuthPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {/* Header Navigation */}
          <Navbar />
          
          {/* Main content body pages */}
          <main style={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:id" element={<CourseDetailsPage />} />
              
              {/* Authentications */}
              <Route path="/login" element={<AuthPage defaultIsLogin={true} />} />
              <Route path="/register" element={<AuthPage defaultIsLogin={false} />} />
              
              {/* Dashboards */}
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              
              {/* Fallback routes redirection */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Minimalist Footer */}
          <footer style={{ 
            padding: '24px 0', 
            background: 'var(--bg-secondary)', 
            borderTop: '1px solid var(--border-color)', 
            textAlign: 'center', 
            fontSize: '13px', 
            color: 'var(--text-muted)' 
          }}>
            <div className="container">
              <p>&copy; {new Date().getFullYear()} SkillNest Fictional Startup. Developed as a MERN application showcase. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
