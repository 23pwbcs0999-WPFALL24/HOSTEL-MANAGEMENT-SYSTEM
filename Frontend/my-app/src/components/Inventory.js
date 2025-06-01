import React, { useEffect, useState } from 'react';
import { fetchInventory, addInventoryItem } from '../api/api';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      const data = await fetchInventory();
      setItems(data);
    } catch (err) {
      setError('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { room_id, item_name, item_condition, last_checked_date } = form;

    if (!room_id || !item_name || !item_condition || !last_checked_date) {
      setFormError('All fields are required');
      return;
    }

    try {
      const res = await addInventoryItem(form);
      setItems([...items, res.item]);
      setForm({
        room_id: '',
        item_name: '',
        item_condition: 'Good',
        last_checked_date: ''
      });
      setFormError(null);
    } catch (err) {
      setFormError('Failed to add item. Please try again.');
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

      {/* ✅ Always show the form */}
      <form className="form" onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <h3>Add New Inventory Item</h3>
        {formError && <p className="error">{formError}</p>}
        <input
          type="number"
          name="room_id"
          value={form.room_id}
          onChange={handleChange}
          placeholder="Room ID"
          required
        />
        <input
          type="text"
          name="item_name"
          value={form.item_name}
          onChange={handleChange}
          placeholder="Item Name"
          required
        />
        <select name="item_condition" value={form.item_condition} onChange={handleChange}>
          <option value="Good">Good</option>
          <option value="Damaged">Damaged</option>
          <option value="Need Repair">Need Repair</option>
        </select>
        <input
          type="date"
          name="last_checked_date"
          value={form.last_checked_date}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Item</button>
      </form>
    </section>
  );
};

export default Inventory;
