import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import DashboardLayout from './components/layout/DashboardLayout'; // 1. Import the main Layout

function App() {
  return (
    <Router>
      {/* 2. Use DashboardLayout to frame every page */}
      <DashboardLayout>
        {/* 3. AppRoutes will handle switching content based on the URL */}
        <AppRoutes />
      </DashboardLayout>
    </Router>
  );
}

export default App;
