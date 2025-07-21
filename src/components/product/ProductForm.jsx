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

const ProductForm = ({ open, handleClose, productToEdit }) => {
  const addProduct = useInventoryStore((state) => state.addProduct);
  const updateProduct = useInventoryStore((state) => state.updateProduct);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    price: '',
    lowStockThreshold: '',
  });

  useEffect(() => {
    // ถ้ามี productToEdit (โหมดแก้ไข) ให้ตั้งค่าข้อมูลในฟอร์ม
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        category: productToEdit.category,
        quantity: productToEdit.quantity.toString(),
        price: productToEdit.price.toString(),
        lowStockThreshold: productToEdit.lowStockThreshold.toString(),
      });
    } else {
      // ถ้าไม่มี (โหมดเพิ่มใหม่) ให้ล้างฟอร์ม
      setFormData({
        name: '',
        category: '',
        quantity: '',
        price: '',
        lowStockThreshold: '5', // ค่าเริ่มต้น
      });
    }
  }, [productToEdit, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
        ...formData,
        quantity: Number(formData.quantity) || 0,
        price: Number(formData.price) || 0,
        lowStockThreshold: Number(formData.lowStockThreshold) || 0,
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, productData);
    } else {
      addProduct(productData);
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{productToEdit ? 'Edit Product' : 'Add New Product'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Product Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="category"
                label="Category"
                value={formData.category}
                onChange={handleChange}
                fullWidth
                required
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="quantity"
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                fullWidth
                required
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label="Price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                required
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="lowStockThreshold"
                label="Low Stock Threshold"
                type="number"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                fullWidth
                required
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
            {productToEdit ? 'Save Changes' : 'Add Product'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductForm;
