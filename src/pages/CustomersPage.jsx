import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import useInventoryStore from '../../stores/inventoryStore';

const CustomerForm = ({ open, handleClose, customerToEdit }) => {
  const addCustomer = useInventoryStore((state) => state.addCustomer);
  const updateCustomer = useInventoryStore((state) => state.updateCustomer);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    if (customerToEdit) {
      setFormData({
        name: customerToEdit.name || '',
        phone: customerToEdit.phone || '',
        email: customerToEdit.email || '',
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
      });
    }
  }, [customerToEdit, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (customerToEdit) {
      updateCustomer(customerToEdit.id, formData);
    } else {
      addCustomer(formData);
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{customerToEdit ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Customer Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="phone"
                label="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                margin="dense"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {customerToEdit ? 'Save Changes' : 'Add Customer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CustomerForm;
