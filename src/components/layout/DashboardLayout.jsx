import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Dashboard, Inventory, Receipt, Assessment, Group } from '@mui/icons-material'; // 1. Import ไอคอน Group

const menuItems = [
  { text: 'Overview', icon: <Dashboard />, path: '/overview' },
  { text: 'Products', icon: <Inventory />, path: '/products' },
  // 2. เพิ่มเมนู Customers เข้าไปใน list
  { text: 'Customers', icon: <Group />, path: '/customers' },
  { text: 'Transactions', icon: <Receipt />, path: '/transactions' },
  { text: 'Reports', icon: <Assessment />, path: '/reports' },
];

const DashboardLayout = ({ children }) => {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          flexShrink: 0,
          bgcolor: 'background.paper',
          height: '100vh',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" component="h1">Inventory Dashboard</Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#f4f6f8' }}>
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
