import React, { useState, useMemo, useCallback } from 'react';
import { useReactTable, getCoreRowModel, flexRender, getFilteredRowModel } from '@tanstack/react-table';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, Box, Button, TextField, Chip
} from '@mui/material';
import useInventoryStore from '../stores/inventoryStore';

// คอมโพเนนต์สำหรับแสดงสถานะ
const StatusChip = ({ status }) => {
  let color = 'default';
  if (status === 'Paid') color = 'success';
  if (status === 'Unpaid') color = 'warning';
  
  return <Chip label={status} color={color} size="small" />;
};

const TransactionsPage = () => {
  // ดึงข้อมูล sales และ customers มาจาก store
  const sales = useInventoryStore((state) => state.sales);
  const customers = useInventoryStore((state) => state.customers);
  
  const [globalFilter, setGlobalFilter] = useState('');

  // สร้าง Map เพื่อให้ค้นหาชื่อลูกค้าได้เร็วขึ้น
  const customerMap = useMemo(() => {
    return new Map(customers.map(customer => [customer.id, customer.name]));
  }, [customers]);

  const columns = useMemo(() => [
    { accessorKey: 'id', header: 'Sale ID' },
    { accessorKey: 'date', header: 'Date' },
    { 
      accessorKey: 'customerId', 
      header: 'Customer',
      // แปลง customerId ให้เป็นชื่อลูกค้า
      cell: info => customerMap.get(info.getValue()) || 'Unknown Customer'
    },
    { 
      accessorKey: 'totalAmount', 
      header: 'Total Amount', 
      cell: info => `$${Number(info.getValue() || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
    },
    { 
      accessorKey: 'status', 
      header: 'Status',
      cell: info => <StatusChip status={info.getValue()} />
    },
  ], [customerMap]);
  
  const tableData = useMemo(() => sales || [], [sales]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>Sales History</Typography>
        {/* ในอนาคต ปุ่มนี้จะใช้เปิดฟอร์มบันทึกการขาย */}
        <Button variant="contained" color="primary">
          Create New Sale
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
      
      <Paper sx={{ width: '100%', overflowX: 'auto' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="sales history table">
            <TableHead>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableCell key={header.id} sx={{ fontWeight: 'bold' }}>{flexRender(header.column.columnDef.header, header.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default TransactionsPage;
