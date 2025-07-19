import React from 'react';
import { Typography, Box } from '@mui/material';
import { useInventoryData } from '../../hooks/useInventoryData';

const ProductTable = () => {
  const { data: products = [], isLoading, isError } = useInventoryData();

  if (isLoading) {
    return <Typography>Testing data fetch on Products page...</Typography>;
  }

  if (isError) {
    return <Typography color="error">Data fetch failed on this page with a CORS error.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4">Diagnostic Test Passed!</Typography>
      <Typography>Successfully loaded {products.length} products on this page.</Typography>
    </Box>
  );
};

export default ProductTable;