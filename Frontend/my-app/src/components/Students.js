import React, { useEffect, useMemo, useState } from 'react';
import { createStudent, fetchStudents } from '../api/api';

const initialForm = {
  student_name: '',
  roll_number: '',
  cnic: '',
  phone_number: '',
  department: '',
  semester: ''
};

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await fetchStudents();
      setStudents(Array.isArray(data) ? data : data.students || []);
      setError('');
    } catch (err) {
      setError('Failed to load students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (Object.values(form).some((val) => val.trim() === '')) {
      setFormError('All fields are required.');
      return;
    }

    if (Number(form.semester) <= 0 || Number.isNaN(Number(form.semester))) {
      setFormError('Semester must be a positive number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        student_name: form.student_name.trim(),
        roll_number: form.roll_number.trim().toUpperCase(),
        cnic: form.cnic.trim(),
        phone_number: form.phone_number.trim(),
        department: form.department.trim(),
        semester: form.semester.trim()
      };

      const response = await createStudent(payload);
      setFormSuccess(response.message || 'Student added successfully.');
      setForm(initialForm);
      await loadStudents();
    } catch (err) {
      setFormError(err.message || 'Failed to add student.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const departmentOptions = useMemo(() => {
    const values = new Set(students.map((student) => student.department).filter(Boolean));
    return ['All', ...values];
  }, [students]);

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return students.filter((student) => {
      const matchesSearch =
        !query ||
        student.student_name?.toLowerCase().includes(query) ||
        student.roll_number?.toLowerCase().includes(query) ||
        String(student.student_id).includes(query);
      const matchesDepartment = departmentFilter === 'All' || student.department === departmentFilter;
      return matchesSearch && matchesDepartment;
    });
  }, [departmentFilter, searchQuery, students]);

  return (
    <section className="page-section">
      <div className="page-head">
        <div>
          <h2 className="page-title">Student Management</h2>
          <p className="page-description">Register residents and keep student records accurate and searchable.</p>
        </div>
      </div>

      <div className="panel-grid">
        <aside className="panel">
          <h3>Register New Student</h3>
          {formError && <p className="error">{formError}</p>}
          {formSuccess && <p className="success">{formSuccess}</p>}

          <form onSubmit={handleFormSubmit} className="form">
            <div>
              <label className="label" htmlFor="student_name">Full Name</label>
              <input id="student_name" className="input" name="student_name" value={form.student_name} onChange={handleInputChange} placeholder="e.g., Ahmed Raza" />
            </div>
            <div className="input-row">
              <div>
                <label className="label" htmlFor="roll_number">Roll Number</label>
                <input id="roll_number" className="input" name="roll_number" value={form.roll_number} onChange={handleInputChange} placeholder="22-CS-101" />
              </div>
              <div>
                <label className="label" htmlFor="semester">Semester</label>
                <input id="semester" className="input" name="semester" value={form.semester} onChange={handleInputChange} placeholder="6" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="cnic">CNIC</label>
              <input id="cnic" className="input" name="cnic" value={form.cnic} onChange={handleInputChange} placeholder="xxxxx-xxxxxxx-x" />
            </div>
            <div>
              <label className="label" htmlFor="phone_number">Phone Number</label>
              <input id="phone_number" className="input" name="phone_number" value={form.phone_number} onChange={handleInputChange} placeholder="03xx-xxxxxxx" />
            </div>
            <div>
              <label className="label" htmlFor="department">Department</label>
              <input id="department" className="input" name="department" value={form.department} onChange={handleInputChange} placeholder="Computer Science" />
            </div>
            <button className="btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Add Student'}
            </button>
          </form>
        </aside>

        <div className="panel">
          <div className="tools-row">
            <input
              className="input"
              type="text"
              placeholder="Search by ID, name, or roll number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select className="select" value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
              {departmentOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {loading && <p className="notice">Loading students...</p>}
          {!loading && error && <p className="error">{error}</p>}

          {!loading && !error && filteredStudents.length === 0 && (
            <div className="empty-state">
              <p>No students match your filters.</p>
            </div>
          )}

          {!loading && !error && filteredStudents.length > 0 && (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Roll Number</th>
                    <th>Department</th>
                    <th>Semester</th>
                    <th>CNIC</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.student_id}>
                      <td>{student.student_id}</td>
                      <td>{student.student_name}</td>
                      <td>{student.roll_number}</td>
                      <td>{student.department}</td>
                      <td>{student.semester}</td>
                      <td>{student.cnic}</td>
                      <td>{student.phone_number}</td>
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
