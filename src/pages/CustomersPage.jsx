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
  // --- 1. State Management (วิธีใหม่ที่ปลอดภัยที่สุด) ---
  // State สำหรับตรวจสอบว่า Client พร้อมทำงานแล้วหรือยัง
  const [hasMounted, setHasMounted] = useState(false);
  
  // State ที่ปลอดภัยสำหรับเก็บข้อมูลลูกค้า โดยเริ่มต้นด้วย Array ว่างเสมอ
  const [safeCustomers, setSafeCustomers] = useState([]);

  // ดึงแค่ฟังก์ชัน (Action) มาใช้งานโดยตรง
  const deleteCustomer = useInventoryStore.getState().deleteCustomer;

  // useEffect จะทำงาน *หลังจาก* ที่ Client พร้อมแล้วเท่านั้น
  useEffect(() => {
    setHasMounted(true); // ตั้งค่าว่า Client พร้อมแล้ว

    // ดึงข้อมูลลูกค้าล่าสุดจาก Store มาใส่ใน State ที่ปลอดภัยของเรา
    setSafeCustomers(useInventoryStore.getState().customers || []);

    // สมัครรับการเปลี่ยนแปลงจาก Store
    const unsubscribe = useInventoryStore.subscribe(
      (state) => {
        // เมื่อข้อมูลลูกค้าใน Store เปลี่ยนแปลง ให้อัปเดต State ที่ปลอดภัยของเราตาม
        setSafeCustomers(state.customers || []);
      }
    );

    // Cleanup subscription เมื่อคอมโพเนントถูกทำลาย
    return () => unsubscribe();
  }, []); // useEffect นี้จะทำงานแค่ครั้งเดียวหลังจาก Mount

  // State สำหรับควบคุม UI
  const [globalFilter, setGlobalFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // --- 2. Handlers (ฟังก์ชันจัดการเหตุการณ์) ---
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

  // --- 3. การเตรียมข้อมูลสำหรับตาราง ---
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

  const table = useReactTable({
    data: safeCustomers, // ใช้ข้อมูลจาก "State ที่ปลอดภัย" เสมอ
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // --- 4. การแสดงผล ---
  // ถ้า Client ยังไม่พร้อม ให้ไม่แสดงอะไรเลย เพื่อป้องกัน Error
  if (!hasMounted) {
    return null;
  }

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
