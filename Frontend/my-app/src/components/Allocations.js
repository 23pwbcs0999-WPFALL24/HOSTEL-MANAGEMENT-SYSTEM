import React, { useEffect, useMemo, useState } from 'react';
import {
  createAllocation,
  fetchAllocations,
  fetchRooms,
  fetchStudents,
  fetchUnallocatedStudents
} from '../api/api';

const initialForm = {
  student_id: '',
  room_id: '',
  allocation_date: new Date().toISOString().split('T')[0]
};

const Allocations = () => {
  const [allocations, setAllocations] = useState([]);
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [allocRes, studRes, roomRes, unallocatedRes] = await Promise.all([
        fetchAllocations(),
        fetchStudents(),
        fetchRooms(),
        fetchUnallocatedStudents()
      ]);

      const allStudents = Array.isArray(studRes) ? studRes : studRes.students || [];
      const allRooms = Array.isArray(roomRes) ? roomRes : [];
      const pendingStudents = Array.isArray(unallocatedRes?.students)
        ? unallocatedRes.students
        : Array.isArray(unallocatedRes)
          ? unallocatedRes
          : allStudents;

      setAllocations(Array.isArray(allocRes) ? allocRes : []);
      setStudents(pendingStudents);
      setRooms(allRooms);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load allocation data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const availableRooms = useMemo(
    () => rooms.filter((room) => Number(room.current_occupancy) < Number(room.max_capacity)),
    [rooms]
  );

  const roomMap = useMemo(() => {
    return rooms.reduce((acc, room) => {
      acc[room.room_id] = room;
      return acc;
    }, {});
  }, [rooms]);

  const studentMap = useMemo(() => {
    const map = {};
    students.forEach((student) => {
      map[student.student_id] = student;
    });

    allocations.forEach((allocation) => {
      if (allocation.Student && !map[allocation.Student.student_id]) {
        map[allocation.Student.student_id] = allocation.Student;
      }
    });

    return map;
  }, [allocations, students]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.student_id || !formData.room_id || !formData.allocation_date) {
      setError('Please complete all fields before allocating a room.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createAllocation({
        student_id: Number(formData.student_id),
        room_id: Number(formData.room_id),
        allocation_date: formData.allocation_date
      });

      setSuccess('Room allocated successfully.');
      setFormData((prev) => ({ ...initialForm, allocation_date: prev.allocation_date }));
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to allocate room.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-section">
      <div className="page-head">
        <div>
          <h2 className="page-title">Room Allocations</h2>
          <p className="page-description">Assign available rooms to unallocated students and track all assignments.</p>
        </div>
      </div>

      <div className="cards-grid">
        <article className="stat-card">
          <p className="label">Open Students</p>
          <p className="value">{students.length}</p>
          <p className="hint">Awaiting room allocation</p>
        </article>
        <article className="stat-card">
          <p className="label">Available Rooms</p>
          <p className="value">{availableRooms.length}</p>
          <p className="hint">Rooms with free capacity</p>
        </article>
        <article className="stat-card">
          <p className="label">Total Allocations</p>
          <p className="value">{allocations.length}</p>
          <p className="hint">Recorded assignments</p>
        </article>
      </div>

      <div className="panel-grid" style={{ marginTop: '1rem' }}>
        <aside className="panel">
          <h3>Allocate Room</h3>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <form onSubmit={handleSubmit} className="form">
            <div>
              <label className="label" htmlFor="student_id">Student</label>
              <select id="student_id" className="select" name="student_id" value={formData.student_id} onChange={handleChange} required>
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.student_id} value={student.student_id}>
                    {student.student_name} (ID: {student.student_id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label" htmlFor="room_id">Available Room</label>
              <select id="room_id" className="select" name="room_id" value={formData.room_id} onChange={handleChange} required>
                <option value="">Select Room</option>
                {availableRooms.map((room) => (
                  <option key={room.room_id} value={room.room_id}>
                    Block {room.block} | Floor {room.floor} | {room.room_type} ({room.current_occupancy}/{room.max_capacity})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label" htmlFor="allocation_date">Allocation Date</label>
              <input
                id="allocation_date"
                className="input"
                type="date"
                name="allocation_date"
                value={formData.allocation_date}
                onChange={handleChange}
                required
              />
            </div>

            <button className="btn-primary" type="submit" disabled={isSubmitting || students.length === 0 || availableRooms.length === 0}>
              {isSubmitting ? 'Allocating...' : 'Allocate Room'}
            </button>
          </form>
        </aside>

        <div className="panel">
          {loading && <p className="notice">Loading allocations...</p>}

          {!loading && allocations.length === 0 && (
            <div className="empty-state">
              <p>No allocations recorded yet.</p>
            </div>
          )}

          {!loading && allocations.length > 0 && (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Allocation ID</th>
                    <th>Student</th>
                    <th>Room</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((allocation) => {
                    const room = roomMap[allocation.room_id] || allocation.Room;
                    const student = studentMap[allocation.student_id] || allocation.Student;
                    return (
                      <tr key={allocation.allocation_id}>
                        <td>{allocation.allocation_id}</td>
                        <td>{student?.student_name || `Student #${allocation.student_id}`}</td>
                        <td>
                          {room
                            ? `Block ${room.block || '-'} | Floor ${room.floor || '-'} | ${room.room_type || `Room #${allocation.room_id}`}`
                            : `Room #${allocation.room_id}`}
                        </td>
                        <td>{new Date(allocation.allocation_date).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Allocations;
