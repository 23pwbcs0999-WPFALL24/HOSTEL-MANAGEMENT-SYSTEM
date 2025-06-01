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
      setStudents(data.students || data); // handle both raw array or wrapped response
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

    // basic validation
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
      <h2 className="text-xl font-bold mb-4">Students</h2>


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

      {/* List of Students */}
      {loading && <p>Loading students...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <ul className="list-disc list-inside space-y-2">
          {students.length === 0 ? (
            <li>No students available.</li>
          ) : (
            students.map((student) => (
              <li key={student.student_id} className="border p-2 rounded">
                <strong>{student.student_name}</strong> — Roll #: {student.roll_number}, CNIC: {student.cnic}, Phone: {student.phone_number}, Dept: {student.department}, Semester: {student.semester}
              </li>
            ))
          )}
        </ul>
      )}
    </section>
  );
};

export default Students;