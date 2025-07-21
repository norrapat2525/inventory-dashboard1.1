import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  TextField,
  Divider,
} from '@mui/material';
import { Edit, Delete, Phone, Email, Person } from '@mui/icons-material';
import useInventoryStore from '../stores/inventoryStore'; 
import CustomerForm from '../components/customers/CustomerForm';
import ConfirmationDialog from '../components/common/ConfirmationDialog';

const CustomersPage = () => {
  // ใช้ state ใน component แทนการดึงจาก Store โดยตรง
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // ดึงข้อมูลหลังจากที่ component mount แล้ว
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storeCustomers = useInventoryStore.getState().customers || [];
        setCustomers(storeCustomers);
      } catch (error) {
        console.error('Error loading customers:', error);
        setCustomers([]);
      } finally {
        setIsLoading(false);
      }
    }, 100); // รอ 100ms ให้ store พร้อม

    return () => clearTimeout(timer);
  }, []);

  // Subscribe การเปลี่ยนแปลงจาก Store
  useEffect(() => {
    const unsubscribe = useInventoryStore.subscribe(
      (state) => state.customers,
      (newCustomers) => {
        setCustomers(newCustomers || []);
      }
    );

    return unsubscribe;
  }, []);

  const deleteCustomer = useInventoryStore((state) => state.deleteCustomer);
  
  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Handlers
  const handleOpenForm = (customer = null) => {
    setCustomerToEdit(customer);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCustomerToEdit(null);
  };

  const handleOpenDeleteDialog = (customer) => {
    setCustomerToDelete(customer);
  };

  const handleCloseDeleteDialog = () => {
    setCustomerToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (customerToDelete) {
      deleteCustomer(customerToDelete.id);
      handleCloseDeleteDialog();
    }
  };

  // Filter customers
  const filteredCustomers = customers.filter(customer => 
    customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer?.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">Loading customers...</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">
            Customer List ({customers.length} customers)
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => handleOpenForm()}
            startIcon={<Person />}
          >
            Add New Customer
          </Button>
        </Box>

        {/* Search Bar */}
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search customers..."
          variant="outlined"
          size="small"
          fullWidth
        />
      </Box>

      {/* Customer Cards */}
      {filteredCustomers.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            {searchTerm ? 'No customers found matching your search' : 'No customers yet'}
          </Typography>
          {!searchTerm && (
            <Button 
              variant="outlined" 
              onClick={() => handleOpenForm()} 
              sx={{ mt: 2 }}
            >
              Add your first customer
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {filteredCustomers.map((customer) => (
            <Grid item xs={12} sm={6} md={4} key={customer.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                    <Typography variant="h6" component="div" noWrap>
                      {customer.name}
                    </Typography>
                    <Box>
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => handleOpenForm(customer)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleOpenDeleteDialog(customer)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ mb: 1 }} />
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <Phone fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {customer.phone}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center">
                    <Email fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {customer.email}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Customer Form Modal */}
      <CustomerForm 
        open={isFormOpen} 
        handleClose={handleCloseForm}
        customerToEdit={customerToEdit}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={!!customerToDelete}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the customer "${customerToDelete?.name}"?`}
      />
    </Box>
  );
};

export default CustomersPage;