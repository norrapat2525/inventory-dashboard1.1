import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { Paper, Typography, Grid, Box } from '@mui/material';
import useInventoryStore from '../stores/inventoryStore';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const ReportsPage = () => {
  const products = useInventoryStore((state) => state.products);
  const transactions = useInventoryStore((state) => state.transactions);

  // คำนวณข้อมูลสำหรับกราฟวงกลม: สัดส่วนมูลค่าสินค้าตามหมวดหมู่
  const categoryValueData = useMemo(() => {
    const categoryValues = products.reduce((acc, product) => {
      const value = (product.price || 0) * (product.quantity || 0);
      acc[product.category] = (acc[product.category] || 0) + value;
      return acc;
    }, {});

    return Object.entries(categoryValues).map(([name, value]) => ({ name, value }));
  }, [products]);

  // คำนวณข้อมูลสำหรับกราฟแท่ง: จำนวนธุรกรรมรายเดือน
  const monthlyTransactionData = useMemo(() => {
    const monthlyData = transactions.reduce((acc, transaction) => {
      const month = new Date(transaction.date).toLocaleString('default', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { month, stockIn: 0, stockOut: 0 };
      }
      if (transaction.type === 'in') {
        acc[month].stockIn += transaction.quantity;
      } else {
        acc[month].stockOut += transaction.quantity;
      }
      return acc;
    }, {});

    return Object.values(monthlyData).reverse(); // เรียงเดือนล่าสุดก่อน
  }, [transactions]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Inventory Reports
      </Typography>
      <Grid container spacing={3}>
        {/* กราฟวงกลม */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Inventory Value by Category
            </Typography>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categoryValueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryValueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* กราฟแท่ง */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Monthly Transaction Volume
            </Typography>
            <ResponsiveContainer>
              <BarChart data={monthlyTransactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="stockIn" fill="#82ca9d" name="Stock In" />
                <Bar dataKey="stockOut" fill="#ff6b6b" name="Stock Out" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsPage;
