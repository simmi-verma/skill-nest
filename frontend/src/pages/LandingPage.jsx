import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LandingPage = () => {
  const [courses, setCourses] = useState([]);
  const { API_BASE_URL } = useContext(AuthContext);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/courses`);
        const data = await response.json();
        if (response.ok && data.success) {
          // Grab top 3 courses for landing showcase
          setCourses(data.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching trending courses:', error);
      }
    };
    fetchFeaturedCourses();
  }, [API_BASE_URL]);

  return (
    <div style={{ marginTop: '70px' }}>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        padding: '120px 0 100px 0',
        background: 'radial-gradient(circle at top right, rgba(139, 92, 246, 0.08), transparent 40%), radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.05), transparent 45%)'
      }}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: '2' }}>
          <span style={{ 
            background: 'var(--primary-glow)', 
            color: '#60a5fa', 
            padding: '6px 16px', 
            borderRadius: '30px', 
            fontSize: '13px', 
            fontWeight: '700', 
            textTransform: 'uppercase', 
            letterSpacing: '1.5px',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            🎓 Empowering Student Careers
          </span>
          <h1 style={{ 
            fontSize: '56px', 
            fontWeight: '800', 
            lineHeight: '1.15', 
            marginTop: '24px', 
            marginBottom: '20px',
            letterSpacing: '-1px'
          }}>
            Discover & Learn Short Courses <br />
            <span className="gradient-text">That Matter.</span>
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: 'var(--text-secondary)', 
            maxWidth: '640px', 
            margin: '0 auto 40px auto',
            lineHeight: '1.6'
          }}>
            SkillNest links you with professional mentors and provides short, high-impact workshops in programming, design, marketing, and computer science.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <Link to="/courses" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '15px' }}>
              Explore Courses
            </Link>
            <a href="#features" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '15px' }}>
              Why SkillNest?
            </a>
          </div>
        </div>
      </section>

      {/* Stats Widgets */}
      <section style={{ padding: '40px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.01)' }}>
        <div className="container">
          <div className="stats-grid" style={{ margin: '0' }}>
            <div className="stat-card glass-panel flex-center" style={{ textAlign: 'center', padding: '20px' }}>
              <span className="stat-card-value gradient-text">15,000+</span>
              <span className="stat-card-title">Enrolled Students</span>
            </div>
            <div className="stat-card glass-panel flex-center" style={{ textAlign: 'center', padding: '20px' }}>
              <span className="stat-card-value gradient-text">45+</span>
              <span className="stat-card-title">Expert Mentors</span>
            </div>
            <div className="stat-card glass-panel flex-center" style={{ textAlign: 'center', padding: '20px' }}>
              <span className="stat-card-value gradient-text">98.4%</span>
              <span className="stat-card-title">Satisfaction Rate</span>
            </div>
            <div className="stat-card glass-panel flex-center" style={{ textAlign: 'center', padding: '20px' }}>
              <span className="stat-card-value gradient-text">100%</span>
              <span className="stat-card-title">Practical Curriculum</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="features" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '800' }}>Why Learn With Us?</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>Our courses are tailor-made for fast learning curves and real-world execution.</p>
          </div>

          <div className="grid-3">
            <div className="glass-panel glow-hover" style={{ padding: '32px' }}>
              <div style={{ background: 'var(--primary-glow)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Student-First Design</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Curriculum structure formatted specifically for students to balance alongside university coursework.</p>
            </div>

            <div className="glass-panel glow-hover" style={{ padding: '32px' }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.15)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Industry Mentors</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Learn direct from active professionals and startup developers who know current stack requirements.</p>
            </div>

            <div className="glass-panel glow-hover" style={{ padding: '32px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><circle cx="12" cy="8" r="7"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/></svg>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Accredited Badge</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Receive micro-credentials, shareable badges, and certificate verification links upon graduation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses / Workshops */}
      <section>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px' }}>
            <div>
              <h2 style={{ fontSize: '36px', fontWeight: '800' }}>Trending Workshops</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>Check out our most popular fast-track learning routes starting soon.</p>
            </div>
            <Link to="/courses" className="btn btn-outline">
              See All Courses
            </Link>
          </div>

          <div className="grid-3">
            {courses.length > 0 ? (
              courses.map((course) => (
                <div key={course._id} className="glass-panel glow-hover course-card">
                  <div className="course-card-image-wrapper">
                    <img src={course.image} alt={course.title} className="course-card-image" />
                  </div>
                  <div className="course-card-content">
                    <span className="course-card-tag tag-blue">{course.category}</span>
                    <h3 className="course-card-title">{course.title}</h3>
                    <p className="course-card-desc">{course.description}</p>
                    <div className="course-card-footer">
                      <div className="course-card-meta">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <span>{course.duration}</span>
                        <span style={{ margin: '0 4px' }}>•</span>
                        <span>{course.level}</span>
                      </div>
                      <span className="course-card-price">${course.price}</span>
                    </div>
                    <Link to={`/courses/${course._id}`} className="btn btn-secondary" style={{ marginTop: '20px', width: '100%' }}>
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)', gridColumn: '1 / -1', textAlign: 'center' }}>
                No active courses available right now. Seed the database to view.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
