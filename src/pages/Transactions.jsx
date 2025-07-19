import React from 'react';
import { useTransactionsData } from '../hooks/useInventoryData';
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

// กำหนดคอลัมน์สำหรับตารางธุรกรรม
const columns = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'date', header: 'Date' },
  { accessorKey: 'productName', header: 'Product Name' },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: info => {
      const type = info.getValue();
      return <Chip label={type} color={type === 'Sale' ? 'success' : 'info'} size="small" />;
    }
  },
  { accessorKey: 'quantity', header: 'Quantity' },
  { accessorKey: 'amount', header: 'Amount', cell: info => `$${Number(info.getValue() || 0).toFixed(2)}` },
];

const TransactionsPage = () => {
  const { data: transactions = [], isLoading, isError } = useTransactionsData();

  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <Typography>Loading Transactions...</Typography>;
  if (isError) return <Typography color="error">Error fetching transactions.</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Transaction History</Typography>
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
    </Box>
  );
};

export default TransactionsPage;