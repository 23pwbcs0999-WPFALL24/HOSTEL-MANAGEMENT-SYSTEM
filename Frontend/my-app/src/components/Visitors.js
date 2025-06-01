import React, { useEffect, useState } from 'react';
import { fetchVisitors, fetchStudents } from '../api/api';

const Visitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    student_id: '',
    visitor_name: '',
    relation: '',
    visit_date: ''
  });
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { student_id, visitor_name, relation, visit_date } = form;

    if (!student_id || !visitor_name || !relation || !visit_date) {
      setFormError('All fields are required');
      return;
    }

    try {
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

      {loading && <p>Loading visitors...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <ul className="list">
          {visitors.length === 0 ? (
            <li>No visitors available.</li>
          ) : (
            visitors.map((visitor) => (
              <li key={visitor.visitor_id}>
                {visitor.visitor_name} — Visiting Student ID: {visitor.student_id} — Relation: {visitor.relation} — Date: {new Date(visitor.visit_date).toLocaleDateString()}
              </li>
            ))
          )}
        </ul>
      )}

      <form className="form" onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <h3>Add Visitor</h3>
        {formError && <p className="error">{formError}</p>}
        
        <select name="student_id" value={form.student_id} onChange={handleChange} required>
          <option value="">Select Student</option>
          {students.map((student) => (
            <option key={student.student_id} value={student.student_id}>
              {student.name} (ID: {student.student_id})
            </option>
          ))}
        </select>

        <input
          type="text"
          name="visitor_name"
          value={form.visitor_name}
          onChange={handleChange}
          placeholder="Visitor Name"
          required
        />
        <input
          type="text"
          name="relation"
          value={form.relation}
          onChange={handleChange}
          placeholder="Relation"
          required
        />
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
