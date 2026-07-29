import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, token, API_BASE_URL } = useContext(AuthContext);
  const navigate = useNavigate();

  // State arrays
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null); // Null for create, course object for edit

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('Programming');
  const [formInstructor, setFormInstructor] = useState('');
  const [formPrice, setFormPrice] = useState(0);
  const [formDuration, setFormDuration] = useState('4 Weeks');
  const [formLevel, setFormLevel] = useState('Beginner');
  const [formImage, setFormImage] = useState('');
  const [formSyllabus, setFormSyllabus] = useState('');

  // Redirect non-admins
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Fetch admin stats and details
  const fetchAdminData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setErrorMsg('');

      // 1. Fetch courses
      const courseRes = await fetch(`${API_BASE_URL}/courses`);
      const courseData = await courseRes.json();

      // 2. Fetch system-wide enrollments
      const enrollRes = await fetch(`${API_BASE_URL}/enrollments/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const enrollData = await enrollRes.json();

      if (courseRes.ok && enrollRes.ok) {
        setCourses(courseData.data);
        setEnrollments(enrollData.data);
      } else {
        setErrorMsg('Failed to sync administrative stats databases.');
      }
    } catch (err) {
      console.error('Admin fetching error:', err);
      setErrorMsg('Error connecting to the MERN backend API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [token, API_BASE_URL]);

  // Handle Edit button click
  const openEditModal = (course) => {
    setEditingCourse(course);
    setFormTitle(course.title);
    setFormDescription(course.description);
    setFormCategory(course.category);
    setFormInstructor(course.instructor);
    setFormPrice(course.price);
    setFormDuration(course.duration);
    setFormLevel(course.level);
    setFormImage(course.image);
    setFormSyllabus(course.syllabus ? course.syllabus.join('\n') : '');
    setIsModalOpen(true);
  };

  // Handle Add button click
  const openAddModal = () => {
    setEditingCourse(null);
    setFormTitle('');
    setFormDescription('');
    setFormCategory('Programming');
    setFormInstructor('');
    setFormPrice(0);
    setFormDuration('4 Weeks');
    setFormLevel('Beginner');
    setFormImage('');
    setFormSyllabus('');
    setIsModalOpen(true);
  };

  // Handle Delete course
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to remove this course and revoke active class listings?')) return;

    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg('Course removed from database successfully!');
        // Refresh catalog lists
        fetchAdminData();
      } else {
        setErrorMsg(data.message || 'Could not delete course.');
      }
    } catch (err) {
      setErrorMsg('Server communication failure.');
    }
  };

  // Save / Update form
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const payload = {
      title: formTitle,
      description: formDescription,
      category: formCategory,
      instructor: formInstructor,
      price: Number(formPrice),
      duration: formDuration,
      level: formLevel,
      image: formImage || undefined,
      syllabus: formSyllabus.split('\n').filter(Boolean)
    };

    try {
      let res;
      if (editingCourse) {
        // Edit PUT request
        res = await fetch(`${API_BASE_URL}/courses/${editingCourse._id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } else {
        // Create POST request
        res = await fetch(`${API_BASE_URL}/courses`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(editingCourse ? 'Course entry updated successfully!' : 'New Course launched successfully!');
        setIsModalOpen(false);
        fetchAdminData();
      } else {
        setErrorMsg(data.message || 'Failed to commit course save.');
      }
    } catch (err) {
      setErrorMsg('Database connectivity issues. Try again.');
    }
  };

  // Calculate stats
  const totalRevenue = enrollments.reduce((sum, e) => sum + (e.course?.price || 0), 0);
  const uniqueStudents = [...new Set(enrollments.map((e) => e.student?._id))].filter(Boolean).length;

  if (loading && courses.length === 0) {
    return (
      <div style={{ marginTop: '70px', minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }}></span>
          <p>Booting Admin Panel console...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '70px', paddingBottom: '100px' }}>
      {/* Admin Top Area */}
      <section style={{ 
        padding: '50px 0 30px 0', 
        background: 'var(--dashboard-header-bg)',
        borderBottom: '1px solid var(--border-color)' 
      }}>
        <div className="container">
          <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ color: '#f43f5e', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                ADMIN PANEL
              </span>
              <h1 style={{ fontSize: '36px', fontWeight: '800', marginTop: '6px' }}>
                Platform Command Center
              </h1>
              <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                Create courses, check student enrollment logs, and review platform revenue metrics.
              </p>
            </div>
            <button onClick={openAddModal} className="btn btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Launch Course / Workshop
            </button>
          </div>
        </div>
      </section>

      <div className="container" style={{ marginTop: '40px' }}>
        {/* Messages */}
        {errorMsg && (
          <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 'var(--border-radius-md)', color: '#f87171', marginBottom: '24px' }}>
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div style={{ padding: '16px', background: 'var(--success-glow)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--border-radius-md)', color: '#34d399', marginBottom: '24px' }}>
            {successMsg}
          </div>
        )}

        {/* Analytics Widgets */}
        <div className="stats-grid">
          <div className="glass-panel stat-card">
            <span className="stat-card-title">Active Workshops</span>
            <span className="stat-card-value gradient-text">{courses.length}</span>
          </div>
          <div className="glass-panel stat-card">
            <span className="stat-card-title">Enrolled Students</span>
            <span className="stat-card-value gradient-text">{uniqueStudents}</span>
          </div>
          <div className="glass-panel stat-card">
            <span className="stat-card-title">Total Registrations</span>
            <span className="stat-card-value gradient-text">{enrollments.length}</span>
          </div>
          <div className="glass-panel stat-card">
            <span className="stat-card-title">Est. Revenue Tally</span>
            <span className="stat-card-value" style={{ color: 'var(--success)' }}>${totalRevenue}</span>
          </div>
        </div>

        {/* Course CRUD Table */}
        <div className="glass-panel" style={{ padding: '32px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Active Workshops Catalog Database</h2>
          
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Course Title</th>
                  <th>Category</th>
                  <th>Instructor</th>
                  <th>Investment</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <tr key={course._id}>
                      <td style={{ fontWeight: '600' }}>{course.title}</td>
                      <td>
                        <span className="course-card-tag tag-blue" style={{ margin: '0' }}>{course.category}</span>
                      </td>
                      <td>{course.instructor}</td>
                      <td style={{ color: 'var(--success)', fontWeight: '700' }}>${course.price}</td>
                      <td>{course.duration}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => openEditModal(course)} 
                            className="btn btn-secondary" 
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteCourse(course._id)} 
                            className="btn btn-danger" 
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                      No active courses in the database. Seed the database to view.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student Enrollments Table */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Real-time Student Registration Logs</h2>
          
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Student Email</th>
                  <th>Workshop Selected</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.length > 0 ? (
                  enrollments.map((e) => (
                    <tr key={e._id}>
                      <td style={{ fontWeight: '600' }}>{e.student?.name || 'N/A'}</td>
                      <td>{e.student?.email || 'N/A'}</td>
                      <td>{e.course?.title || 'Course Deleted'}</td>
                      <td>{new Date(e.enrolledAt).toLocaleDateString()}</td>
                      <td>
                        <span style={{ 
                          fontSize: '11px', 
                          fontWeight: '700', 
                          textTransform: 'uppercase', 
                          padding: '3px 8px', 
                          borderRadius: '4px',
                          background: e.status === 'enrolled' ? 'var(--primary-glow)' : 'var(--success-glow)',
                          color: e.status === 'enrolled' ? '#60a5fa' : '#34d399'
                        }}>
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                      No system-wide student enrollments logged.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- CREATE / EDIT MODAL --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h3 className="modal-title">{editingCourse ? 'Modify Workshop' : 'Launch Workshop'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="modal-close">
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveCourse}>
              <div className="form-group">
                <label className="form-label">Course Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="form-input"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Instructor Name</label>
                  <input
                    type="text"
                    value={formInstructor}
                    onChange={(e) => setFormInstructor(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="form-input"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="form-input"
                    placeholder="e.g. 4 Weeks"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Difficulty Level</label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value)}
                    className="form-input"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Banner Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Syllabus Curriculum (one item per line)</label>
                <textarea
                  rows="4"
                  placeholder="Module 1: Getting Started&#10;Module 2: Variables&#10;Module 3: Deploying App"
                  value={formSyllabus}
                  onChange={(e) => setFormSyllabus(e.target.value)}
                  className="form-input"
                  style={{ resize: 'vertical', fontFamily: 'inherit' }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short Description</label>
                <textarea
                  rows="3"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="form-input"
                  style={{ resize: 'vertical', fontFamily: 'inherit' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  Save Workshop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
