import React, { useEffect, useState } from 'react';
import { createRoom, fetchRooms } from '../api/api';

const API_BASE = process.env.REACT_APP_API_BASE || '';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const [formData, setFormData] = useState({
    block: '',
    floor: '',
    room_type: '1-Seater'
  });

  const [filter, setFilter] = useState({
    block: '',
    floor: '',
    occupancy: ''
  });

  const loadRooms = async () => {
    setLoading(true);
    try {
      const data = await fetchRooms();
      setRooms(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError('Failed to load rooms.');
    } finally {
      setLoading(false);
    }
  };

  const loadEmptyRooms = async (params = null) => {
    setLoading(true);
    setError('');

    try {
      const query = params ? `?${params.toString()}` : '';
      const response = await fetch(`${API_BASE}/api/rooms/empty${query}`);
      if (!response.ok) {
        throw new Error('Failed to fetch empty rooms.');
      }
      const data = await response.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load empty rooms.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage('');
    setError('');
    setIsSubmitting(true);

    try {
      await createRoom({
        block: formData.block.trim().toUpperCase(),
        floor: Number(formData.floor),
        room_type: formData.room_type
      });

      setFormData({ block: '', floor: '', room_type: '1-Seater' });
      setSubmitMessage('Room added successfully.');
      await loadRooms();
    } catch (err) {
      setError(err.message || 'Failed to add room.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmptyFilterSubmit = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (filter.block) params.append('block', filter.block);
    if (filter.floor) params.append('floor', filter.floor);
    if (filter.occupancy) params.append('occupancy', filter.occupancy);

    await loadEmptyRooms(params);
  };

  const getStatus = (occupancy, capacity) => {
    if (occupancy >= capacity) return 'Full';
    if (occupancy > 0) return 'Partial';
    return 'Empty';
  };

  const filteredRooms = rooms.filter((room) => {
    const status = getStatus(room.current_occupancy, room.max_capacity);
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || room.block.toLowerCase().includes(query) || String(room.room_id).includes(query);
    const matchesStatus = statusFilter === 'All' || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCapacity = rooms.reduce((sum, room) => sum + Number(room.max_capacity || 0), 0);
  const totalOccupancy = rooms.reduce((sum, room) => sum + Number(room.current_occupancy || 0), 0);

  return (
    <section className="page-section">
      <div className="page-head">
        <div>
          <h2 className="page-title">Rooms Management</h2>
          <p className="page-description">Create rooms and monitor occupancy with smart status indicators.</p>
        </div>
      </div>

      <div className="cards-grid">
        <article className="stat-card">
          <p className="label">Total Rooms</p>
          <p className="value">{rooms.length}</p>
          <p className="hint">Registered rooms</p>
        </article>
        <article className="stat-card">
          <p className="label">Total Occupancy</p>
          <p className="value">{totalOccupancy}</p>
          <p className="hint">Current occupied beds</p>
        </article>
        <article className="stat-card">
          <p className="label">Capacity</p>
          <p className="value">{totalCapacity}</p>
          <p className="hint">Maximum accommodation</p>
        </article>
      </div>

      <div className="panel-grid" style={{ marginTop: '1rem' }}>
        <aside className="panel">
          <h3>Add New Room</h3>
          {submitMessage && <p className="success">{submitMessage}</p>}
          <form onSubmit={handleSubmit} className="form">
            <div>
              <label className="label" htmlFor="block">Block</label>
              <input id="block" className="input" type="text" name="block" placeholder="e.g., A" value={formData.block} onChange={handleChange} required />
            </div>
            <div className="input-row">
              <div>
                <label className="label" htmlFor="floor">Floor</label>
                <input id="floor" className="input" type="number" name="floor" min="0" placeholder="e.g., 2" value={formData.floor} onChange={handleChange} required />
              </div>
              <div>
                <label className="label" htmlFor="room_type">Room Type</label>
                <select id="room_type" className="select" name="room_type" value={formData.room_type} onChange={handleChange}>
                  <option value="1-Seater">1-Seater</option>
                  <option value="2-Seater">2-Seater</option>
                </select>
              </div>
            </div>
            <button className="btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding Room...' : 'Add Room'}
            </button>
          </form>
        </aside>

        <div className="panel">
          <div className="tools-row" style={{ marginBottom: '0.75rem' }}>
            <button className="btn-ghost" onClick={loadRooms}>Show All Rooms</button>
            <button className="btn-ghost" onClick={() => loadEmptyRooms()}>Show Empty Rooms</button>
          </div>

          <form onSubmit={handleEmptyFilterSubmit} className="tools-row" style={{ marginBottom: '0.75rem' }}>
            <input
              className="input"
              type="text"
              placeholder="Filter empty by block"
              value={filter.block}
              onChange={(e) => setFilter((prev) => ({ ...prev, block: e.target.value }))}
            />
            <input
              className="input"
              type="number"
              placeholder="Floor"
              value={filter.floor}
              onChange={(e) => setFilter((prev) => ({ ...prev, floor: e.target.value }))}
            />
            <input
              className="input"
              type="number"
              placeholder="Occupancy"
              value={filter.occupancy}
              onChange={(e) => setFilter((prev) => ({ ...prev, occupancy: e.target.value }))}
            />
            <button className="btn-ghost" type="submit">Search Empty</button>
          </form>

          <div className="tools-row">
            <input
              className="input"
              type="text"
              placeholder="Search by Room ID or Block"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Empty">Empty</option>
              <option value="Partial">Partial</option>
              <option value="Full">Full</option>
            </select>
          </div>

          {loading && <p className="notice">Loading rooms...</p>}
          {!loading && error && <p className="error">{error}</p>}

          {!loading && !error && filteredRooms.length === 0 && (
            <div className="empty-state">
              <p>No rooms match your current filters.</p>
            </div>
          )}

          {!loading && !error && filteredRooms.length > 0 && (
            <div className="table-wrap">
              <table className="data-table">
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
                  {filteredRooms.map((room) => {
                    const status = getStatus(room.current_occupancy, room.max_capacity);
                    const badgeType = status === 'Full' ? 'danger' : status === 'Partial' ? 'warn' : 'success';

                    return (
                      <tr key={room.room_id}>
                        <td>{room.room_id}</td>
                        <td>{room.block}</td>
                        <td>{room.floor}</td>
                        <td>{room.room_type}</td>
                        <td>{room.current_occupancy}</td>
                        <td>{room.max_capacity}</td>
                        <td>
                          <span className={`badge ${badgeType}`}>{status}</span>
                        </td>
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

export default Rooms;
