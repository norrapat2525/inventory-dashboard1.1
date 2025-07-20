import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Grid } from '@mui/material';

const ProductForm = ({ onSubmit, onClose, productData }) => {
  // ถ้ามี productData (ข้อมูลสำหรับแก้ไข) ให้ใช้ค่านั้น, ถ้าไม่มีให้เป็นค่าว่าง (สำหรับเพิ่มใหม่)
  const [product, setProduct] = useState(
    productData || { name: '', category: '', stock: '', minStock: '', price: '' }
  );

  const isEditing = Boolean(productData); // ตรวจสอบว่าเป็นโหมดแก้ไขหรือไม่

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericProduct = {
        ...product,
        stock: Number(product.stock),
        minStock: Number(product.minStock),
        price: Number(product.price)
    };
    onSubmit(numericProduct);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, width: 400 }}>
      <Typography variant="h6" gutterBottom>
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </Typography>
      <Grid container spacing={2}>
        {/* ... (ส่วน TextField เหมือนเดิม) ... */}
        <Grid item xs={12}><TextField name="name" label="Product Name" value={product.name} onChange={handleChange} fullWidth required /></Grid>
        <Grid item xs={12}><TextField name="category" label="Category" value={product.category} onChange={handleChange} fullWidth required /></Grid>
        <Grid item xs={6}><TextField name="stock" label="Stock" type="number" value={product.stock} onChange={handleChange} fullWidth required /></Grid>
        <Grid item xs={6}><TextField name="minStock" label="Min Stock" type="number" value={product.minStock} onChange={handleChange} fullWidth required /></Grid>
        <Grid item xs={12}><TextField name="price" label="Price" type="number" value={product.price} onChange={handleChange} fullWidth required /></Grid>
      </Grid>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onClose} sx={{ mr: 1 }}>Cancel</Button>
        <Button type="submit" variant="contained">Submit</Button>
      </Box>
    </Box>
  );
};

export default ProductForm;