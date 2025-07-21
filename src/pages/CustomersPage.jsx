import React, { useState, useEffect } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

// Dynamic import - Component จริงจะโหลดแค่ใน Client เท่านั้น
const DynamicCustomersContent = React.lazy(() => 
  import('./CustomersContent').then(module => ({
    default: module.default
  }))
);

const CustomersPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // รอให้แน่ใจว่าอยู่ในฝั่ง Client แล้ว
    setIsClient(true);
  }, []);

  // ถ้ายังไม่ได้อยู่ในฝั่ง Client ให้แสดง Loading
  if (!isClient) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh',
        flexDirection: 'column' 
      }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading customers...</Typography>
      </Box>
    );
  }

  // เมื่ออยู่ในฝั่ง Client แล้ว จึงโหลด Component จริง
  return (
    <React.Suspense 
      fallback={
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '80vh',
          flexDirection: 'column' 
        }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading customers...</Typography>
        </Box>
      }
    >
      <DynamicCustomersContent />
    </React.Suspense>
  );
};

export default CustomersPage;