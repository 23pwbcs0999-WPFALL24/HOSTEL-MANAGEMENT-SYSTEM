const API_BASE_URL = process.env.REACT_APP_API_BASE || '';

async function fetchJson(url, options = {}) {
  const response = await fetch(API_BASE_URL + url, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `HTTP error ${response.status}`);
  }
  return response.json();
}

// --- Room APIs ---
export const fetchRooms = () => fetchJson('/api/rooms');
export const createRoom = (data) => fetchJson('/api/rooms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
export const updateRoom = (id, data) => fetchJson(`/api/rooms/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
export const deleteRoom = (id) => fetchJson(`/api/rooms/${id}`, { method: 'DELETE' });

// --- Student APIs ---
export const fetchStudents = () => fetchJson('/api/students');
export const fetchUnallocatedStudents = () => fetchJson('/api/students/unallocated');
export const createStudent = (data) => fetchJson('/api/students', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
export const updateStudent = (id, data) => fetchJson(`/api/students/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
export const deleteStudent = (id) => fetchJson(`/api/students/${id}`, { method: 'DELETE' });

// --- Allocation APIs ---
export const fetchAllocations = () => fetchJson('/api/allocations');
export const createAllocation = (data) => fetchJson('/api/allocations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
export const deleteAllocation = (id) => fetchJson(`/api/allocations/${id}`, { method: 'DELETE' });

// --- Inventory APIs ---
export async function fetchInventory(filters = {}) {
  const params = new URLSearchParams();
  if (filters.room_id) params.append('room_id', filters.room_id);
  if (filters.item_condition) params.append('item_condition', filters.item_condition);
  if (filters.from_date) params.append('from_date', filters.from_date);
  if (filters.to_date) params.append('to_date', filters.to_date);
  return fetchJson('/api/inventory?' + params.toString());
}
export const addInventoryItem = (data) => fetchJson('/api/inventory', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
export const updateInventoryItem = (id, data) => fetchJson(`/api/inventory/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
export const deleteInventoryItem = (id) => fetchJson(`/api/inventory/${id}`, { method: 'DELETE' });

// --- Visitor APIs ---
export const fetchVisitors = () => fetchJson('/api/visitors');
export const createVisitor = (data) => fetchJson('/api/visitors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
export const updateVisitor = (id, data) => fetchJson(`/api/visitors/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
export const deleteVisitor = (id) => fetchJson(`/api/visitors/${id}`, { method: 'DELETE' });
