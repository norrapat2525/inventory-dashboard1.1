import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import AppRoutes from './routes/AppRoutes';
import DashboardLayout from './components/layout/DashboardLayout';
import NotificationHandler from './components/common/NotificationHandler';
import useInventoryStore from './stores/inventoryStore';

function App() {
  const fetchInitialData = useInventoryStore((state) => state.fetchInitialData);
  const isLoading = useInventoryStore((state) => state.isLoading);

  // useEffect นี้จะทำงานแค่ครั้งเดียวตอนที่แอปเริ่มทำงาน
  // เพื่อสั่งให้ดึงข้อมูลทั้งหมดจาก Firebase
  useEffect(() => {
    fetchInitialData();
  }, []);

  // ถ้ากำลังโหลดข้อมูล ให้แสดงหน้า Loading
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Data from Cloud...</Typography>
      </Box>
    );
  }

  // เมื่อโหลดเสร็จแล้ว จึงแสดงแอปพลิเคชันทั้งหมด
  return (
    <Router>
      <DashboardLayout>
        <AppRoutes />
      </DashboardLayout>
      
      <NotificationHandler />
    </Router>
  );
}

export default App;
