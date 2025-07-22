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
  AreaChart,
  Area,
} from 'recharts';
import { Paper, Typography, Grid, Box, Card, CardContent, Avatar } from '@mui/material';
import { MonetizationOn, Receipt, People, Inventory } from '@mui/icons-material';
import useInventoryStore from '../stores/inventoryStore';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

// [UI Improvement] การ์ดสรุปข้อมูลที่ออกแบบใหม่
const StatCard = ({ title, value, icon, bgColor, color }) => (
  <Card elevation={3} sx={{ display: 'flex', alignItems: 'center', p: 2.5, borderRadius: 2, height: '100%' }}>
    <Avatar sx={{ bgcolor: bgColor, color: color, width: 56, height: 56, mr: 2 }}>{icon}</Avatar>
    <Box>
      <Typography color="text.secondary">{title}</Typography>
      <Typography variant="h5" fontWeight="bold">{value}</Typography>
    </Box>
  </Card>
);

// [UI Improvement] Custom Tooltip สำหรับกราฟ
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper elevation={3} sx={{ p: 1.5, borderRadius: 1 }}>
        <Typography variant="caption" display="block" gutterBottom>{`Date: ${label}`}</Typography>
        <Typography variant="body2" fontWeight="bold" sx={{ color: payload[0].stroke }}>
          {`Amount: $${payload[0].value.toLocaleString()}`}
        </Typography>
      </Paper>
    );
  }
  return null;
};


const ReportsPage = () => {
  const products = useInventoryStore((state) => state.products);
  const customers = useInventoryStore((state) => state.customers);
  const sales = useInventoryStore((state) => state.sales);

  // --- 1. คำนวณข้อมูลสำหรับการ์ดสรุป ---
  const keyMetrics = useMemo(() => {
    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
    return {
      totalRevenue: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      totalSales: sales.length,
      totalCustomers: customers.length,
      totalProducts: products.length,
    };
  }, [sales, customers, products]);

  // --- 2. คำนวณข้อมูลสำหรับกราฟแนวโน้มยอดขาย ---
  const salesTrendData = useMemo(() => {
    const dailySales = sales.reduce((acc, sale) => {
      const date = sale.date;
      acc[date] = (acc[date] || 0) + sale.totalAmount;
      return acc;
    }, {});
    return Object.entries(dailySales)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [sales]);

  // --- 3. คำนวณข้อมูลสำหรับ 5 อันดับสินค้าขายดี ---
  const topProductsData = useMemo(() => {
    const productSales = sales.flatMap(sale => sale.items).reduce((acc, item) => {
      acc[item.productId] = (acc[item.productId] || 0) + (item.price * item.quantity);
      return acc;
    }, {});

    const productMap = new Map(products.map(p => [p.id, p.name]));

    return Object.entries(productSales)
      .map(([productId, total]) => ({ name: productMap.get(Number(productId)) || 'Unknown', total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [sales, products]);
  
  // --- 4. คำนวณข้อมูลสำหรับสถานะการชำระเงิน ---
    const paymentStatusData = useMemo(() => {
        const statusCounts = sales.reduce((acc, sale) => {
            const status = sale.status || 'Unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
    }, [sales]);


  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
        Sales & Inventory Reports
      </Typography>
      
      {/* ส่วนที่ 1: การ์ดสรุปข้อมูล */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Total Revenue" value={keyMetrics.totalRevenue} icon={<MonetizationOn />} bgColor="success.light" color="success.main" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Total Sales" value={keyMetrics.totalSales} icon={<Receipt />} bgColor="info.light" color="info.main" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Total Customers" value={keyMetrics.totalCustomers} icon={<People />} bgColor="secondary.light" color="secondary.main" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Total Products" value={keyMetrics.totalProducts} icon={<Inventory />} bgColor="warning.light" color="warning.main" /></Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* ส่วนที่ 2: กราฟแนวโน้มยอดขาย */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 2, height: 350, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Sales Trend</Typography>
            <ResponsiveContainer>
              <AreaChart data={salesTrendData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="amount" stroke="#8884d8" fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* ส่วนที่ 3: กราฟสถานะการชำระเงิน */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 2, height: 350, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Payment Status</Typography>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={paymentStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5} label>
                  {paymentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Paid' ? '#00C49F' : '#FF8042'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* ส่วนที่ 4: กราฟสินค้าขายดี */}
        <Grid item xs={12}>
           <Paper sx={{ p: 2, height: 400, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Top 5 Selling Products (by Revenue)</Typography>
            <ResponsiveContainer>
                <BarChart data={topProductsData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="total" fill="#82ca9d" name="Total Revenue" radius={[0, 10, 10, 0]} />
                </BarChart>
            </ResponsiveContainer>
           </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsPage;