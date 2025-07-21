import React, { useMemo, useState, useEffect } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  CircularProgress
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  Inventory, 
  Warning 
} from '@mui/icons-material';
import useInventoryStore from '../stores/inventoryStore';

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

const RecentActivity = ({ sales }) => (
  <Card elevation={3}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Recent Sales
      </Typography>
      {sales.length === 0 ? (
        <Typography color="textSecondary">
          No recent sales
        </Typography>
      ) : (
        <Box>
          {sales.slice(0, 5).map((sale, index) => (
            <Box 
              key={sale.id}
              sx={{ 
                py: 1, 
                borderBottom: index < 4 ? `1px solid #eee` : 'none' 
              }}
            >
              <Typography variant="body2">
                <strong>Sale {sale.id}</strong>
                {' - Customer: ' + (sale.customerName || 'Walk-in')}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {sale.date} - Total: ${sale.totalAmount?.toLocaleString() || 0}
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

const DashboardOverview = () => {
  // ใช้ Safe functions แทนการดึงข้อมูลโดยตรง
  const getSafeProducts = useInventoryStore((state) => state.getSafeProducts);
  const sales = useInventoryStore((state) => state.sales || []);
  
  // ตรวจสอบสถานะความพร้อม
  const isClient = useInventoryStore((state) => state._isClient);
  const isHydrated = useInventoryStore((state) => state._isHydrated);
  
  // State ในคอมโพเนนต์
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // รอให้ Store พร้อมแล้วค่อยดึงข้อมูล
  useEffect(() => {
    console.log('🔧 [Dashboard] Checking readiness...', { isClient, isHydrated });
    
    if (isClient && isHydrated) {
      console.log('🔧 [Dashboard] Store is ready, loading products...');
      try {
        const safeProducts = getSafeProducts();
        console.log('🔧 [Dashboard] Got products:', safeProducts.length);
        setProducts(safeProducts);
      } catch (error) {
        console.error('🔧 [Dashboard] Error loading products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isClient, isHydrated, getSafeProducts]);

  // Subscribe การเปลี่ยนแปลงของข้อมูล products
  useEffect(() => {
    if (!isClient || !isHydrated) return;

    const unsubscribe = useInventoryStore.subscribe(
      (state) => state.products,
      (newProducts) => {
        console.log('🔧 [Dashboard] Products updated:', newProducts?.length || 0);
        if (Array.isArray(newProducts)) {
          setProducts(newProducts);
        }
      }
    );

    return unsubscribe;
  }, [isClient, isHydrated]);

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

  if (isLoading || !isClient || !isHydrated) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column' 
      }}>
        <CircularProgress size={60} />
        <Typography sx={{ mt: 2 }}>Loading dashboard...</Typography>
      </Box>
    );
  }

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
          <RecentActivity sales={sales} />
        </Grid>
        <Grid item xs={12} md={6}>
          <LowStockAlert lowStockProducts={lowStockItems} outOfStockProducts={outOfStockItems} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview;