import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [loading, setLoading] = useState(true);

  const { API_BASE_URL } = useContext(AuthContext);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // Build query string
        let url = `${API_BASE_URL}/courses?`;
        if (search) url += `search=${encodeURIComponent(search)}&`;
        if (category) url += `category=${encodeURIComponent(category)}&`;
        if (level) url += `level=${encodeURIComponent(level)}&`;

        const response = await fetch(url);
        const data = await response.json();
        
        if (response.ok && data.success) {
          setCourses(data.data);
        }
      } catch (error) {
        console.error('Error fetching courses list:', error);
      } finally {
        setLoading(false);
      }
    };

    // Simple debounce/delay for search inputs
    const delayDebounce = setTimeout(() => {
      fetchCourses();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, category, level, API_BASE_URL]);

  return (
    <div style={{ marginTop: '70px', paddingBottom: '80px' }}>
      {/* Page Header */}
      <section style={{ 
        padding: '60px 0 40px 0', 
        background: 'var(--dashboard-header-bg)',
        borderBottom: '1px solid var(--border-color)' 
      }}>
        <div className="container">
          <h1 style={{ fontSize: '40px', fontWeight: '800' }}>Explore Courses & Workshops</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            Elevate your skill set with our short-term workshops led by professional mentors.
          </p>
        </div>
      </section>

      {/* Filter / Search Bar */}
      <div className="container" style={{ marginTop: '40px' }}>
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '40px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 1fr 1fr', 
            gap: '16px', 
            alignItems: 'center' 
          }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search by title, description or instructor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="var(--text-muted)" 
                strokeWidth="2.5"
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
              >
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>

            {/* Category Dropdown */}
            <div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-input"
                style={{ background: 'rgba(255,255,255,0.03)', appearance: 'none', cursor: 'pointer' }}
              >
                <option value="">All Categories</option>
                <option value="Programming">Programming</option>
                <option value="Design">Design</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            {/* Skill Level Dropdown */}
            <div>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="form-input"
                style={{ background: 'rgba(255,255,255,0.03)', appearance: 'none', cursor: 'pointer' }}
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }}></span>
            <p>Loading course listing...</p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : (
          /* Course Grid */
          <div>
            {courses.length > 0 ? (
              <div className="grid-3">
                {courses.map((course) => (
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

                      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                        <Link to={`/courses/${course._id}`} className="btn btn-primary" style={{ flexGrow: 1 }}>
                          View Curriculum
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '80px 0', border: '1px dashed var(--border-color)', borderRadius: 'var(--border-radius-lg)', background: 'rgba(255, 255, 255, 0.01)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ marginBottom: '16px' }}><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                <h3 style={{ fontSize: '18px', fontWeight: '700' }}>No workshops match your criteria</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px' }}>
                  Try resetting filters or checking your spelling.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
