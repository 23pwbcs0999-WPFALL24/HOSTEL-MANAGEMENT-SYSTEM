import React, { useEffect, useState } from 'react';
import { fetchStudents, createStudent } from '../api/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    student_name: '',
    roll_number: '',
    cnic: '',
    phone_number: '',
    department: '',
    semester: ''
  });
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    try {
      const data = await fetchStudents();
      setStudents(data.students || data);
    } catch (err) {
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (Object.values(form).some((val) => val.trim() === '')) {
      setFormError('All fields are required.');
      return;
    }

    try {
      const response = await createStudent(form);
      setFormSuccess(response.message || 'Student added successfully.');
      setForm({
        student_name: '',
        roll_number: '',
        cnic: '',
        phone_number: '',
        department: '',
        semester: ''
      });
      loadStudents();
    } catch (err) {
      setFormError(err.message || 'Failed to add student.');
    }
  };

  return (
    <section className="page-section">
      <h2 className="text-xl font-bold mb-4">Student Management</h2>

      {/* Student Form */}
      <div className="student-form-container">
        <form onSubmit={handleFormSubmit} className="student-form space-y-4">
          <h3 className="text-lg font-semibold">Register New Student</h3>
          {formError && <p className="text-red-600">{formError}</p>}
          {formSuccess && <p className="text-green-600">{formSuccess}</p>}
          <input name="student_name" placeholder="Full Name" value={form.student_name} onChange={handleInputChange} className="block w-full p-2 border rounded" />
          <input name="roll_number" placeholder="Roll Number" value={form.roll_number} onChange={handleInputChange} className="block w-full p-2 border rounded" />
          <input name="cnic" placeholder="CNIC" value={form.cnic} onChange={handleInputChange} className="block w-full p-2 border rounded" />
          <input name="phone_number" placeholder="Phone Number" value={form.phone_number} onChange={handleInputChange} className="block w-full p-2 border rounded" />
          <input name="department" placeholder="Department" value={form.department} onChange={handleInputChange} className="block w-full p-2 border rounded" />
          <input name="semester" placeholder="Semester" value={form.semester} onChange={handleInputChange} className="block w-full p-2 border rounded" />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Student</button>
        </form>
      </div>

      {/* Students Table */}
      {loading && <p>Loading students...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <div className="students-container mt-6">
          {students.length === 0 ? (
            <p>No students registered.</p>
          ) : (
            <table className="rooms-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Roll #</th>
                  <th>CNIC</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Semester</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.student_id}>
                    <td>{student.student_id}</td>
                    <td>{student.student_name}</td>
                    <td>{student.roll_number}</td>
                    <td>{student.cnic}</td>
                    <td>{student.phone_number}</td>
                    <td>{student.department}</td>
                    <td>{student.semester}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </section>
  );
};

export default Students;
