import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const StudentDashboard = () => {
  const { user, token, API_BASE_URL } = useContext(AuthContext);
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect non-students
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchMyCourses = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/enrollments/my-courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        
        if (res.ok && data.success) {
          setEnrollments(data.data);
        } else {
          setError(data.message || 'Failed to fetch enrolled courses.');
        }
      } catch (err) {
        console.error('Error fetching dashboard enrollments:', err);
        setError('Database connection error. Ensure the MERN server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [token, API_BASE_URL]);

  if (loading) {
    return (
      <div style={{ marginTop: '70px', minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }}></span>
          <p>Opening Student Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '70px', paddingBottom: '100px' }}>
      {/* Dashboard Top Area */}
      <section style={{ 
        padding: '50px 0 30px 0', 
        background: 'var(--dashboard-header-bg)',
        borderBottom: '1px solid var(--border-color)' 
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ color: 'var(--primary)', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                STUDENT CONSOLE
              </span>
              <h1 style={{ fontSize: '36px', fontWeight: '800', marginTop: '6px' }}>
                Welcome back, {user?.name}!
              </h1>
              <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                Track your active workshop schedules and progress metrics below.
              </p>
            </div>
            <Link to="/courses" className="btn btn-primary">
              Enroll in New Course
            </Link>
          </div>
        </div>
      </section>

      {/* Main Stats Summary */}
      <div className="container" style={{ marginTop: '40px' }}>
        <div className="stats-grid">
          <div className="glass-panel stat-card">
            <span className="stat-card-title">Enrolled Programs</span>
            <span className="stat-card-value">{enrollments.length}</span>
          </div>
          <div className="glass-panel stat-card">
            <span className="stat-card-title">Completed Programs</span>
            <span className="stat-card-value">
              {enrollments.filter((e) => e.status === 'completed').length}
            </span>
          </div>
          <div className="glass-panel stat-card">
            <span className="stat-card-title">Total Hours Completed</span>
            <span className="stat-card-value">
              {enrollments.filter((e) => e.status === 'completed').length * 12} hrs
            </span>
          </div>
          <div className="glass-panel stat-card">
            <span className="stat-card-title">Digital Certifications</span>
            <span className="stat-card-value">
              {enrollments.filter((e) => e.status === 'completed').length}
            </span>
          </div>
        </div>

        {/* Display Error Message */}
        {error && (
          <div style={{ 
            padding: '16px', 
            background: 'rgba(239, 68, 68, 0.12)', 
            border: '1px solid rgba(239, 68, 68, 0.25)', 
            borderRadius: 'var(--border-radius-md)', 
            color: '#f87171', 
            marginBottom: '32px' 
          }}>
            {error}
          </div>
        )}

        {/* Enrolled Courses Grid */}
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>My Active Workshops</h2>
        
        {enrollments.length > 0 ? (
          <div className="grid-3">
            {enrollments.map((enrollment) => {
              const { course } = enrollment;
              if (!course) return null; // Avoid crashing on orphaned DB keys
              return (
                <div key={enrollment._id} className="glass-panel glow-hover course-card">
                  <div className="course-card-image-wrapper" style={{ height: '160px' }}>
                    <img src={course.image} alt={course.title} className="course-card-image" />
                  </div>
                  <div className="course-card-content" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span className="course-card-tag tag-blue">{course.category}</span>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: '700', 
                        textTransform: 'uppercase', 
                        padding: '3px 8px', 
                        borderRadius: '4px',
                        background: enrollment.status === 'enrolled' ? 'var(--primary-glow)' : 'var(--success-glow)',
                        color: enrollment.status === 'enrolled' ? '#60a5fa' : '#34d399'
                      }}>
                        {enrollment.status}
                      </span>
                    </div>

                    <h3 className="course-card-title" style={{ fontSize: '18px', marginBottom: '8px' }}>
                      {course.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                      Led by: <strong>{course.instructor}</strong>
                    </p>

                    <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                      <Link to={`/courses/${course._id}`} className="btn btn-secondary" style={{ flexGrow: 1, padding: '8px' }}>
                        Course Page
                      </Link>
                      <button 
                        onClick={() => alert('Launching Virtual Classroom environment... Ready!')}
                        className="btn btn-primary" 
                        style={{ flexGrow: 1, padding: '8px' }}
                      >
                        Enter Classroom
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 0', 
            border: '2px dashed var(--border-color)', 
            borderRadius: 'var(--border-radius-lg)', 
            background: 'rgba(255, 255, 255, 0.01)' 
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ marginBottom: '16px' }}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z"/></svg>
            <h3 style={{ fontSize: '20px', fontWeight: '700' }}>You haven't registered in any workshops yet</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px', marginBottom: '24px' }}>
              Explore our current short courses catalog to start your learning journey.
            </p>
            <Link to="/courses" className="btn btn-primary">
              Browse Workshops catalog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
