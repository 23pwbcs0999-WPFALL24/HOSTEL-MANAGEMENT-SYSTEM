// import React from 'react';

// const Home = () => {
//   return (
//     <section className="page-section">
//       <h2>Welcome to the Room Allocation System</h2>
//       <p>
//         Manage rooms, students, allocations, inventory, and visitors efficiently using this system.
//       </p>
//       <p>Use the navigation links above to get started.</p>
//     </section>
//   );
// };

// export default Home;
import React from 'react';

const Home = () => {
  return (
    <section className="page-section max-w-3xl mx-auto p-8 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg shadow-lg text-center">
      <h2 className="text-4xl font-extrabold text-indigo-700 mb-6">
        Welcome to the Hostel Management System
      </h2>
      <p className="text-lg text-gray-700 mb-4">
        Manage rooms, students, allocations, inventory, and visitors efficiently using this system.
      </p>
      <p className="text-md text-gray-600">
        Use the navigation links above to get started.
      </p>
    </section>
  );
};

export default Home;
