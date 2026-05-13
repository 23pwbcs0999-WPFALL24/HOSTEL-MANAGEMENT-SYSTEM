import React, { useEffect, useMemo, useState } from 'react';
import { createStudent, fetchStudents, updateStudent, deleteStudent } from '../api/api';

const initialForm = { student_name: '', roll_number: '', cnic: '', phone_number: '', department: '', semester: '' };

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, name }

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchStudents();
      setStudents(Array.isArray(data) ? data : data.students || []);
      setError('');
    } catch (err) { setError('Failed to load students.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const startEdit = (s) => {
    setEditingId(s.student_id);
    setForm({ student_name: s.student_name, roll_number: s.roll_number, cnic: s.cnic, phone_number: s.phone_number, department: s.department, semester: String(s.semester) });
    setFormError(''); setFormSuccess('');
  };

  const cancelEdit = () => { setEditingId(null); setForm(initialForm); setFormError(''); setFormSuccess(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(''); setFormSuccess('');
    if (Object.values(form).some(v => v.trim() === '')) { setFormError('All fields are required.'); return; }
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateStudent(editingId, { ...form, semester: form.semester });
        setFormSuccess('Student updated successfully.');
        setEditingId(null);
      } else {
        await createStudent({ ...form, roll_number: form.roll_number.trim().toUpperCase() });
        setFormSuccess('Student added successfully.');
      }
      setForm(initialForm);
      await load();
    } catch (err) { setFormError(err.message || 'Operation failed.'); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteStudent(confirmDelete.id);
      setFormSuccess(`Student "${confirmDelete.name}" deleted.`);
      await load();
    } catch (err) { setError(err.message || 'Failed to delete student.'); }
    finally { setConfirmDelete(null); }
  };

  const departments = useMemo(() => ['All', ...new Set(students.map(s => s.department).filter(Boolean))], [students]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return students.filter(s => {
      const matchSearch = !q || s.student_name?.toLowerCase().includes(q) || s.roll_number?.toLowerCase().includes(q) || String(s.student_id).includes(q);
      const matchDept = departmentFilter === 'All' || s.department === departmentFilter;
      return matchSearch && matchDept;
    });
  }, [students, searchQuery, departmentFilter]);

  return (
    <section className="page-section">
      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Confirm Delete</h3>
            <p className="modal-body">Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-muted" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="page-head">
        <div>
          <h2 className="page-title">Student Management</h2>
          <p className="page-description">Register residents and keep student records accurate and searchable.</p>
        </div>
      </div>

      <div className="panel-grid">
        <aside className="panel">
          <h3>{editingId ? 'Edit Student' : 'Register New Student'}</h3>
          {formError && <p className="error">{formError}</p>}
          {formSuccess && <p className="success">{formSuccess}</p>}
          <form onSubmit={handleSubmit} className="form">
            <div>
              <label className="label" htmlFor="student_name">Full Name</label>
              <input id="student_name" className="input" name="student_name" value={form.student_name} onChange={handleChange} placeholder="e.g., Ahmed Raza" />
            </div>
            <div className="input-row">
              <div>
                <label className="label" htmlFor="roll_number">Roll Number</label>
                <input id="roll_number" className="input" name="roll_number" value={form.roll_number} onChange={handleChange} placeholder="22-CS-101" />
              </div>
              <div>
                <label className="label" htmlFor="semester">Semester</label>
                <input id="semester" className="input" name="semester" value={form.semester} onChange={handleChange} placeholder="6" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="cnic">CNIC</label>
              <input id="cnic" className="input" name="cnic" value={form.cnic} onChange={handleChange} placeholder="xxxxx-xxxxxxx-x" />
            </div>
            <div>
              <label className="label" htmlFor="phone_number">Phone Number</label>
              <input id="phone_number" className="input" name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="03xx-xxxxxxx" />
            </div>
            <div>
              <label className="label" htmlFor="department">Department</label>
              <input id="department" className="input" name="department" value={form.department} onChange={handleChange} placeholder="Computer Science" />
            </div>
            <div className="form-btn-row">
              <button className="btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingId ? 'Update Student' : 'Add Student'}
              </button>
              {editingId && <button type="button" className="btn-muted" onClick={cancelEdit}>Cancel</button>}
            </div>
          </form>
        </aside>

        <div className="panel">
          <div className="tools-row">
            <input className="input" type="text" placeholder="Search by ID, name or roll number" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            <select className="select" value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)}>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {loading && <p className="notice">Loading students...</p>}
          {!loading && error && <p className="error">{error}</p>}
          {!loading && !error && filtered.length === 0 && <div className="empty-state"><p>No students match your filters.</p></div>}

          {!loading && !error && filtered.length > 0 && (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Full Name</th><th>Roll Number</th><th>Department</th><th>Semester</th><th>Phone</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.student_id}>
                      <td>{s.student_id}</td>
                      <td><strong>{s.student_name}</strong></td>
                      <td>{s.roll_number}</td>
                      <td>{s.department}</td>
                      <td>{s.semester}</td>
                      <td>{s.phone_number}</td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-icon btn-edit" title="Edit" onClick={() => startEdit(s)}>✏️</button>
                          <button className="btn-icon btn-del" title="Delete" onClick={() => setConfirmDelete({ id: s.student_id, name: s.student_name })}>🗑️</button>
                        </div>
                      </td>
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

export default Students;
