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

  // FIX: แก้ไข dependency array ให้เป็น []
  // เพื่อให้ useEffect ทำงานแค่ครั้งเดียวตอนที่คอมโพเนนต์โหลดขึ้นมาครั้งแรกเท่านั้น
  useEffect(() => {
    fetchInitialData();
  }, []); // <--- แก้ไขตรงนี้

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
