import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Inventory,
  Group,
  ShoppingCart,
  Receipt,
  Assessment,
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const menuItems = [
  { text: 'Overview', icon: <Dashboard />, path: '/overview' },
  { text: 'Products', icon: <Inventory />, path: '/products' },
  { text: 'Customers', icon: <Group />, path: '/customers' },
  { text: 'Sales', icon: <ShoppingCart />, path: '/sales' },
  { text: 'Transactions', icon: <Receipt />, path: '/transactions' },
  { text: 'Reports', icon: <Assessment />, path: '/reports' },
];

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // หน้าจอเล็กกว่า 900px
  const isTablet = useMediaQuery(theme.breakpoints.down('lg')); // หน้าจอเล็กกว่า 1200px

  // State สำหรับ Mobile Menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ฟังก์ชันปิด Mobile Menu
  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  // ฟังก์ชันไปหน้าใหม่ (สำหรับ Mobile)
  const handleNavigate = (path) => {
    navigate(path);
    handleMobileMenuClose();
  };

  // หาเมนูที่ active ปัจจุบัน
  const currentMenuItem = menuItems.find(item => item.path === location.pathname);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Navigation Bar */}
      <AppBar 
        position="sticky" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: 'primary.main',
        }}
      >
        <Toolbar>
          {/* Logo/Title */}
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="div" 
            sx={{ 
              flexGrow: isMobile ? 1 : 0,
              mr: isMobile ? 0 : 4,
              fontWeight: 'bold'
            }}
          >
            Inventory Dashboard
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', flexGrow: 1 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  color="inherit"
                  startIcon={item.icon}
                  sx={{
                    mx: 0.5,
                    borderRadius: 2,
                    backgroundColor: location.pathname === item.path ? 
                      'rgba(255, 255, 255, 0.15)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    fontSize: isTablet ? '0.8rem' : '0.875rem',
                    px: isTablet ? 1 : 2,
                  }}
                >
                  {isTablet ? '' : item.text}
                </Button>
              ))}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              edge="end"
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ pt: 2 }}>
          <Typography variant="h6" sx={{ px: 2, mb: 1, fontWeight: 'bold' }}>
            Navigation
          </Typography>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigate(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    mb: 0.5,
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          p: isMobile ? 1 : 3,
          backgroundColor: '#f4f6f8',
          minHeight: 'calc(100vh - 64px)', // ลบความสูงของ AppBar
        }}
      >
        {/* Breadcrumb สำหรับ Mobile */}
        {isMobile && currentMenuItem && (
          <Box sx={{ 
            mb: 2, 
            p: 2, 
            backgroundColor: 'white', 
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            boxShadow: 1,
          }}>
            {currentMenuItem.icon}
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
              {currentMenuItem.text}
            </Typography>
          </Box>
        )}
        
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;