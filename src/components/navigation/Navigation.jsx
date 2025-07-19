// src/components/navigation/Navigation.jsx
import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { Dashboard, List, Assessment, Receipt } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathMap = ['/overview', '/products', '/transactions', '/reports'];
  const currentTab = pathMap.indexOf(location.pathname);

  const handleTabChange = (event, newValue) => {
    navigate(pathMap[newValue]);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Tabs
        value={currentTab === -1 ? 0 : currentTab}
        onChange={handleTabChange}
      >
        <Tab icon={<Dashboard />} label="Overview" />
        <Tab icon={<List />} label="Products" />
        <Tab icon={<Receipt />} label="Transactions" />
        <Tab icon={<Assessment />} label="Reports" />
      </Tabs>
    </Box>
  );
};

export default Navigation;