import React, { useEffect, useState, useCallback } from 'react';
import { fetchInventory, addInventoryItem } from '../api/api';

// Inventory management component
const Inventory = () => {
  // State for inventory items
  const [items, setItems] = useState([]);
  // State for loading and error messages
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for add item form
  const [form, setForm] = useState({
    room_id: '',
    item_name: '',
    item_condition: 'Good',
    last_checked_date: ''
  });
  const [formError, setFormError] = useState(null);

  // State for filter form inputs
  const [filterInputs, setFilterInputs] = useState({
    room_id: '',
    item_condition: '',
    from_date: '',
    to_date: ''
  });

  // State for applied filters
  const [filters, setFilters] = useState({
    room_id: '',
    item_condition: '',
    from_date: '',
    to_date: ''
  });

  // Load inventory items from backend (with filters)
  const loadInventory = useCallback(async () => {
    setLoading(true);
    try {
      // Equivalent SQL:
      // SELECT * FROM inventories
      // WHERE
      //   (room_id = ?) AND
      //   (item_condition = ?) AND
      //   (last_checked_date BETWEEN ? AND ?)
      // The actual WHERE clause depends on which filters are set.
      const { data } = await fetchInventory(filters);
      setItems(data);
    } catch (err) {
      setError('Failed to load inventory');
      console.error("Load inventory error:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Load inventory when filters change or on mount
  useEffect(() => {
    loadInventory();
  }, [loadInventory]); // <-- add loadInventory as dependency

  // Handle add item form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle filter form input changes
  const handleFilterChange = (e) => {
    setFilterInputs({ ...filterInputs, [e.target.name]: e.target.value });
  };

  // Apply filters to inventory list
  const applyFilters = () => {
    // Equivalent SQL:
    // SELECT * FROM inventories WHERE ... (based on filterInputs)
    setFilters(filterInputs);
  };

  // Clear all filters
  const clearFilters = () => {
    // Equivalent SQL:
    // SELECT * FROM inventories
    // (no WHERE clause, returns all inventory items)
    const cleared = {
      room_id: '',
      item_condition: '',
      from_date: '',
      to_date: ''
    };
    setFilterInputs(cleared);
    setFilters(cleared);
  };

  // Handle add inventory item form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    // Simple validation
    if (!form.room_id || !form.item_name || !form.last_checked_date) {
      setFormError('All fields are required');
      setIsSubmitting(false);
      return;
    }

    if (isNaN(form.room_id)) {
      setFormError('Room ID must be a number');
      setIsSubmitting(false);
      return;
    }

    try {
      // Format date for backend
      const formattedDate = new Date(form.last_checked_date).toISOString().split('T')[0];
      
      // Add item to backend
      const { data } = await addInventoryItem({
        ...form,
        last_checked_date: formattedDate
      });

      // Add new item to local state
      setItems([...items, data]);
      // Reset form
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

      {/* Show loading or error messages */}
      {loading && <p>Loading inventory...</p>}
      {error && <p className="error">{error}</p>}

      {/* Filter Section */}
      <div className="filter-section">
        <h3>Filter Inventory</h3>

        {/* Filter by Room ID */}
        <div className="form-group">
          <label htmlFor="room_id">Room ID</label>
          <input
            type="number"
            id="room_id"
            name="room_id"
            value={filterInputs.room_id}
            onChange={handleFilterChange}
            placeholder="Room ID"
          />
        </div>

        {/* Filter by Condition */}
        <div className="form-group">
          <label htmlFor="item_condition">Condition</label>
          <select 
            id="item_condition"
            name="item_condition" 
            value={filterInputs.item_condition} 
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="Good">Good</option>
            <option value="Damaged">Damaged</option>
            <option value="Need Repair">Need Repair</option>
          </select>
        </div>

        {/* Filter by Date Range */}
        <div className="form-group">
          <label htmlFor="from_date">From Date</label>
          <input
            type="date"
            id="from_date"
            name="from_date"
            value={filterInputs.from_date}
            onChange={handleFilterChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="to_date">To Date</label>
          <input
            type="date"
            id="to_date"
            name="to_date"
            value={filterInputs.to_date}
            onChange={handleFilterChange}
          />
        </div>

        {/* Filter buttons */}
        <button onClick={applyFilters} type="button" style={{ marginRight: '0.5rem' }}>
          Apply Filters
        </button>
        <button onClick={clearFilters} type="button">
          Clear Filters
        </button>
      </div>

      {/* Inventory List */}
      {!loading && !error && items.length > 0 && (
        <ul className="list">
          {/* Show each inventory item */}
          {items.map((item) => (
            <li key={item.item_id}>
              Room: {item.room_id} — {item.item_name} — Condition: {item.item_condition} — Last Checked:{" "}
              {new Date(item.last_checked_date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}

      {/* Show message if no items */}
      {!loading && !error && items.length === 0 && (
        <p>No inventory items available.</p>
      )}

      {/* Add Inventory Item Form */}
      <form className="form" onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <h3>Add New Inventory Item</h3>
        {formError && <p className="error">{formError}</p>}
        
        {/* Room ID input */}
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

        {/* Item Name input */}
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

        {/* Condition select */}
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

        {/* Last Checked Date input */}
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

        {/* Submit button */}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Item'}
        </button>
      </form>
    </section>
  );
};

export default Inventory;
