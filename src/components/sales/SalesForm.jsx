import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Divider,
  Alert,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import useInventoryStore from '../../stores/inventoryStore';

const SalesForm = ({ open, handleClose, customers = [], products = [] }) => {
  const createSaleOrder = useInventoryStore((state) => state.createSaleOrder);

  // Form State
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState('paid'); // paid, pending, partial
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setSelectedCustomer('');
      setSelectedItems([]);
      setPaymentStatus('paid');
      setNotes('');
      setErrors({});
    }
  }, [open]);

  // คำนวณยอดรวม
  const totalAmount = selectedItems.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    const price = product ? product.price : 0;
    return sum + (price * item.quantity);
  }, 0);

  // เพิ่มสินค้าใหม่ในรายการ
  const addItem = () => {
    const newItem = {
      id: Date.now(),
      productId: '',
      quantity: 1,
    };
    setSelectedItems([...selectedItems, newItem]);
  };

  // ลบสินค้าออกจากรายการ
  const removeItem = (itemId) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  // อัปเดตข้อมูลสินค้าในรายการ
  const updateItem = (itemId, field, value) => {
    setSelectedItems(selectedItems.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    ));
  };

  // ตรวจสอบสต็อกที่เพียงพอ
  const validateStock = () => {
    const stockErrors = {};
    selectedItems.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product && item.quantity > product.quantity) {
        stockErrors[item.id] = `Available stock: ${product.quantity}`;
      }
    });
    return stockErrors;
  };

  // ตรวจสอบความถูกต้องของฟอร์ม
  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedCustomer) {
      newErrors.customer = 'Please select a customer';
    }
    
    if (selectedItems.length === 0) {
      newErrors.items = 'Please add at least one item';
    }
    
    selectedItems.forEach(item => {
      if (!item.productId) {
        newErrors[`product_${item.id}`] = 'Please select a product';
      }
      if (item.quantity <= 0) {
        newErrors[`quantity_${item.id}`] = 'Quantity must be greater than 0';
      }
    });

    const stockErrors = validateStock();
    Object.assign(newErrors, stockErrors);
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // จัดเตรียมข้อมูลสำหรับบันทึก
  const prepareSaleData = () => {
    const customer = customers.find(c => c.id === selectedCustomer);
    const itemsWithDetails = selectedItems.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        productName: product?.name || '',
        quantity: item.quantity,
        price: product?.price || 0,
      };
    });

    return {
      customerId: selectedCustomer,
      customerName: customer?.name || '',
      items: itemsWithDetails,
      totalAmount: totalAmount,
      paymentStatus: paymentStatus,
      notes: notes,
    };
  };

  // บันทึกการขาย
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    try {
      const saleData = prepareSaleData();
      createSaleOrder(saleData);
      handleClose();
    } catch (error) {
      console.error('Error creating sale order:', error);
      setErrors({ general: 'Error creating sale order. Please try again.' });
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Create New Sale Order</DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          
          {/* Error Alert */}
          {errors.general && (
            <Alert severity="error">{errors.general}</Alert>
          )}
          
          {/* Customer Selection */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Customer Information
            </Typography>
            <TextField
              select
              label="Select Customer"
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              fullWidth
              error={!!errors.customer}
              helperText={errors.customer}
            >
              <MenuItem value="">-- Select Customer --</MenuItem>
              {customers.map((customer) => (
                <MenuItem key={customer.id} value={customer.id}>
                  {customer.name} ({customer.phone})
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Divider />

          {/* Items Selection */}
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Items ({selectedItems.length})
              </Typography>
              <Button
                startIcon={<Add />}
                onClick={addItem}
                variant="outlined"
              >
                Add Item
              </Button>
            </Box>

            {errors.items && (
              <Alert severity="error" sx={{ mb: 2 }}>{errors.items}</Alert>
            )}

            {selectedItems.map((item, index) => (
              <Card key={item.id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="body2" sx={{ minWidth: 20 }}>
                      #{index + 1}
                    </Typography>
                    
                    <TextField
                      select
                      label="Product"
                      value={item.productId}
                      onChange={(e) => updateItem(item.id, 'productId', e.target.value)}
                      sx={{ flex: 1 }}
                      error={!!errors[`product_${item.id}`]}
                      helperText={errors[`product_${item.id}`]}
                    >
                      <MenuItem value="">-- Select Product --</MenuItem>
                      {products.filter(p => p.quantity > 0).map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                          {product.name} (Stock: {product.quantity}) - ${product.price}
                        </MenuItem>
                      ))}
                    </TextField>

                    <Box display="flex" alignItems="center" gap={1}>
                      <IconButton
                        onClick={() => updateItem(item.id, 'quantity', Math.max(1, item.quantity - 1))}
                        size="small"
                      >
                        <Remove />
                      </IconButton>
                      
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        sx={{ width: 80 }}
                        inputProps={{ min: 1 }}
                        error={!!errors[`quantity_${item.id}`] || !!errors[item.id]}
                        helperText={errors[`quantity_${item.id}`] || errors[item.id]}
                      />
                      
                      <IconButton
                        onClick={() => updateItem(item.id, 'quantity', item.quantity + 1)}
                        size="small"
                      >
                        <Add />
                      </IconButton>
                    </Box>

                    <Typography variant="body2" sx={{ minWidth: 80, textAlign: 'right' }}>
                      ${((products.find(p => p.id === item.productId)?.price || 0) * item.quantity).toLocaleString()}
                    </Typography>

                    <IconButton
                      onClick={() => removeItem(item.id)}
                      color="error"
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}

            {selectedItems.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                <Typography>No items added yet</Typography>
                <Button onClick={addItem} sx={{ mt: 1 }}>
                  Add First Item
                </Button>
              </Box>
            )}
          </Box>

          <Divider />

          {/* Payment & Notes */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment & Notes
            </Typography>
            <Box display="flex" gap={2} mb={2}>
              <TextField
                select
                label="Payment Status"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="partial">Partial</MenuItem>
              </TextField>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" color="primary" sx={{ textAlign: 'right' }}>
                  Total: ${totalAmount.toLocaleString()}
                </Typography>
              </Box>
            </Box>

            <TextField
              label="Notes (Optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
              multiline
              rows={2}
              placeholder="Additional notes or comments..."
            />
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={selectedItems.length === 0 || !selectedCustomer}
        >
          Create Sale Order (${totalAmount.toLocaleString()})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SalesForm;