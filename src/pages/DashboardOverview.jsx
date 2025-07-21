import React, { useMemo, useState, useEffect } from 'react'; // 1. เพิ่ม useState และ useEffect
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

// คอมโพเนนต์ย่อยต่างๆ ไม่มีการเปลี่ยนแปลง
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


// คอมโพเนนต์หลักของหน้า Dashboard (ส่วนที่แก้ไข)
const DashboardOverview = () => {
  const products = useInventoryStore(state => state.products);
  const transactions = useInventoryStore(state => state.transactions);
  
  // 2. สร้าง state เพื่อตรวจสอบว่า component พร้อมแสดงผลบน client แล้วหรือยัง
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // --- ส่วน useMemo ไม่มีการเปลี่ยนแปลง ---
  const lowStockItems = useMemo(() => 
    products.filter(p => p.quantity > 0 && p.quantity <= p.lowStockThreshold),
    [products]
  );

  const outOfStockItems = useMemo(() => 
    products.filter(p => p.quantity === 0),
    [products]
  );

  const stats = useMemo(() => {
    const totalValue = products.reduce((sum, product) => {
      const price = Number(product.price) || 0;
      const quantity = Number(product.quantity) || 0;
      return sum + (price * quantity);
    }, 0);

    return {
      totalProducts: products.length,
      totalValue: totalValue,
      lowStockCount: lowStockItems.length,
      outOfStockCount: outOfStockItems.length,
    };
  }, [products, lowStockItems, outOfStockItems]);

  // 3. ถ้ายังไม่พร้อม (ยังอ่าน localStorage ไม่เสร็จ) ให้แสดงหน้าว่างๆ ไปก่อน
  if (!hasMounted) {
    return null; // หรือจะแสดง <p>Loading...</p> ก็ได้
  }

  // 4. เมื่อพร้อมแล้ว จึงแสดงผลข้อมูลทั้งหมด
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Dashboard Overview
      </Typography>
      
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
