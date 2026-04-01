import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { addInventoryItem, fetchInventory, fetchRooms } from '../api/api';

const initialForm = {
  room_id: '',
  item_name: '',
  item_condition: 'Good',
  last_checked_date: new Date().toISOString().split('T')[0]
};

const initialFilters = {
  room_id: '',
  item_condition: '',
  from_date: '',
  to_date: ''
};

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [conditionFilter, setConditionFilter] = useState('All');
  const [filterInputs, setFilterInputs] = useState(initialFilters);
  const [filters, setFilters] = useState(initialFilters);

  const loadInventory = useCallback(async () => {
    setLoading(true);
    try {
      const [inventoryResponse, roomResponse] = await Promise.all([
        fetchInventory(filters),
        fetchRooms()
      ]);

      const normalizedItems = Array.isArray(inventoryResponse)
        ? inventoryResponse
        : Array.isArray(inventoryResponse?.data)
          ? inventoryResponse.data
          : [];

      setItems(normalizedItems);
      setRooms(Array.isArray(roomResponse) ? roomResponse : []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load inventory.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const roomOptions = useMemo(() => {
    return rooms.map((room) => ({
      value: room.room_id,
      label: `Room ${room.room_id} | Block ${room.block} | Floor ${room.floor}`
    }));
  }, [rooms]);

  const displayedItems = useMemo(() => {
    if (conditionFilter === 'All') {
      return items;
    }

    return items.filter((item) => item.item_condition === conditionFilter);
  }, [conditionFilter, items]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFilterChange = (e) => {
    setFilterInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const applyFilters = () => {
    setFilters(filterInputs);
  };

  const clearFilters = () => {
    setFilterInputs(initialFilters);
    setFilters(initialFilters);
    setConditionFilter('All');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');

    if (!form.room_id || !form.item_name || !form.item_condition || !form.last_checked_date) {
      setFormError('All fields are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addInventoryItem({
        room_id: Number(form.room_id),
        item_name: form.item_name.trim(),
        item_condition: form.item_condition,
        last_checked_date: form.last_checked_date
      });

      setSuccess('Inventory item added successfully.');
      setForm(initialForm);
      await loadInventory();
    } catch (err) {
      setFormError(err.message || 'Failed to add item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-section">
      <div className="page-head">
        <div>
          <h2 className="page-title">Inventory Management</h2>
          <p className="page-description">Track room inventory health and update maintenance checks with confidence.</p>
        </div>
      </div>

      <div className="panel-grid" style={{ marginTop: '1rem' }}>
        <aside className="panel">
          <h3>Add Inventory Item</h3>
          {formError && <p className="error">{formError}</p>}
          {success && <p className="success">{success}</p>}

          <form className="form" onSubmit={handleSubmit}>
            <div>
              <label className="label" htmlFor="room_id">Room</label>
              <select id="room_id" className="select" name="room_id" value={form.room_id} onChange={handleChange} required>
                <option value="">Select Room</option>
                {roomOptions.map((room) => (
                  <option key={room.value} value={room.value}>{room.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label" htmlFor="item_name">Item Name</label>
              <input id="item_name" className="input" type="text" name="item_name" value={form.item_name} onChange={handleChange} placeholder="e.g., Study Chair" required />
            </div>

            <div className="input-row">
              <div>
                <label className="label" htmlFor="item_condition">Condition</label>
                <select id="item_condition" className="select" name="item_condition" value={form.item_condition} onChange={handleChange}>
                  <option value="Good">Good</option>
                  <option value="Damaged">Damaged</option>
                  <option value="Need Repair">Need Repair</option>
                </select>
              </div>
              <div>
                <label className="label" htmlFor="last_checked_date">Last Checked</label>
                <input
                  id="last_checked_date"
                  className="input"
                  type="date"
                  name="last_checked_date"
                  value={form.last_checked_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button className="btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Add Item'}
            </button>
          </form>
        </aside>

        <div className="panel">
          <div className="tools-row" style={{ marginBottom: '0.75rem' }}>
            <input
              className="input"
              type="number"
              name="room_id"
              placeholder="Filter by Room ID"
              value={filterInputs.room_id}
              onChange={handleFilterChange}
            />
            <select className="select" name="item_condition" value={filterInputs.item_condition} onChange={handleFilterChange}>
              <option value="">All Conditions</option>
              <option value="Good">Good</option>
              <option value="Damaged">Damaged</option>
              <option value="Need Repair">Need Repair</option>
            </select>
            <input className="input" type="date" name="from_date" value={filterInputs.from_date} onChange={handleFilterChange} />
            <input className="input" type="date" name="to_date" value={filterInputs.to_date} onChange={handleFilterChange} />
            <button type="button" className="btn-ghost" onClick={applyFilters}>Apply</button>
            <button type="button" className="btn-ghost" onClick={clearFilters}>Clear</button>
          </div>

          <div className="tools-row" style={{ marginBottom: '0.75rem' }}>
            <select className="select" value={conditionFilter} onChange={(e) => setConditionFilter(e.target.value)}>
              <option value="All">All Conditions (Local)</option>
              <option value="Good">Good</option>
              <option value="Damaged">Damaged</option>
              <option value="Need Repair">Need Repair</option>
            </select>
          </div>

          {loading && <p className="notice">Loading inventory...</p>}
          {!loading && error && <p className="error">{error}</p>}

          {!loading && !error && displayedItems.length === 0 && (
            <div className="empty-state">
              <p>No inventory items match this filter.</p>
            </div>
          )}

          {!loading && !error && displayedItems.length > 0 && (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Room</th>
                    <th>Condition</th>
                    <th>Last Checked</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedItems.map((item) => (
                    <tr key={item.item_id}>
                      <td>{item.item_name}</td>
                      <td>
                        Room {item.room_id}
                        {item.Room ? ` | Block ${item.Room.block} | Floor ${item.Room.floor}` : ''}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            item.item_condition === 'Good'
                              ? 'success'
                              : item.item_condition === 'Damaged'
                                ? 'danger'
                                : 'warn'
                          }`}
                        >
                          {item.item_condition}
                        </span>
                      </td>
                      <td>{new Date(item.last_checked_date).toLocaleDateString()}</td>
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

export default Inventory;
