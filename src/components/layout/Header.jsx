import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

const Header = ({ onDrawerToggle }) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - 240px)` },
        ml: { sm: `240px` },
        bgcolor: 'background.paper',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        color: 'text.primary'
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }} // แสดงปุ่มนี้เฉพาะบนจอมือถือ
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Inventory Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
