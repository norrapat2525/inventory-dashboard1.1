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
    if (productToEdit) {
      // FIX: แก้ไขการตั้งค่าข้อมูลให้ปลอดภัยขึ้น
      // โดยใช้ String() และ Nullish Coalescing Operator (??) เพื่อป้องกัน error
      // ถ้าค่าเป็น null หรือ undefined จะใช้ค่าว่าง ('') แทน
      setFormData({
        name: productToEdit.name || '',
        category: productToEdit.category || '',
        quantity: String(productToEdit.quantity ?? ''),
        price: String(productToEdit.price ?? ''),
        lowStockThreshold: String(productToEdit.lowStockThreshold ?? ''),
      });
    } else {
      // สำหรับการเพิ่มสินค้าใหม่
      setFormData({
        name: '',
        category: '',
        quantity: '',
        price: '',
        lowStockThreshold: '5', // ใส่ค่าเริ่มต้น
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
