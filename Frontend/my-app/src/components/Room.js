import React, { useEffect, useState } from 'react';
import { createRoom, fetchRooms, updateRoom, deleteRoom } from '../api/api';

const API_BASE = process.env.REACT_APP_API_BASE || '';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [formData, setFormData] = useState({ block: '', floor: '', room_type: '1-Seater' });
  const [filter, setFilter] = useState({ block: '', floor: '', occupancy: '' });

  const load = async () => {
    setLoading(true);
    try { const data = await fetchRooms(); setRooms(Array.isArray(data) ? data : []); setError(''); }
    catch { setError('Failed to load rooms.'); }
    finally { setLoading(false); }
  };

  const loadEmptyRooms = async (params = null) => {
    setLoading(true); setError('');
    try {
      const q = params ? `?${params}` : '';
      const res = await fetch(`${API_BASE}/api/rooms/empty${q}`);
      if (!res.ok) throw new Error();
      setRooms(await res.json());
    } catch { setError('Failed to load empty rooms.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const startEdit = (r) => {
    setEditingId(r.room_id);
    setFormData({ block: r.block, floor: String(r.floor), room_type: r.room_type });
    setSubmitMessage(''); setError('');
  };

  const cancelEdit = () => { setEditingId(null); setFormData({ block: '', floor: '', room_type: '1-Seater' }); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitMessage(''); setError(''); setIsSubmitting(true);
    try {
      if (editingId) {
        await updateRoom(editingId, { block: formData.block.trim().toUpperCase(), floor: Number(formData.floor), room_type: formData.room_type });
        setSubmitMessage('Room updated successfully.');
        setEditingId(null);
      } else {
        await createRoom({ block: formData.block.trim().toUpperCase(), floor: Number(formData.floor), room_type: formData.room_type });
        setSubmitMessage('Room added successfully.');
      }
      setFormData({ block: '', floor: '', room_type: '1-Seater' });
      await load();
    } catch (err) { setError(err.message || 'Operation failed.'); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try { await deleteRoom(confirmDelete.id); setSubmitMessage('Room deleted.'); await load(); }
    catch (err) { setError(err.message || 'Failed to delete room.'); }
    finally { setConfirmDelete(null); }
  };

  const getStatus = (occ, cap) => occ >= cap ? 'Full' : occ > 0 ? 'Partial' : 'Empty';

  const filtered = rooms.filter(r => {
    const status = getStatus(r.current_occupancy, r.max_capacity);
    const q = searchQuery.trim().toLowerCase();
    return (!q || r.block.toLowerCase().includes(q) || String(r.room_id).includes(q)) && (statusFilter === 'All' || status === statusFilter);
  });

  const totalCap = rooms.reduce((s, r) => s + Number(r.max_capacity || 0), 0);
  const totalOcc = rooms.reduce((s, r) => s + Number(r.current_occupancy || 0), 0);

  return (
    <section className="page-section">
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Confirm Delete</h3>
            <p className="modal-body">Delete Room <strong>#{confirmDelete.id}</strong> (Block {confirmDelete.block})? This cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-muted" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="page-head">
        <div>
          <h2 className="page-title">Rooms Management</h2>
          <p className="page-description">Create rooms and monitor occupancy with smart status indicators.</p>
        </div>
      </div>

      <div className="cards-grid">
        <article className="stat-card"><p className="label">Total Rooms</p><p className="value">{rooms.length}</p><p className="hint">Registered rooms</p></article>
        <article className="stat-card"><p className="label">Total Occupancy</p><p className="value">{totalOcc}</p><p className="hint">Current occupied beds</p></article>
        <article className="stat-card"><p className="label">Total Capacity</p><p className="value">{totalCap}</p><p className="hint">Maximum accommodation</p></article>
      </div>

      <div className="panel-grid" style={{ marginTop: '1rem' }}>
        <aside className="panel">
          <h3>{editingId ? 'Edit Room' : 'Add New Room'}</h3>
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
            <div className="form-btn-row">
              <button className="btn-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : editingId ? 'Update Room' : 'Add Room'}</button>
              {editingId && <button type="button" className="btn-muted" onClick={cancelEdit}>Cancel</button>}
            </div>
          </form>
        </aside>

        <div className="panel">
          <div className="tools-row" style={{ marginBottom: '0.75rem' }}>
            <button className="btn-ghost" onClick={load}>All Rooms</button>
            <button className="btn-ghost" onClick={() => loadEmptyRooms()}>Empty Rooms</button>
          </div>
          <form onSubmit={e => { e.preventDefault(); const p = new URLSearchParams(); if (filter.block) p.append('block', filter.block); if (filter.floor) p.append('floor', filter.floor); if (filter.occupancy) p.append('occupancy', filter.occupancy); loadEmptyRooms(p); }} className="tools-row">
            <input className="input" type="text" placeholder="Block" value={filter.block} onChange={e => setFilter(p => ({ ...p, block: e.target.value }))} />
            <input className="input" type="number" placeholder="Floor" value={filter.floor} onChange={e => setFilter(p => ({ ...p, floor: e.target.value }))} />
            <button className="btn-ghost" type="submit">Search Empty</button>
          </form>
          <div className="tools-row">
            <input className="input" type="text" placeholder="Search by Room ID or Block" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            <select className="select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Empty">Empty</option>
              <option value="Partial">Partial</option>
              <option value="Full">Full</option>
            </select>
          </div>

          {loading && <p className="notice">Loading rooms...</p>}
          {!loading && error && <p className="error">{error}</p>}
          {!loading && !error && filtered.length === 0 && <div className="empty-state"><p>No rooms match your current filters.</p></div>}

          {!loading && !error && filtered.length > 0 && (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr><th>Room ID</th><th>Block</th><th>Floor</th><th>Type</th><th>Occupancy</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.map(r => {
                    const status = getStatus(r.current_occupancy, r.max_capacity);
                    const badge = status === 'Full' ? 'danger' : status === 'Partial' ? 'warn' : 'success';
                    const pct = r.max_capacity > 0 ? (r.current_occupancy / r.max_capacity) * 100 : 0;
                    return (
                      <tr key={r.room_id}>
                        <td>{r.room_id}</td>
                        <td><strong>{r.block}</strong></td>
                        <td>{r.floor}</td>
                        <td>{r.room_type}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>{r.current_occupancy}/{r.max_capacity}</span>
                            <div className="occ-bar"><div className={`occ-fill occ-${badge}`} style={{ width: `${pct}%` }} /></div>
                          </div>
                        </td>
                        <td><span className={`badge ${badge}`}>{status}</span></td>
                        <td>
                          <div className="action-btns">
                            <button className="btn-icon btn-edit" title="Edit" onClick={() => startEdit(r)}>✏️</button>
                            <button className="btn-icon btn-del" title="Delete" onClick={() => setConfirmDelete({ id: r.room_id, block: r.block })}>🗑️</button>
                          </div>
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
