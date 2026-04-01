import React, { useEffect, useMemo, useState } from 'react';
import { createVisitor, fetchStudents, fetchVisitors } from '../api/api';

const initialForm = {
  student_id: '',
  visitor_name: '',
  relation: '',
  visit_date: new Date().toISOString().split('T')[0]
};

const Visitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [visitorsData, studentsData] = await Promise.all([fetchVisitors(), fetchStudents()]);
      setVisitors(Array.isArray(visitorsData) ? visitorsData : []);
      setStudents(Array.isArray(studentsData) ? studentsData : studentsData.students || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load visitors or students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const studentMap = useMemo(() => {
    return students.reduce((map, student) => {
      map[student.student_id] = student.student_name;
      return map;
    }, {});
  }, [students]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');

    const { student_id, visitor_name, relation, visit_date } = form;

    if (!student_id || !visitor_name.trim() || !relation.trim() || !visit_date) {
      setFormError('All fields are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createVisitor({
        student_id: Number(student_id),
        visitor_name: visitor_name.trim(),
        relation: relation.trim(),
        visit_date
      });

      setSuccess('Visitor added successfully.');
      setForm(initialForm);
      await loadData();
    } catch (err) {
      setFormError(err.message || 'Failed to add visitor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-section">
      <div className="page-head">
        <div>
          <h2 className="page-title">Visitor Management</h2>
          <p className="page-description">Log visitor entries and map each visit to the corresponding student record.</p>
        </div>
      </div>

      <div className="panel-grid">
        <aside className="panel">
          <h3>Add Visitor Entry</h3>
          {formError && <p className="error">{formError}</p>}
          {success && <p className="success">{success}</p>}

          <form className="form" onSubmit={handleSubmit}>
            <div>
              <label className="label" htmlFor="student_id">Student</label>
              <select id="student_id" className="select" name="student_id" value={form.student_id} onChange={handleChange} required>
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.student_id} value={student.student_id}>
                    {student.student_name} (ID: {student.student_id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label" htmlFor="visitor_name">Visitor Name</label>
              <input id="visitor_name" className="input" type="text" name="visitor_name" value={form.visitor_name} onChange={handleChange} placeholder="e.g., Ali Khan" required />
            </div>

            <div className="input-row">
              <div>
                <label className="label" htmlFor="relation">Relation</label>
                <input id="relation" className="input" type="text" name="relation" value={form.relation} onChange={handleChange} placeholder="Father / Sister / Friend" required />
              </div>
              <div>
                <label className="label" htmlFor="visit_date">Visit Date</label>
                <input id="visit_date" className="input" type="date" name="visit_date" value={form.visit_date} onChange={handleChange} required />
              </div>
            </div>

            <button className="btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Add Visitor'}
            </button>
          </form>
        </aside>

        <div className="panel">
          {loading && <p className="notice">Loading visitors...</p>}
          {!loading && error && <p className="error">{error}</p>}

          {!loading && !error && visitors.length === 0 && (
            <div className="empty-state">
              <p>No visitors have been recorded yet.</p>
            </div>
          )}

          {!loading && !error && visitors.length > 0 && (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Visitor Name</th>
                    <th>Student</th>
                    <th>Relation</th>
                    <th>Visit Date</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((visitor) => (
                    <tr key={visitor.visitor_id}>
                      <td>{visitor.visitor_name}</td>
                      <td>{studentMap[visitor.student_id] || `Student #${visitor.student_id}`}</td>
                      <td>{visitor.relation}</td>
                      <td>{new Date(visitor.visit_date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Visitors;
