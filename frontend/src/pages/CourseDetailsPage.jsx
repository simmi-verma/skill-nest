import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, API_BASE_URL } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Fetch course details & check enrollment status
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        // 1. Fetch course details
        const res = await fetch(`${API_BASE_URL}/courses/${id}`);
        const data = await res.json();
        
        if (res.ok && data.success) {
          setCourse(data.data);
        } else {
          setMessage({ text: 'Course not found', type: 'error' });
          return;
        }

        // 2. Fetch enrollment status if logged in
        if (user && token) {
          const enrollRes = await fetch(`${API_BASE_URL}/enrollments/my-courses`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const enrollData = await enrollRes.json();
          if (enrollRes.ok && enrollData.success) {
            const match = enrollData.data.some((e) => e.course._id === id);
            setIsEnrolled(match);
          }
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        setMessage({ text: 'Error connecting to the backend API', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, user, token, API_BASE_URL]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }

    setEnrollLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch(`${API_BASE_URL}/enrollments/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsEnrolled(true);
        setMessage({ text: 'Enrollment successful! Access your workspace dashboard.', type: 'success' });
      } else {
        setMessage({ text: data.message || 'Enrollment failed', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Network connection failure. Try again.', type: 'error' });
    } finally {
      setEnrollLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ marginTop: '70px', minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }}></span>
          <p>Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ marginTop: '70px', padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '32px', fontWeight: '800' }}>Course Details Missing</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '16px 0 32px 0' }}>We could not find the course you are looking for.</p>
          <Link to="/courses" className="btn btn-primary">Back to Catalog</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '70px', paddingBottom: '100px' }}>
      {/* Hero Banner Area */}
      <div style={{ 
        padding: '60px 0', 
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '48px', alignItems: 'center' }}>
          <div>
            <span className="course-card-tag tag-blue" style={{ fontSize: '13px', padding: '6px 14px' }}>
              {course.category}
            </span>
            <h1 style={{ fontSize: '42px', fontWeight: '800', lineHeight: '1.2', margin: '16px 0' }}>
              {course.title}
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              {course.description}
            </p>
            
            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Mentor</span>
                <span style={{ fontWeight: '600' }}>{course.instructor}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Level</span>
                <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{course.level}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Duration</span>
                <span style={{ fontWeight: '600' }}>{course.duration}</span>
              </div>
            </div>
          </div>

          {/* Banner Image */}
          <div className="glass-panel" style={{ borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', height: '200px' }}>
            <img src={course.image} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="container" style={{ marginTop: '50px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: '48px' }}>
        {/* Left Side: About & Syllabus */}
        <div>
          {/* About Section */}
          <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '16px' }}>About This Workshop</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.7' }}>
              In this intensive short program, you will gain hands-on training with the actual techniques used in contemporary startup fields. The curriculum focuses entirely on building practical assets and completing projects, rather than just abstract reading. By graduation, you will be equipped with solid skills, portfolio files, and a digital micro-credential badge.
            </p>
          </div>

          {/* Curriculum Section */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>Course Syllabus</h2>
            {course.syllabus && course.syllabus.length > 0 ? (
              <ul style={{ listStyle: 'none' }}>
                {course.syllabus.map((item, idx) => (
                  <li key={idx} style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '16px', 
                    padding: '16px 0', 
                    borderBottom: idx === course.syllabus.length - 1 ? 'none' : '1px solid var(--border-color)' 
                  }}>
                    <span style={{ 
                      background: 'var(--primary-glow)', 
                      color: 'var(--primary)', 
                      width: '28px', 
                      height: '28px', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justify: 'center',
                      fontWeight: '700',
                      fontSize: '13px',
                      flexShrink: '0'
                    }}>
                      {idx + 1}
                    </span>
                    <span style={{ fontSize: '15px', color: 'var(--text-primary)', paddingTop: '2px' }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>Syllabus checklist is currently updating.</p>
            )}
          </div>
        </div>

        {/* Right Side: Enroll CTA Sidecard */}
        <div>
          <div className="glass-panel" style={{ padding: '32px', position: 'sticky', top: '100px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', uppercase: 'true' }}>WORKSHOP INVESTMENT</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '8px 0 24px 0' }}>
              <span style={{ fontSize: '36px', fontWeight: '800', color: 'var(--success)' }}>${course.price}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>one-time payment</span>
            </div>

            {/* Notification messages */}
            {message.text && (
              <div style={{ 
                padding: '12px 16px', 
                borderRadius: 'var(--border-radius-md)', 
                marginBottom: '20px',
                fontSize: '14px',
                background: message.type === 'success' ? 'var(--success-glow)' : 'rgba(239, 68, 68, 0.15)',
                color: message.type === 'success' ? '#34d399' : '#f87171',
                border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
              }}>
                {message.text}
              </div>
            )}

            {/* CTA action */}
            {isEnrolled ? (
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--success)', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  Already Enrolled
                </p>
                <Link to="/dashboard" className="btn btn-secondary" style={{ width: '100%' }}>
                  Go to My Dashboard
                </Link>
              </div>
            ) : (
              <button 
                onClick={handleEnroll} 
                disabled={enrollLoading}
                className="btn btn-primary" 
                style={{ width: '100%', padding: '14px' }}
              >
                {enrollLoading ? 'Processing...' : (user ? 'Enroll Now' : 'Login to Enroll')}
              </button>
            )}

            {/* Sidecard Features list */}
            <div style={{ marginTop: '32px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  <span>Lifetime access to curriculum content</span>
                </li>
                <li style={{ display: 'flex', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span>Certificate and LinkedIn verification badge</span>
                </li>
                <li style={{ display: 'flex', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <span>1-on-1 Q&A support channel with Mentor</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
