import React, { useEffect } from 'react'; // 1. Import useEffect
import { BrowserRouter as Router } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import AppRoutes from './routes/AppRoutes';
import DashboardLayout from './components/layout/DashboardLayout';
import NotificationHandler from './components/common/NotificationHandler';
import useInventoryStore from './stores/inventoryStore'; // 2. Import Store เข้ามา

function App() {
  // 3. ดึงฟังก์ชันสำหรับดึงข้อมูลและสถานะ isLoading มาจาก Store
  const fetchInitialData = useInventoryStore((state) => state.fetchInitialData);
  const isLoading = useInventoryStore((state) => state.isLoading);

  // 4. ใช้ useEffect เพื่อสั่งให้ดึงข้อมูลแค่ครั้งเดียวเมื่อแอปเริ่มทำงาน
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // 5. ถ้ากำลังโหลดข้อมูล ให้แสดงหน้า Loading
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
        <Typography sx={{ ml: 2 }}>Loading Data...</Typography>
      </Box>
    );
  }

  // 6. เมื่อโหลดเสร็จแล้ว จึงแสดงแอปพลิเคชันทั้งหมด
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
