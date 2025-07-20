import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import LowStockAlert from '../dashboard/LowStockAlert'; // 1. Import คอมโพเนนต์ใหม่

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#ffffff', color: '#000000' }} elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Inventory Dashboard
        </Typography>
        <Box>
          {/* 2. นำคอมโพเนนต์แจ้งเตือนมาใช้งาน */}
          <LowStockAlert />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;