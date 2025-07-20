import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown, Inventory, Warning } from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useInventoryData } from '../hooks/useInventoryData'; // Use the new hook

// StatCard component remains the same
const StatCard = ({ title, value, icon, color }) => (
  <Card elevation={3}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="h6">{title}</Typography>
          <Typography variant="h4" component="h2" color={color}>{value}</Typography>
        </Box>
        <Box sx={{ color: color, opacity: 0.7 }}>{icon}</Box>
      </Box>
    </CardContent>
  </Card>
);

// Corrected Component Name and Data Fetching
const DashboardOverview = () => {
  const { data: products = [], isLoading, isError } = useInventoryData();

  // Handle loading and error states
  if (isLoading) return <Typography>Loading Dashboard...</Typography>;
  if (isError) return <Typography color="error">Error fetching dashboard data.</Typography>;

  // Calculate stats based on fetched data
  const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0),
    lowStockCount: products.filter(p => p.stock <= p.minStock).length,
    outOfStockCount: products.filter(p => p.stock === 0).length,
  };

  const pieData = [
    { name: 'In Stock', value: stats.totalProducts - stats.outOfStockCount },
    { name: 'Low Stock', value: stats.lowStockCount },
    { name: 'Out of Stock', value: stats.outOfStockCount },
  ];

  const barData = products
    .slice(0, 5)
    .map((product) => ({
      name: product.name,
      value: (product.price || 0) * (product.stock || 0),
    }));

  const COLORS = ['#0088FE', '#FFBB28', '#FF8042'];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Total Products" value={stats.totalProducts} icon={<Inventory fontSize="large" />} color="primary.main" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Total Value" value={`$${stats.totalValue.toLocaleString()}`} icon={<TrendingUp fontSize="large" />} color="success.main" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Low Stock Items" value={stats.lowStockCount} icon={<Warning fontSize="large" />} color="warning.main" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Out of Stock" value={stats.outOfStockCount} icon={<TrendingDown fontSize="large" />} color="error.main" /></Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}><CardContent>
            <Typography variant="h6" gutterBottom>Stock Status Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={3}><CardContent>
            <Typography variant="h6" gutterBottom>Top 5 Products by Value</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent></Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview;