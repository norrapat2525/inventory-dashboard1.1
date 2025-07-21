import React, { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, flexRender, getFilteredRowModel } from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  IconButton,
  TextField,
  Chip,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import useInventoryStore from '../../stores/inventoryStore';
import ProductForm from './ProductForm'; // 1. Import ฟอร์มที่เราสร้าง

const ProductTable = () => {
  const products = useInventoryStore((state) => state.products);
  const [globalFilter, setGlobalFilter] = useState('');
  
  // 2. State สำหรับควบคุมการเปิด/ปิดฟอร์ม
  const [isFormOpen, setIsFormOpen] = useState(false);

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Product Name',
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: info => <Chip label={info.getValue()} size="small" variant="outlined" />
    },
    {
      accessorKey: 'quantity',
      header: 'Stock',
      cell: info => {
        const quantity = info.getValue();
        const lowStockThreshold = info.row.original.lowStockThreshold;
        let color = 'success';
        if (quantity === 0) {
            color = 'error';
        } else if (quantity <= lowStockThreshold) {
            color = 'warning';
        }
        return <Chip label={quantity} color={color} size="small" />;
      }
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: info => `$${Number(info.getValue() || 0).toFixed(2)}`
    },
    {
        id: 'totalValue',
        header: 'Total Value',
        cell: ({ row }) => {
            const { quantity, price } = row.original;
            const total = (Number(quantity) || 0) * (Number(price) || 0);
            return `$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: () => (
        <Box>
          <IconButton size="small" color="primary">
            <Edit fontSize="inherit" />
          </IconButton>
          <IconButton size="small" color="error">
            <Delete fontSize="inherit" />
          </IconButton>
        </Box>
      ),
    },
  ], []);

  const table = useReactTable({
    data: products,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>Product List</Typography>
        {/* 3. ปุ่มสำหรับเปิดฟอร์ม */}
        <Button variant="contained" color="primary" onClick={() => setIsFormOpen(true)}>
          Add New Product
        </Button>
      </Box>

      <Box mb={2}>
        <TextField
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Search all columns..."
          variant="outlined"
          size="small"
          fullWidth
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableCell key={header.id} sx={{ fontWeight: 'bold' }}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 4. เรียกใช้ฟอร์มและส่ง props เพื่อควบคุม */}
      <ProductForm 
        open={isFormOpen} 
        handleClose={() => setIsFormOpen(false)} 
      />
    </Box>
  );
};

export default ProductTable;
