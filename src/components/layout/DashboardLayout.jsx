import React, { useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, Drawer, AppBar, Toolbar, IconButton, CssBaseline } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Dashboard, Inventory, Receipt, Assessment, Group, Menu as MenuIcon } from '@mui/icons-material';

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
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Typography variant="h6" component="h1">Inventory</Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={mobileOpen ? handleDrawerToggle : null} // ปิดเมนูเมื่อคลิกบนมือถือ
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
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }} // แสดงปุ่มนี้เฉพาะบนจอมือถือ
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>
        </Toolbar>
      </AppBar>
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
          p: { xs: 2, sm: 3 }, // ปรับ padding ให้เหมาะกับมือถือ
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar /> {/* เพิ่ม Toolbar فاضيเพื่อดันเนื้อหาลงมาไม่ให้ถูก Header บัง */}
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;