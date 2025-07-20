import React, { useState } from 'react';
import { Badge, IconButton, Popover, List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import { Notifications, Warning } from '@mui/icons-material';
import useInventoryStore from '../../stores/inventoryStore';

const LowStockAlert = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  // ดึงฟังก์ชันสำหรับคำนวณสินค้าใกล้หมดมาจาก Store ของเรา
  const getLowStockProducts = useInventoryStore((state) => state.getLowStockProducts);
  const lowStockItems = getLowStockProducts();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // ถ้าไม่มีสินค้าใกล้หมด ก็ไม่ต้องแสดงไอคอน
  if (lowStockItems.length === 0) {
    return null;
  }

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={lowStockItems.length} color="error">
          <Notifications />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ p: 2, maxWidth: 350 }}>
          <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Warning color="warning" sx={{ mr: 1 }} />
            Low Stock Items
          </Typography>
          <List dense>
            {lowStockItems.map((item) => (
              <ListItem key={item.id} divider>
                <ListItemText
                  primary={item.name}
                  secondary={`Stock: ${item.stock} (Min: ${item.minStock})`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>
    </>
  );
};

export default LowStockAlert;