import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import DashboardLayout from './components/layout/DashboardLayout'; // 1. Import Layout หลัก

function App() {
  return (
    <Router>
      {/* 2. เรียกใช้ DashboardLayout เพื่อให้เป็นกรอบของทุกหน้า */}
      <DashboardLayout>
        {/* 3. AppRoutes จะทำหน้าที่สลับเนื้อหาไปตาม URL */}
        <AppRoutes />
      </DashboardLayout>
    </Router>
  );
}

export default App;
