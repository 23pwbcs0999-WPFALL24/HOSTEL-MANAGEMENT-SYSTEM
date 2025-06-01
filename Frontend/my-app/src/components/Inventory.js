import React, { useEffect, useState } from 'react';
import { fetchInventory, addInventoryItem } from '../api/api';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    room_id: '',
    item_name: '',
    item_condition: 'Good',
    last_checked_date: ''
  });
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const { data } = await fetchInventory();
      setItems(data);
    } catch (err) {
      setError('Failed to load inventory');
      console.error("Load inventory error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    // Basic validation
    if (!form.room_id || !form.item_name || !form.last_checked_date) {
      setFormError('All fields are required');
      setIsSubmitting(false);
      return;
    }

    // Validate room_id is positive number
    if (isNaN(form.room_id)) {
      setFormError('Room ID must be a number');
      setIsSubmitting(false);
      return;
    }

    try {
      // Format date to YYYY-MM-DD
      const formattedDate = new Date(form.last_checked_date).toISOString().split('T')[0];
      
      const { data } = await addInventoryItem({
        ...form,
        last_checked_date: formattedDate
      });

      setItems([...items, data]);
      setForm({
        room_id: '',
        item_name: '',
        item_condition: 'Good',
        last_checked_date: ''
      });
    } catch (err) {
      console.error("Add item error:", err);
      setFormError(err.response?.data?.error || 'Failed to add item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-section">
      <h2>Inventory</h2>

      {loading && <p>Loading inventory...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && items.length > 0 && (
        <ul className="list">
          {items.map((item) => (
            <li key={item.item_id}>
              {item.item_name} — Condition: {item.item_condition} — Last Checked:{" "}
              {new Date(item.last_checked_date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}

      {!loading && !error && items.length === 0 && (
        <p>No inventory items available.</p>
      )}

      <form className="form" onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <h3>Add New Inventory Item</h3>
        {formError && <p className="error">{formError}</p>}
        
        <div className="form-group">
          <label htmlFor="room_id">Room ID</label>
          <input
            type="number"
            id="room_id"
            name="room_id"
            min="1"
            value={form.room_id}
            onChange={handleChange}
            placeholder="Room ID"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="item_name">Item Name</label>
          <input
            type="text"
            id="item_name"
            name="item_name"
            value={form.item_name}
            onChange={handleChange}
            placeholder="Item Name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="item_condition">Condition</label>
          <select 
            id="item_condition"
            name="item_condition" 
            value={form.item_condition} 
            onChange={handleChange}
          >
            <option value="Good">Good</option>
            <option value="Damaged">Damaged</option>
            <option value="Need Repair">Need Repair</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="last_checked_date">Last Checked Date</label>
          <input
            type="date"
            id="last_checked_date"
            name="last_checked_date"
            value={form.last_checked_date}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Item'}
        </button>
      </form>
    </section>
  );
};

export default Inventory;