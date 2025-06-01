const API_BASE = 'http://localhost:5000'; // Backend server URL

// Helper to handle fetch and parse JSON with error handling
async function fetchJson(url, options = {}) {
  const response = await fetch(API_BASE + url, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// --- Room APIs ---
export async function fetchRooms() {
  return await fetchJson('/api/rooms');
}

export async function createRoom(roomData) {
  return await fetchJson('/api/rooms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(roomData)
  });
}

// --- Student APIs ---
export async function fetchStudents() {
  return await fetchJson('/api/students');
}

export async function fetchUnallocatedStudents() {
  return await fetchJson('/api/students/unallocated');
}

export async function createStudent(studentData) {
  return await fetchJson('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData)
  });
}

// --- Allocation APIs ---
export async function fetchAllocations() {
  return await fetchJson('/api/allocations');
}

export async function createAllocation(allocationData) {
  return await fetchJson('/api/allocations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(allocationData)
  });
}

// --- Inventory APIs ---
export async function fetchInventory() {
  return await fetchJson('/api/inventory');
}

export async function addInventoryItem(itemData) {
  return await fetchJson('/api/inventory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemData)
  });
}

// --- Visitor APIs ---
export async function fetchVisitors() {
  return await fetchJson('/api/visitors');
}
