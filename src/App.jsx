import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import DashboardLayout from './components/layout/DashboardLayout';
import NotificationHandler from './components/common/NotificationHandler'; // 1. Import เข้ามา
import './styles/mobile.css';
function App() {
  return (
    <Router>
      <DashboardLayout>
        <AppRoutes />
      </DashboardLayout>
      
      {/* 2. เพิ่ม NotificationHandler ไว้ตรงนี้ */}
      <NotificationHandler />
    </Router>
  );
}

export default App;
