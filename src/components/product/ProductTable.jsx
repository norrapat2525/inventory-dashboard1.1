import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Chip,
  Button,
  IconButton,
  Typography,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import useInventoryStore from '../../stores/inventoryStore';

const ProductTable = () => {
  const { products, deleteProduct } = useInventoryStore();
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Product Name',
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: (info) => (
          <Chip
            label={info.getValue()}
            size="small"
            color="primary"
            variant="outlined"
          />
        ),
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        cell: (info) => {
          const stock = info.getValue();
          const minStock = info.row.original.minStock || 10; // Default minStock for display
          const color =
            stock === 0 ? 'error' : stock <= minStock ? 'warning' : 'success';
          return <Chip label={stock} size="small" color={color} />;
        },
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: (info) => `$${(info.getValue() || 0).toFixed(2)}`,
      },
      {
        id: 'value',
        header: 'Total Value',
        cell: ({ row }) =>
          `$${(
            (row.original.stock || 0) * (row.original.price || 0)
          ).toFixed(2)}`,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Box>
            <IconButton
              size="small"
              onClick={() => console.log('Edit', row.original)}
            >
              <Edit />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete?')) {
                  deleteProduct(row.original.id);
                }
              }}
            >
              <Delete />
            </IconButton>
          </Box>
        ),
      },
    ],
    [deleteProduct]
  );

  const table = useReactTable({
    data: products,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Product List
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          variant="outlined"
          label="Search all columns"
          size="small"
        />
      </Box>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    sx={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted() ?? null]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="body2">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </Typography>
        <Box>
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductTable;