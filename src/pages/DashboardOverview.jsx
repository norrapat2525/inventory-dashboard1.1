import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  Inventory, 
  Warning 
} from '@mui/icons-material';
import useInventoryStore from '../stores/inventoryStore';

// คอมโพเนนต์ย่อย: การ์ดสถิติ
const StatCard = ({ title, value, icon, color }) => (
  <Card elevation={3} sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h4" component="h2" sx={{ color }}>
            {value}
          </Typography>
        </Box>
        <Box sx={{ color, opacity: 0.7, fontSize: 40 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// คอมโพเนนต์ย่อย: กิจกรรมล่าสุด
const RecentActivity = ({ transactions }) => (
  <Card elevation={3}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Recent Activity
      </Typography>
      {transactions.length === 0 ? (
        <Typography color="textSecondary">
          No recent transactions
        </Typography>
      ) : (
        <Box>
          {transactions.slice(0, 5).map((transaction, index) => (
            <Box 
              key={transaction.id}
              sx={{ 
                py: 1, 
                borderBottom: index < 4 ? `1px solid #eee` : 'none' 
              }}
            >
              <Typography variant="body2">
                <strong>{transaction.type === 'in' ? 'Stock In' : 'Stock Out'}</strong>
                {' - Qty: ' + transaction.quantity}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {transaction.date} - {transaction.note}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </CardContent>
  </Card>
);

// คอมโพเนนต์ย่อย: การแจ้งเตือนสต็อก
const LowStockAlert = ({ lowStockProducts, outOfStockProducts }) => {
  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Stock Alerts
        </Typography>
        
        {outOfStockProducts.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="error" gutterBottom>
              Out of Stock ({outOfStockProducts.length})
            </Typography>
            {outOfStockProducts.map(product => (
              <Typography key={product.id} variant="body2" color="error">
                • {product.name}
              </Typography>
            ))}
          </Box>
        )}
        
        {lowStockProducts.length > 0 && (
          <Box>
            <Typography variant="subtitle2" color="warning.main" gutterBottom>
              Low Stock ({lowStockProducts.length})
            </Typography>
            {lowStockProducts.map(product => (
              <Typography key={product.id} variant="body2" color="warning.main">
                • {product.name} (Qty: {product.quantity})
              </Typography>
            ))}
          </Box>
        )}
        
        {lowStockProducts.length === 0 && outOfStockProducts.length === 0 && (
          <Typography color="success.main">
            All products are well stocked!
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

// คอมโพเนนต์หลักของหน้า Dashboard
const DashboardOverview = () => {
  const { transactions, getInventoryStats, getLowStockProducts, getOutOfStockProducts } = useInventoryStore(state => ({
    transactions: state.transactions,
    getInventoryStats: state.getInventoryStats,
    getLowStockProducts: state.getLowStockProducts,
    getOutOfStockProducts: state.getOutOfStockProducts,
  }));

  const stats = getInventoryStats();
  const lowStockItems = getLowStockProducts();
  const outOfStockItems = getOutOfStockProducts();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Dashboard Overview
      </Typography>
      
      {/* การ์ดสถิติ */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Products" 
            value={stats.totalProducts} 
            icon={<Inventory />} 
            color="primary.main" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Value" 
            value={`$${stats.totalValue.toLocaleString()}`} 
            icon={<TrendingUp />} 
            color="success.main" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Low Stock Items" 
            value={stats.lowStockCount} 
            icon={<Warning />} 
            color="warning.main" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Out of Stock" 
            value={stats.outOfStockCount} 
            icon={<TrendingDown />} 
            color="error.main" 
          />
        </Grid>
      </Grid>

      {/* การ์ดเนื้อหา */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <RecentActivity transactions={transactions} />
        </Grid>
        <Grid item xs={12} md={6}>
          <LowStockAlert lowStockProducts={lowStockItems} outOfStockProducts={outOfStockItems} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview;
