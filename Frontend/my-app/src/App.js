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
    <div className="app-shell">
      <Header />
      <main className="app-container page-wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room" element={<Rooms />} />
          <Route path="/students" element={<Students />} />
          <Route path="/allocations" element={<Allocations />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/visitors" element={<Visitors />} />
          <Route
            path="*"
            element={(
              <section className="page-section">
                <h2>404 - Page Not Found</h2>
                <p>This route does not exist. Please use the navigation bar to continue.</p>
              </section>
            )}
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;

