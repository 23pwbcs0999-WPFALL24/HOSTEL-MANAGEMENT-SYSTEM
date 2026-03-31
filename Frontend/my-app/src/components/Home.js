import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchAllocations,
  fetchInventory,
  fetchRooms,
  fetchStudents,
  fetchVisitors
} from '../api/api';

const Home = () => {
  const [dashboard, setDashboard] = useState({
    rooms: [],
    students: [],
    allocations: [],
    inventory: [],
    visitors: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [rooms, students, allocations, inventoryResponse, visitors] = await Promise.all([
          fetchRooms(),
          fetchStudents(),
          fetchAllocations(),
          fetchInventory(),
          fetchVisitors()
        ]);

        setDashboard({
          rooms: Array.isArray(rooms) ? rooms : [],
          students: Array.isArray(students) ? students : [],
          allocations: Array.isArray(allocations) ? allocations : [],
          inventory: Array.isArray(inventoryResponse?.data) ? inventoryResponse.data : [],
          visitors: Array.isArray(visitors) ? visitors : []
        });
      } catch (err) {
        setError(err.message || 'Unable to load dashboard details.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const capacity = dashboard.rooms.reduce((sum, room) => sum + Number(room.max_capacity || 0), 0);
    const occupancy = dashboard.rooms.reduce((sum, room) => sum + Number(room.current_occupancy || 0), 0);

    return {
      rooms: dashboard.rooms.length,
      students: dashboard.students.length,
      occupancy,
      capacity,
      allocations: dashboard.allocations.length,
      inventory: dashboard.inventory.length,
      visitors: dashboard.visitors.length
    };
  }, [dashboard]);

  return (
    <section className="page-section">
      <div className="hero">
        <h2>Hostel Operations, Unified in One Workspace</h2>
        <p>
          Track room occupancy, student onboarding, visitor activity, and inventory health from a single professional dashboard.
        </p>
        <div className="hero-tags">
          <span className="hero-tag">Live Data</span>
          <span className="hero-tag">Allocation Ready</span>
          <span className="hero-tag">Responsive Interface</span>
        </div>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="notice">Loading dashboard metrics...</p>}

      {!loading && (
        <>
          <div className="cards-grid">
            <article className="stat-card">
              <p className="label">Total Rooms</p>
              <p className="value">{stats.rooms}</p>
              <p className="hint">Across all hostel blocks</p>
            </article>
            <article className="stat-card">
              <p className="label">Registered Students</p>
              <p className="value">{stats.students}</p>
              <p className="hint">Active in system</p>
            </article>
            <article className="stat-card">
              <p className="label">Current Occupancy</p>
              <p className="value">
                {stats.occupancy}/{stats.capacity || 0}
              </p>
              <p className="hint">Occupied beds out of capacity</p>
            </article>
            <article className="stat-card">
              <p className="label">Total Allocations</p>
              <p className="value">{stats.allocations}</p>
              <p className="hint">Historical room assignments</p>
            </article>
            <article className="stat-card">
              <p className="label">Inventory Items</p>
              <p className="value">{stats.inventory}</p>
              <p className="hint">Managed items and condition checks</p>
            </article>
            <article className="stat-card">
              <p className="label">Visitor Entries</p>
              <p className="value">{stats.visitors}</p>
              <p className="hint">Recorded visits</p>
            </article>
          </div>

          <div className="link-grid">
            <Link className="quick-link" to="/room">Manage Rooms</Link>
            <Link className="quick-link" to="/students">Manage Students</Link>
            <Link className="quick-link" to="/allocations">Create Allocation</Link>
            <Link className="quick-link" to="/inventory">Update Inventory</Link>
            <Link className="quick-link" to="/visitors">Log Visitors</Link>
          </div>
        </>
      )}
    </section>
  );
};

export default Home;
