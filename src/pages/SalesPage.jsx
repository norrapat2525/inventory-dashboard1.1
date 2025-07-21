import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
} from '@mui/material';
import { ShoppingCart, Add } from '@mui/icons-material';
import useInventoryStore from '../stores/inventoryStore'; 
import SalesForm from '../components/sales/SalesForm';

const SalesPage = () => {
  // ดึงข้อมูลจาก Store
  const getSafeCustomers = useInventoryStore((state) => state.getSafeCustomers);
  const getSafeProducts = useInventoryStore((state) => state.getSafeProducts);
  const sales = useInventoryStore((state) => state.sales || []);
  
  // ตรวจสอบสถานะความพร้อม
  const isClient = useInventoryStore((state) => state._isClient);
  const isHydrated = useInventoryStore((state) => state._isHydrated);
  
  // State ของหน้า
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // รอให้ Store พร้อมแล้วค่อยดึงข้อมูล
  useEffect(() => {
    if (isClient && isHydrated) {
      try {
        const safeCustomers = getSafeCustomers();
        const safeProducts = getSafeProducts();
        setCustomers(safeCustomers);
        setProducts(safeProducts);
      } catch (error) {
        console.error('Error loading data:', error);
        setCustomers([]);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isClient, isHydrated, getSafeCustomers, getSafeProducts]);

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  if (isLoading || !isClient || !isHydrated) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading sales data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">
            Sales Orders ({sales.length} orders)
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleOpenForm}
            startIcon={<ShoppingCart />}
          >
            Create New Sale
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Available Customers
              </Typography>
              <Typography variant="h4">
                {customers.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Available Products
              </Typography>
              <Typography variant="h4">
                {products.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Sales Today
              </Typography>
              <Typography variant="h4">
                ${sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Sales */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Sales
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {sales.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="textSecondary">
              No sales yet
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Create your first sale order to get started
            </Typography>
            <Button 
              variant="outlined" 
              onClick={handleOpenForm}
              startIcon={<Add />}
            >
              Create First Sale
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {sales.slice(0, 6).map((sale) => (
              <Grid item xs={12} md={6} key={sale.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                      <Typography variant="h6">
                        Sale #{sale.id}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        ${sale.totalAmount?.toLocaleString() || 0}
                      </Typography>
                    </Box>
                    <Typography color="textSecondary" gutterBottom>
                      Customer: {sale.customerName || 'Walk-in'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Date: {sale.date}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Items: {sale.items?.length || 0} products
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Sales Form Modal */}
      <SalesForm 
        open={isFormOpen} 
        handleClose={handleCloseForm}
        customers={customers}
        products={products}
      />
    </Box>
  );
};

export default SalesPage;