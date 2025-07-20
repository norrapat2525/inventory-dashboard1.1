import React from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import useInventoryStore from '../../stores/inventoryStore';

const ProductFilter = () => {
  const { filters, setFilters } = useInventoryStore(state => ({
    filters: state.filters,
    setFilters: state.setFilters,
  }));

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({ [name]: value });
  };

  // หา Categories ที่ไม่ซ้ำกันจากข้อมูลสินค้าทั้งหมด
  const products = useInventoryStore(state => state.products);
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <TextField
        label="Search products..."
        name="search"
        value={filters.search}
        onChange={handleFilterChange}
        variant="outlined"
        size="small"
        sx={{ flexGrow: 1 }}
      />
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Category</InputLabel>
        <Select
          name="category"
          value={filters.category}
          label="Category"
          onChange={handleFilterChange}
        >
          <MenuItem value=""><em>All</em></MenuItem>
          {categories.map(cat => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Status</InputLabel>
        <Select
          name="status"
          value={filters.status}
          label="Status"
          onChange={handleFilterChange}
        >
          <MenuItem value=""><em>All</em></MenuItem>
          <MenuItem value="in-stock">In Stock</MenuItem>
          <MenuItem value="low-stock">Low Stock</MenuItem>
          <MenuItem value="out-of-stock">Out of Stock</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default ProductFilter;