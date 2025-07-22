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
  Warning,
  AttachMoney,
  ShoppingCart,
  ErrorOutline,
  CheckCircle
} from '@mui/icons-material';
import useInventoryStore from '../stores/inventoryStore';

const StatCard = ({ title, value, icon, color, cardType }) => (
  <Card 
    className={`dashboard-card ${cardType}`} 
    elevation={0}
    sx={{ 
      height: '100%',
      cursor: 'pointer',
      '&:hover': {
        '& .card-icon': {
          transform: 'scale(1.1) rotate(5deg)',
        }
      }
    }}
  >
    <CardContent className="card-content" sx={{ p: 2 }}>
      <Box className="card-header" display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography 
            className="card-title"
            color="textSecondary" 
            gutterBottom 
            variant="subtitle2"
            sx={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}
          >
            {title}
          </Typography>
          <Typography 
            className="card-value"
            variant="h3" 
            component="h2" 
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              mb: 0.5
            }}
          >
            {value}
          </Typography>
          <Typography 
            className="card-label"
            variant="caption" 
            sx={{ fontSize: '0.8rem', opacity: 0.8 }}
          >
            {title === 'Total Products' && 'Items in inventory'}
            {title === 'Total Value' && 'Current inventory value'}
            {title === 'Low Stock Items' && 'Need attention'}
            {title === 'Out of Stock' && 'Urgent restocking'}
          </Typography>
        </Box>
        <Box 
          className="card-icon"
          sx={{ 
            fontSize: { xs: '2rem', md: '2.5rem' },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const RecentActivity = ({ sales }) => (
  <Card 
    className="recent-sales-card dashboard-paper"
    elevation={0}
    sx={{ height: '100%' }}
  >
    <CardContent sx={{ p: 2 }}>
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ 
          fontWeight: 600, 
          mb: 2,
          color: 'var(--text-primary)',
          fontSize: '1.25rem'
        }}
      >
        Recent Sales
      </Typography>
      {sales.length === 0 ? (
        <Box className="no-sales-message" sx={{ textAlign: 'center', py: 3 }}>
          <ShoppingCart sx={{ fontSize: 48, color: 'var(--text-secondary)', mb: 1 }} />
          <Typography 
            color="textSecondary"
            sx={{ fontStyle: 'italic', fontSize: '0.95rem' }}
          >
            No recent sales
          </Typography>
        </Box>
      ) : (
        <Box>
          {sales.slice(0, 5).map((sale, index) => (
            <Box 
              key={sale.id}
              className="sale-item"
              sx={{ 
                py: 1.5,
                px: 1,
                borderRadius: '8px',
                mb: 1,
                borderBottom: index < 4 ? `1px solid var(--border-color)` : 'none',
                transition: 'var(--transition)',
                '&:hover': {
                  backgroundColor: 'rgba(37, 99, 235, 0.05)',
                  transform: 'translateX(4px)',
                }
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ fontWeight: 600, color: 'var(--text-primary)' }}
              >
                <strong>Sale {sale.id}</strong>
                {' - Customer: ' + (sale.customerName || 'Walk-in')}
              </Typography>
              <Typography 
                variant="caption" 
                color="textSecondary"
                sx={{ fontSize: '0.8rem' }}
              >
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
    <Card 
      className="stock-alerts-card dashboard-paper"
      elevation={0}
      sx={{ height: '100%' }}
    >
      <CardContent sx={{ p: 2 }}>
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ 
            fontWeight: 600, 
            mb: 2,
            color: 'var(--text-primary)',
            fontSize: '1.25rem'
          }}
        >
          Stock Alerts
        </Typography>
        
        {outOfStockProducts.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography 
              variant="subtitle2" 
              gutterBottom
              sx={{ 
                color: 'var(--danger-color)', 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mb: 1
              }}
            >
              <ErrorOutline fontSize="small" />
              Out of Stock ({outOfStockProducts.length})
            </Typography>
            {outOfStockProducts.map(product => (
              <Box 
                key={product.id} 
                className="alert-item"
                sx={{ mb: 0.5 }}
              >
                <Box className="alert-icon">!</Box>
                <Typography 
                  className="alert-text"
                  variant="body2"
                  sx={{ fontSize: '0.9rem' }}
                >
                  {product.name}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
        
        {lowStockProducts.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography 
              variant="subtitle2" 
              gutterBottom
              sx={{ 
                color: 'var(--warning-color)', 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mb: 1
              }}
            >
              <Warning fontSize="small" />
              Low Stock ({lowStockProducts.length})
            </Typography>
            {lowStockProducts.map(product => (
              <Box 
                key={product.id} 
                className="alert-item"
                sx={{ mb: 0.5 }}
              >
                <Box className="alert-icon">⚠</Box>
                <Typography 
                  className="alert-text"
                  variant="body2"
                  sx={{ fontSize: '0.9rem' }}
                >
                  {product.name} (Qty: {product.quantity})
                </Typography>
              </Box>
            ))}
          </Box>
        )}
        
        {lowStockProducts.length === 0 && outOfStockProducts.length === 0 && (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 3,
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}
          >
            <CheckCircle sx={{ fontSize: 48, color: 'var(--success-color)', mb: 1 }} />
            <Typography 
              sx={{ 
                color: 'var(--success-color)', 
                fontWeight: 600,
                fontSize: '0.95rem'
              }}
            >
              All products are well stocked!
            </Typography>
          </Box>
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
      <Box 
        className="loading-container"
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column' 
        }}
      >
        <CircularProgress 
          size={60} 
          sx={{ color: 'var(--primary-color)' }}
        />
        <Typography 
          sx={{ 
            mt: 2, 
            color: 'white',
            fontWeight: 500
          }}
        >
          Loading dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="dashboard-content" sx={{ flexGrow: 1 }}>
      {/* Dashboard Header */}
      <Box className="dashboard-header" sx={{ mb: 3 }}>
        <Typography 
          className="dashboard-title"
          variant="h4" 
          component="h1"
          gutterBottom 
          sx={{ mb: 1 }}
        >
          Dashboard Overview
        </Typography>
        <Typography 
          className="dashboard-subtitle"
          variant="body1"
        >
          Monitor your inventory performance and status
        </Typography>
      </Box>
      
      {/* Overview Section */}
      <Box className="overview-section">
        <Typography className="section-title" component="h2">
          📊 Overview
        </Typography>
        
        <Grid container className="cards-grid" spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Box className="fade-in" sx={{ animationDelay: '0.1s' }}>
              <StatCard 
                title="Total Products" 
                value={stats.totalProducts} 
                icon={<Inventory />} 
                color="var(--primary-color)"
                cardType="card-products"
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box className="fade-in" sx={{ animationDelay: '0.2s' }}>
              <StatCard 
                title="Total Value" 
                value={`$${stats.totalValue.toLocaleString()}`} 
                icon={<AttachMoney />} 
                color="var(--success-color)"
                cardType="card-value-total"
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box className="fade-in" sx={{ animationDelay: '0.3s' }}>
              <StatCard 
                title="Low Stock Items" 
                value={stats.lowStockCount} 
                icon={<Warning />} 
                color="var(--warning-color)"
                cardType="card-low-stock"
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box className="fade-in" sx={{ animationDelay: '0.4s' }}>
              <StatCard 
                title="Out of Stock" 
                value={stats.outOfStockCount} 
                icon={<TrendingDown />} 
                color="var(--danger-color)"
                cardType="card-out-stock"
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Secondary Cards */}
      <Grid container className="secondary-cards" spacing={2}>
        <Grid item xs={12} md={6}>
          <Box className="slide-up" sx={{ animationDelay: '0.5s' }}>
            <RecentActivity sales={sales} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box className="slide-up" sx={{ animationDelay: '0.6s' }}>
            <LowStockAlert lowStockProducts={lowStockItems} outOfStockProducts={outOfStockItems} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview;