import React from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';
import { Construction, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CustomersPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 500 }}>
        <Construction sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
        
        <Typography variant="h4" gutterBottom>
          Customer Management
        </Typography>
        
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Under Maintenance
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          We're working hard to bring you the best customer management experience. 
          This page is temporarily unavailable while we fix some technical issues.
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          In the meantime, you can continue using other features of the inventory system.
        </Typography>
        
        <Button 
          variant="contained" 
          startIcon={<ArrowBack />}
          onClick={() => navigate('/overview')}
        >
          Go to Dashboard
        </Button>
      </Paper>
    </Box>
  );
};

export default CustomersPage;