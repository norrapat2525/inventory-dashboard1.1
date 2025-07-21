import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import useInventoryStore from '../stores/inventoryStore'; 
import CustomerForm from '../components/customers/CustomerForm';
import ConfirmationDialog from '../components/common/ConfirmationDialog';

const CustomersPage = () => {
  // --- การจัดการ State ---
  // 1. ตรวจสอบการ Hydration ก่อน
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // 2. ดึง State จาก Store
  const customers = useInventoryStore((state) => state.customers);
  const deleteCustomer = useInventoryStore((state) => state.deleteCustomer);
  
  // 3. State สำหรับ UI
  const [globalFilter, setGlobalFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);


  // --- ฟังก์ชัน Handlers ---
  const handleOpenForm = useCallback((customer = null) => {
    setCustomerToEdit(customer);
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setCustomerToEdit(null);
  }, []);

  const handleOpenDeleteDialog = useCallback((customer) => {
    setCustomerToDelete(customer);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setCustomerToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (customerToDelete) {
      deleteCustomer(customerToDelete.id);
      handleCloseDeleteDialog();
    }
  }, [customerToDelete, deleteCustomer, handleCloseDeleteDialog]);


  // --- การเตรียมข้อมูลสำหรับตาราง ---
  const columns = useMemo(() => [
    { accessorKey: 'name', header: 'Customer Name' },
    { accessorKey: 'phone', header: 'Phone' },
    { accessorKey: 'email', header: 'Email' },
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

  // FIX: สร้างตัวแปรข้อมูลที่ปลอดภัย รับประกันว่าเป็น Array เสมอ
  const tableData = useMemo(() => (hasMounted ? customers || [] : []), [hasMounted, customers]);

  const table = useReactTable({
    data: tableData, // ส่งข้อมูลที่ปลอดภัยแล้วเข้าตาราง
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // --- การแสดงผล ---
  // ถ้ายังไม่ Mount (ยังอยู่บน Server หรือ Client ยังไม่พร้อม) ให้ไม่แสดงอะไรเลย
  if (!hasMounted) {
    return null;
  }

  // เมื่อพร้อมแล้ว จึงแสดงผลหน้าทั้งหมด
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>Customer List</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpenForm()}>
          Add New Customer
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

      <CustomerForm 
        open={isFormOpen} 
        handleClose={handleCloseForm}
        customerToEdit={customerToEdit}
      />

      <ConfirmationDialog
        open={!!customerToDelete}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the customer "${customerToDelete?.name}"?`}
      />
    </Box>
  );
};

export default CustomersPage;
