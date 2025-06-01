import React, { useEffect, useState } from 'react';
import { fetchAllocations, fetchStudents, fetchRooms, createAllocation } from '../api/api';

const Allocations = () => {
  const [allocations, setAllocations] = useState([]);
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    student_id: '',
    room_id: '',
    allocation_date: new Date().toISOString().split('T')[0] // Default to today
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [allocs, studs, rms] = await Promise.all([
          fetchAllocations(),
          fetchStudents(),
          fetchRooms()
        ]);
        setAllocations(allocs);
        setStudents(studs);
        setRooms(rms.filter(room => room.current_occupancy < room.max_capacity)); // Only show available rooms
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      const newAllocation = await createAllocation(formData);
      setAllocations(prev => [...prev, newAllocation]);
      
      // Update available rooms
      const updatedRooms = rooms.map(room => 
        room.room_id === parseInt(formData.room_id) 
          ? {...room, current_occupancy: room.current_occupancy + 1} 
          : room
      );
      setRooms(updatedRooms.filter(room => room.current_occupancy < room.max_capacity));
      
      setSuccess('Room allocated successfully!');
      setFormData({
        student_id: '',
        room_id: '',
        allocation_date: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      setError(err.message || 'Failed to allocate room');
    }
  };

  return (
    <section className="page-section">
      <h2>Room Allocations</h2>
      
      {loading && <p>Loading data...</p>}
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      {/* Allocation Form */}
      <div className="allocation-form">
        <h3>Allocate Room</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Student:</label>
            <select 
              name="student_id" 
              value={formData.student_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Student</option>
              {students.map(student => (
                <option key={student.student_id} value={student.student_id}>
                  {student.name} (ID: {student.student_id})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Available Room:</label>
            <select 
              name="room_id" 
              value={formData.room_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Room</option>
              {rooms.map(room => (
                <option key={room.room_id} value={room.room_id}>
                  {room.room_name} (Capacity: {room.current_occupancy}/{room.max_capacity})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Allocation Date:</label>
            <input
              type="date"
              name="allocation_date"
              value={formData.allocation_date}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Allocate Room
          </button>
        </form>
      </div>

      {/* Allocations List */}
      <div className="allocations-list">
        <h3>Current Allocations</h3>
        {allocations.length === 0 ? (
          <p>No allocations available.</p>
        ) : (
          <table className="allocations-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Room</th>
                <th>Allocation Date</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map(alloc => (
                <tr key={alloc.allocation_id}>
                  <td>
                    {students.find(s => s.student_id === alloc.student_id)?.name || `Student ID: ${alloc.student_id}`}
                  </td>
                  <td>
                    {rooms.find(r => r.room_id === alloc.room_id)?.room_name || `Room ID: ${alloc.room_id}`}
                  </td>
                  <td>{new Date(alloc.allocation_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default Allocations;