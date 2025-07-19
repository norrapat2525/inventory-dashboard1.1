import React from 'react';
import { Tabs, Tab, AppBar, Toolbar, Typography } from '@mui/material';
import { Dashboard, List, Assessment } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const TabNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const getTabValue = () => {
        switch (location.pathname) {
            case '/overview': return 0;
            case '/products': return 1;
            case '/reports': return 2;
            default: return 0;
        }
    };

    const handleTabChange = (event, newValue) => {
        switch (newValue) {
            case 0: navigate('/overview'); break;
            case 1: navigate('/products'); break;
            case 2: navigate('/reports'); break;
            default: break;
        }
    };

    return (
        <AppBar position="static" elevation={0}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Inventory Dashboard v1.1
                </Typography>
                <Tabs
                    value={getTabValue()}
                    onChange={handleTabChange}
                    textColor="inherit"
                    indicatorColor="secondary"
                >
                    <Tab icon={<Dashboard />} label="Overview" />
                    <Tab icon={<List />} label="Product List" />
                    <Tab icon={<Assessment />} label="Reports" />
                </Tabs>
            </Toolbar>
        </AppBar>
    );
};

export default TabNavigation;