import React, { useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, Drawer, CssBaseline } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Dashboard, Inventory, Receipt, Assessment, Group } from '@mui/icons-material';
import Header from './Header'; // Import Header ใหม่

const drawerWidth = 240;

const menuItems = [
  { text: 'Overview', icon: <Dashboard />, path: '/overview' },
  { text: 'Products', icon: <Inventory />, path: '/products' },
  { text: 'Customers', icon: <Group />, path: '/customers' },
  { text: 'Transactions', icon: <Receipt />, path: '/transactions' },
  { text: 'Reports', icon: <Assessment />, path: '/reports' },
];

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <div>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" component="h1">Inventory</Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={() => setMobileOpen(false)} // ปิดเมนูเมื่อคลิกบนมือถือ
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header onDrawerToggle={handleDrawerToggle} />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* เมนูสำหรับมือถือ (เปิด-ปิดได้) */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        {/* เมนูสำหรับ Desktop (แสดงตลอดเวลา) */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* ส่วนเนื้อหาหลัก */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px', // เพิ่มระยะห่างจาก Header
          bgcolor: '#f4f6f8',
          minHeight: 'calc(100vh - 64px)'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;