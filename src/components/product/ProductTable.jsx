import React, { useState, useMemo, useCallback } from 'react';
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
import ProductForm from './ProductForm';
import ConfirmationDialog from '../common/ConfirmationDialog';

const ProductTable = () => {
  // FIX 1: Select state slices individually to prevent unnecessary re-renders.
  const products = useInventoryStore((state) => state.products);
  const deleteProduct = useInventoryStore((state) => state.deleteProduct);
  
  const [globalFilter, setGlobalFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // FIX 2: Wrap event handlers in useCallback for stable function references.
  const handleOpenForm = useCallback((product = null) => {
    setProductToEdit(product);
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setProductToEdit(null);
  }, []);

  const handleOpenDeleteDialog = useCallback((product) => {
    setProductToDelete(product);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setProductToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      handleCloseDeleteDialog();
    }
  }, [productToDelete, deleteProduct, handleCloseDeleteDialog]);

  // FIX 3: Update the dependency array for columns to use the stable handlers.
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
      cell: ({ row }) => (
        <Box>
          <IconButton size="small" color="primary" onClick={() => handleOpenForm(row.original)}>
            <Edit fontSize="inherit" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(row.original)}>
            <Delete fontSize="inherit" />
          </IconButton>
        </Box>
      ),
    },
  ], [handleOpenForm, handleOpenDeleteDialog]);

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
        <Button variant="contained" color="primary" onClick={() => handleOpenForm()}>
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

      <ProductForm 
        open={isFormOpen} 
        handleClose={handleCloseForm}
        productToEdit={productToEdit}
      />

      <ConfirmationDialog
        open={!!productToDelete}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the product "${productToDelete?.name}"? This action cannot be undone.`}
      />
    </Box>
  );
};

export default ProductTable;
