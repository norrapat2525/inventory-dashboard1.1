import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
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
  Container,
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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleMobileMenuClose();
  };

  const currentMenuItem = menuItems.find(item => item.path === location.pathname);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden', // ป้องกันเลื่อนซ้าย-ขวา
      }}
    >
      {/* Top Navigation Bar */}
      <AppBar 
        position="sticky" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: 'primary.main',
          width: '100%',
        }}
      >
        <Toolbar 
          sx={{ 
            minHeight: { xs: 56, sm: 64 }, // ความสูงที่เหมาะสมกับมือถือ
            px: { xs: 1, sm: 2 }, // Padding ที่เหมาะสม
          }}
        >
          {/* Logo/Title */}
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="div" 
            sx={{ 
              flexGrow: isMobile ? 1 : 0,
              mr: isMobile ? 0 : 4,
              fontWeight: 'bold',
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {isMobile ? 'Inventory' : 'Inventory Dashboard'}
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
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
                    fontSize: { sm: '0.75rem', md: '0.875rem' },
                    px: { sm: 1, md: 2 },
                    minWidth: 'auto',
                    whiteSpace: 'nowrap',
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
              sx={{ ml: 1 }}
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
            width: { xs: '100%', sm: 280 }, // เต็มหน้าจอบนมือถือ
            maxWidth: '100vw',
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ pt: 2, width: '100%' }}>
          <Typography variant="h6" sx={{ px: 2, mb: 1, fontWeight: 'bold' }}>
            Navigation
          </Typography>
          <Divider />
          <List sx={{ width: '100%' }}>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigate(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    mb: 0.5,
                    py: 2, // เพิ่มความสูงให้กดง่ายบนมือถือ
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{
                      fontSize: '1.1rem', // ขนาดตัวอักษรใหญ่ขึ้นบนมือถือ
                    }}
                  />
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
          width: '100%',
          maxWidth: '100vw', // ไม่ให้เกินความกว้างหน้าจอ
          overflow: 'hidden', // ป้องกันเลื่อนซ้าย-ขวา
          backgroundColor: '#f4f6f8',
          minHeight: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
        }}
      >
        {/* Container สำหรับจัดการ responsive */}
        <Container 
          maxWidth={false}
          sx={{ 
            p: { xs: 1, sm: 2, md: 3 },
            width: '100%',
            maxWidth: '100%',
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
              width: '100%',
            }}>
              {currentMenuItem.icon}
              <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                {currentMenuItem.text}
              </Typography>
            </Box>
          )}
          
          {/* Children Content */}
          <Box sx={{ width: '100%', overflow: 'hidden' }}>
            {children}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;