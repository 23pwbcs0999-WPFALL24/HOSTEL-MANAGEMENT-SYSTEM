import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Home from './components/Home';
import Rooms from './components/Room';
import Students from './components/Students';
import Allocations from './components/Allocations';
import Inventory from './components/Inventory';
import Visitors from './components/Visitors';

const App = () => {
  return (
    <>
      <Header />
      <main className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room" element={<Rooms />} />
          <Route path="/students" element={<Students />} />
          <Route path="/allocations" element={<Allocations />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/visitors" element={<Visitors />} />
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </main>
    </>
  );
};

export default App;

