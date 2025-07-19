// src/components/layout/DashboardLayout.jsx
import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Navigation from '../navigation/Navigation';

const DashboardLayout = ({ children }) => {
  return (
    <Box>
      <Header />
      <Navigation />
      <Box component="main" sx={{ p: 3, backgroundColor: '#f4f6f8', minHeight: 'calc(100vh - 113px)' }}>
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;