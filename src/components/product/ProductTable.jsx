import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const ProductTable = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Product List - Test</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        This is a simple test to make sure the component works!
      </Typography>
      <Button variant="contained" color="primary">
        Test Button
      </Button>
    </Box>
  );
};

export default ProductTable;