import React, { useEffect, useState } from 'react';
import { fetchVisitors, fetchStudents } from '../api/api';

const Visitors = () => {
  // State for visitors list
  const [visitors, setVisitors] = useState([]);
  // State for students list (for dropdown)
  const [students, setStudents] = useState([]);
  // State for loading indicator
  const [loading, setLoading] = useState(true);
  // State for error messages
  const [error, setError] = useState(null);

  // State for add visitor form
  const [form, setForm] = useState({
    student_id: '',
    visitor_name: '',
    relation: '',
    visit_date: ''
  });
  // State for form error messages
  const [formError, setFormError] = useState(null);

  // Load visitors and students when component mounts
  useEffect(() => {
    async function loadData() {
      try {
        // Fetch all visitors and students in parallel
        // Equivalent SQL:
        // SELECT * FROM visitors
        // SELECT * FROM students
        const [visitorsData, studentsData] = await Promise.all([
          fetchVisitors(),
          fetchStudents()
        ]);
        setVisitors(visitorsData);
        setStudents(studentsData);
      } catch (err) {
        setError('Failed to load visitors or students');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Handle input changes in the form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission to add a new visitor
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { student_id, visitor_name, relation, visit_date } = form;

    // Simple validation
    if (!student_id || !visitor_name || !relation || !visit_date) {
      setFormError('All fields are required');
      return;
    }

    try {
      // Send new visitor data to backend
      // Equivalent SQL:
      // INSERT INTO visitors (student_id, visitor_name, relation, visit_date) VALUES (?, ?, ?, ?)
      const res = await fetch('http://localhost:5000/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to add visitor');
      }

      const result = await res.json();
      setVisitors([...visitors, result.visitor]);
      setForm({
        student_id: '',
        visitor_name: '',
        relation: '',
        visit_date: ''
      });
      setFormError(null);
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <section className="page-section">
      <h2>Visitors</h2>

      {/* Show loading or error messages */}
      {loading && <p>Loading visitors...</p>}
      {error && <p className="error">{error}</p>}

      {/* Visitors List */}
      {!loading && !error && (
        <ul className="list">
          {visitors.length === 0 ? (
            <li>No visitors available.</li>
          ) : (
            visitors.map((visitor) => (
              <li key={visitor.visitor_id}>
                {/* Show visitor details */}
                {visitor.visitor_name} — Visiting Student ID: {visitor.student_id} — Relation: {visitor.relation} — Date: {new Date(visitor.visit_date).toLocaleDateString()}
              </li>
            ))
          )}
        </ul>
      )}

      {/* Add Visitor Form */}
      <form className="form" onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <h3>Add Visitor</h3>
        {formError && <p className="error">{formError}</p>}
        
        {/* Student dropdown */}
        <select name="student_id" value={form.student_id} onChange={handleChange} required>
          <option value="">Select Student</option>
          {students.map((student) => (
            <option key={student.student_id} value={student.student_id}>
              {student.name} (ID: {student.student_id})
            </option>
          ))}
        </select>

        {/* Visitor name input */}
        <input
          type="text"
          name="visitor_name"
          value={form.visitor_name}
          onChange={handleChange}
          placeholder="Visitor Name"
          required
        />
        {/* Relation input */}
        <input
          type="text"
          name="relation"
          value={form.relation}
          onChange={handleChange}
          placeholder="Relation"
          required
        />
        {/* Visit date input */}
        <input
          type="date"
          name="visit_date"
          value={form.visit_date}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Visitor</button>
      </form>
    </section>
  );
};

export default Visitors;
