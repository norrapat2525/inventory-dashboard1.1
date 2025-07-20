import React from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
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
  Chip
} from '@mui/material';
import useInventoryStore from '../../stores/inventoryStore';

const ProductTable = () => {
  const products = useInventoryStore((state) => state.products);

  const columns = React.useMemo(
    () => [
      { accessorKey: 'name', header: 'Product Name' },
      { accessorKey: 'category', header: 'Category', cell: info => <Chip label={info.getValue()} size="small" color="primary" /> },
      { accessorKey: 'stock', header: 'Stock' },
      { accessorKey: 'price', header: 'Price', cell: info => `$${info.getValue()}` },
    ],
    []
  );

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Product List
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableCell key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
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
    </Box>
  );
};

export default ProductTable;