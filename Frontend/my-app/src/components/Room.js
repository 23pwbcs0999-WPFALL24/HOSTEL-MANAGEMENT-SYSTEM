import React, { useEffect, useState } from 'react';
import { fetchRooms, createRoom } from '../api/api';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    block: '',
    floor: '',
    room_type: '1-Seater',
    max_capacity: ''
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRoom(formData);
      setFormData({ block: '', floor: '', room_type: '1-Seater', max_capacity: '' });
      loadRooms(); // refresh the table
    } catch (err) {
      alert('Failed to add room');
      console.error(err);
    }
  };

  const loadRooms = async () => {
    try {
      const data = await fetchRooms();
      setRooms(data);
    } catch (err) {
      setError('Failed to load rooms.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const getStatus = (occupancy, capacity) => {
    if (occupancy >= capacity) return 'Full';
    if (occupancy > 0) return 'Partial';
    return 'Empty';
  };

  const getStatusClass = (occupancy, capacity) => {
    if (occupancy >= capacity) return 'status-full';
    if (occupancy > 0) return 'status-partial';
    return 'status-empty';
  };

  return (
    <section className="page-section">
      <h2>Rooms Management</h2>

      {/* Add Room Form */}
      <form onSubmit={handleSubmit} className="room-form">
        <h3>Add New Room</h3>
        <input type="text" name="block" placeholder="Block" value={formData.block} onChange={handleChange} required />
        <input type="number" name="floor" placeholder="Floor" value={formData.floor} onChange={handleChange} required />
        <select name="room_type" value={formData.room_type} onChange={handleChange}>
          <option value="1-Seater">1-Seater</option>
          <option value="2-Seater">2-Seater</option>
        </select>
        <input type="number" name="max_capacity" placeholder="Max Capacity" value={formData.max_capacity} onChange={handleChange} required />
        <button type="submit">Add Room</button>
      </form>

      {loading && <p className="loading">Loading rooms...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="rooms-container">
          {rooms.length === 0 ? (
            <p>No rooms available in the hostel.</p>
          ) : (
            <table className="rooms-table">
              <thead>
                <tr>
                  <th>Room ID</th>
                  <th>Block</th>
                  <th>Floor</th>
                  <th>Type</th>
                  <th>Occupancy</th>
                  <th>Capacity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.room_id}>
                    <td>{room.room_id}</td>
                    <td>{room.block}</td>
                    <td>{room.floor}</td>
                    <td>{room.room_type}</td>
                    <td>{room.current_occupancy}</td>
                    <td>{room.max_capacity}</td>
                    <td className={getStatusClass(room.current_occupancy, room.max_capacity)}>
                      {getStatus(room.current_occupancy, room.max_capacity)}
                    </td>
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

export default Rooms;
