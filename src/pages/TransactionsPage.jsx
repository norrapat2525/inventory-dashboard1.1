import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  CircularProgress,
} from '@mui/material';
import useInventoryStore from '../stores/inventoryStore';

const TransactionsPage = () => {
  // ดึงข้อมูลการขายจาก Store
  const sales = useInventoryStore((state) => state.sales || []);
  const isClient = useInventoryStore((state) => state._isClient);
  const isHydrated = useInventoryStore((state) => state._isHydrated);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isClient && isHydrated) {
      setIsLoading(false);
    }
  }, [isClient, isHydrated]);

  // กรองข้อมูลตามการค้นหา
  const filteredSales = sales.filter(sale =>
    sale.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // แปลงสถานะเป็นสี
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'partial': return 'info';
      default: return 'success';
    }
  };

  // แปลงสถานะเป็นข้อความ
  const getStatusText = (status) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'pending': return 'Pending';
      case 'partial': return 'Partial';
      default: return 'Paid';
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column' 
      }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading transactions...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        Transaction History ({sales.length} transactions)
      </Typography>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by customer name, order ID, or notes..."
          variant="outlined"
          size="small"
          fullWidth
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Products</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Box sx={{ py: 4 }}>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      {searchTerm ? 'No transactions found matching your search.' : 'No transactions yet.'}
                    </Typography>
                    {!searchTerm && (
                      <Typography variant="body2" color="textSecondary">
                        Create your first sale order from the Sales page to see transactions here.
                      </Typography>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              // แปลงข้อมูล sales เป็นรายการ transactions แยกตามสินค้า
              filteredSales.flatMap((sale) => 
                sale.items?.map((item, itemIndex) => ({
                  id: `${sale.id}-${itemIndex}`,
                  saleId: sale.id,
                  date: sale.date,
                  customerName: sale.customerName,
                  productName: item.productName,
                  quantity: item.quantity,
                  amount: item.price * item.quantity,
                  paymentStatus: sale.paymentStatus
                })) || []
              ).map((transaction) => (
                <TableRow key={transaction.id} hover>
                  <TableCell>#{transaction.saleId}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.customerName || 'Walk-in'}</TableCell>
                  <TableCell>{transaction.productName}</TableCell>
                  <TableCell>
                    <Chip 
                      label="Sale" 
                      color="success" 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{transaction.quantity}</TableCell>
                  <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Summary */}
      {sales.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <Typography>
                Total Orders: <strong>{sales.length}</strong>
              </Typography>
              <Typography>
                Total Items Sold: <strong>
                  {sales.reduce((sum, sale) => 
                    sum + (sale.items?.reduce((itemSum, item) => itemSum + item.quantity, 0) || 0), 0
                  )}
                </strong>
              </Typography>
              <Typography>
                Total Revenue: <strong>
                  ${sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0).toLocaleString()}
                </strong>
              </Typography>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default TransactionsPage;