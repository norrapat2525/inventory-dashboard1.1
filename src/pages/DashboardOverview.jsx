import React, { useMemo } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown, Inventory, Warning } from '@mui/icons-material';
import useInventoryStore from '../stores/inventoryStore';

const StatCard = ({ title, value, icon, color }) => (
  <Card elevation={3} sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="h6">{title}</Typography>
          <Typography variant="h4" component="h2" sx={{ color }}>{value}</Typography>
        </Box>
        <Box sx={{ color, opacity: 0.7, fontSize: 40 }}>{icon}</Box>
      </Box>
    </CardContent>
  </Card>
);

const RecentActivity = ({ transactions }) => (
  <Card elevation={3}>
    <CardContent>
      <Typography variant="h6" gutterBottom>Recent Activity</Typography>
      {transactions.length === 0 ? (
        <Typography color="textSecondary">No recent transactions</Typography>
      ) : (
        <Box>
          {transactions.slice(0, 5).map((transaction) => (
            <Box key={transaction.id} sx={{ py: 1, borderBottom: `1px solid #eee` }}>
              <Typography variant="body2">
                <strong>Sale to Customer</strong>
                {' - Total: $' + (transaction.totalAmount || 0).toFixed(2)}
              </Typography>
              <Typography variant="caption" color="textSecondary">{transaction.date}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </CardContent>
  </Card>
);

const LowStockAlert = ({ lowStockProducts, outOfStockProducts }) => (
  <Card elevation={3}>
    <CardContent>
      <Typography variant="h6" gutterBottom>Stock Alerts</Typography>
      {outOfStockProducts.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="error" gutterBottom>Out of Stock ({outOfStockProducts.length})</Typography>
          {outOfStockProducts.map(product => (
            <Typography key={product.id} variant="body2" color="error">• {product.name}</Typography>
          ))}
        </Box>
      )}
      {lowStockProducts.length > 0 && (
        <Box>
          <Typography variant="subtitle2" color="warning.main" gutterBottom>Low Stock ({lowStockProducts.length})</Typography>
          {lowStockProducts.map(product => (
            <Typography key={product.id} variant="body2" color="warning.main">• {product.name} (Qty: {product.quantity})</Typography>
          ))}
        </Box>
      )}
      {lowStockProducts.length === 0 && outOfStockProducts.length === 0 && (
        <Typography color="success.main">All products are well stocked!</Typography>
      )}
    </CardContent>
  </Card>
);

const DashboardOverview = () => {
  const products = useInventoryStore(state => state.products);
  const transactions = useInventoryStore(state => state.sales);

  const lowStockItems = useMemo(() => 
    products.filter(p => p.quantity > 0 && p.quantity <= p.lowStockThreshold),
    [products]
  );

  const outOfStockItems = useMemo(() => 
    products.filter(p => p.quantity === 0),
    [products]
  );

  const stats = useMemo(() => {
    const totalValue = products.reduce((sum, p) => sum + (Number(p.price) || 0) * (Number(p.quantity) || 0), 0);
    return {
      totalProducts: products.length,
      totalValue,
      lowStockCount: lowStockItems.length,
      outOfStockCount: outOfStockItems.length,
    };
  }, [products, lowStockItems, outOfStockItems]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>Dashboard Overview</Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Total Products" value={stats.totalProducts} icon={<Inventory />} color="primary.main" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Total Value" value={`$${stats.totalValue.toLocaleString()}`} icon={<TrendingUp />} color="success.main" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Low Stock Items" value={stats.lowStockCount} icon={<Warning />} color="warning.main" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Out of Stock" value={stats.outOfStockCount} icon={<TrendingDown />} color="error.main" /></Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}><RecentActivity transactions={transactions} /></Grid>
        <Grid item xs={12} md={6}><LowStockAlert lowStockProducts={lowStockItems} outOfStockProducts={outOfStockItems} /></Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview;import React, { useMemo } from 'react';
import { Grid, Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  Inventory, 
  Warning,
  ArrowUpward,
  ArrowDownward,
  ReportProblemOutlined
} from '@mui/icons-material';
import useInventoryStore from '../stores/inventoryStore';

const StatCard = ({ title, value, icon, color, bgColor }) => (
  <Card 
    elevation={3} 
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      p: 2, 
      borderRadius: 2,
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 6,
      }
    }}
  >
    <Avatar sx={{ bgcolor: bgColor, width: 56, height: 56, mr: 2 }}>
      {icon}
    </Avatar>
    <Box>
      <Typography color="text.secondary" variant="body2">{title}</Typography>
      <Typography variant="h5" component="h2" fontWeight="bold">{value}</Typography>
    </Box>
  </Card>
);

const RecentActivity = ({ transactions }) => (
  <Card elevation={3} sx={{ borderRadius: 2 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>Recent Activity</Typography>
      {transactions.length === 0 ? (
        <Typography color="text.secondary">No recent transactions</Typography>
      ) : (
        <Box>
          {transactions.slice(0, 5).map((transaction) => (
            <Box key={transaction.id} sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid #eee' }}>
              <Avatar sx={{ bgcolor: transaction.type === 'in' ? 'success.light' : 'error.light', width: 40, height: 40, mr: 2 }}>
                {transaction.type === 'in' ? <ArrowUpward sx={{ color: 'success.main' }} /> : <ArrowDownward sx={{ color: 'error.main' }} />}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  <strong>{transaction.type === 'in' ? 'Stock In' : 'Sale'}</strong> - Total: ${(transaction.totalAmount || 0).toFixed(2)}
                </Typography>
                <Typography variant="caption" color="text.secondary">{transaction.date}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </CardContent>
  </Card>
);

const LowStockAlert = ({ lowStockProducts, outOfStockProducts }) => (
  <Card elevation={3} sx={{ borderRadius: 2 }}>
    <CardContent>
       <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <ReportProblemOutlined color="warning" sx={{ mr: 1 }} />
          <Typography variant="h6">Stock Alerts</Typography>
       </Box>
      {outOfStockProducts.length > 0 && (
        <Box sx={{ mb: 2, p: 1, bgcolor: 'error.lighter', borderRadius: 1 }}>
          <Typography variant="subtitle2" color="error.dark" fontWeight="bold">Out of Stock ({outOfStockProducts.length})</Typography>
          {outOfStockProducts.map(product => (
            <Typography key={product.id} variant="body2" color="error.dark">• {product.name}</Typography>
          ))}
        </Box>
      )}
      {lowStockProducts.length > 0 && (
        <Box sx={{ p: 1, bgcolor: 'warning.lighter', borderRadius: 1 }}>
          <Typography variant="subtitle2" color="warning.dark" fontWeight="bold">Low Stock ({lowStockProducts.length})</Typography>
          {lowStockProducts.map(product => (
            <Typography key={product.id} variant="body2" color="warning.dark">• {product.name} (Qty: {product.quantity})</Typography>
          ))}
        </Box>
      )}
      {lowStockProducts.length === 0 && outOfStockProducts.length === 0 && (
        <Typography color="text.secondary">All products are well stocked!</Typography>
      )}
    </CardContent>
  </Card>
);

const DashboardOverview = () => {
  const products = useInventoryStore(state => state.products);
  const transactions = useInventoryStore(state => state.sales);

  const lowStockItems = useMemo(() => 
    products.filter(p => p.quantity > 0 && p.quantity <= p.lowStockThreshold),
    [products]
  );

  const outOfStockItems = useMemo(() => 
    products.filter(p => p.quantity === 0),
    [products]
  );

  const stats = useMemo(() => {
    const totalValue = products.reduce((sum, p) => sum + (Number(p.price) || 0) * (Number(p.quantity) || 0), 0);
    return {
      totalProducts: products.length,
      totalValue,
      lowStockCount: lowStockItems.length,
      outOfStockCount: outOfStockItems.length,
    };
  }, [products, lowStockItems, outOfStockItems]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
        Dashboard Overview
      </Typography>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid item xs={12} sm={6} lg={3}><StatCard title="Total Products" value={stats.totalProducts} icon={<Inventory />} color="primary.main" bgColor="primary.light" /></Grid>
        <Grid item xs={12} sm={6} lg={3}><StatCard title="Total Value" value={`$${stats.totalValue.toLocaleString()}`} icon={<TrendingUp />} color="success.main" bgColor="success.light" /></Grid>
        <Grid item xs={12} sm={6} lg={3}><StatCard title="Low Stock Items" value={stats.lowStockCount} icon={<Warning />} color="warning.main" bgColor="warning.light" /></Grid>
        <Grid item xs={12} sm={6} lg={3}><StatCard title="Out of Stock" value={stats.outOfStockCount} icon={<TrendingDown />} color="error.main" bgColor="error.light" /></Grid>
      </Grid>
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mt: 2 }}>
        <Grid item xs={12} lg={6}><RecentActivity transactions={transactions} /></Grid>
        <Grid item xs={12} lg={6}><LowStockAlert lowStockProducts={lowStockItems} outOfStockProducts={outOfStockItems} /></Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview;