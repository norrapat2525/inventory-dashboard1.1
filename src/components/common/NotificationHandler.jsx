import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import useInventoryStore from '../../stores/inventoryStore';

const NotificationHandler = () => {
  // ดึงข้อมูลการแจ้งเตือนและฟังก์ชันลบการแจ้งเตือนมาจาก Store
  const notifications = useInventoryStore((state) => state.notifications);
  const removeNotification = useInventoryStore((state) => state.removeNotification);

  const [open, setOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

  // useEffect จะทำงานเมื่อมีการแจ้งเตือนใหม่เข้ามา
  useEffect(() => {
    if (notifications.length > 0 && !currentNotification) {
      // ดึงการแจ้งเตือนตัวแรกมาแสดงผล
      setCurrentNotification(notifications[0]);
      setOpen(true);
    }
  }, [notifications, currentNotification]);

  // ฟังก์ชันสำหรับปิดการแจ้งเตือน
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  // ฟังก์ชันที่จะทำงานหลังจากการแจ้งเตือนหายไปแล้ว
  const handleExited = () => {
    if (currentNotification) {
      // ลบการแจ้งเตือนที่แสดงผลไปแล้วออกจาก Store
      removeNotification(currentNotification.id);
      setCurrentNotification(null);
    }
  };

  if (!currentNotification) {
    return null;
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000} // แสดงนาน 4 วินาที
      onClose={handleClose}
      TransitionProps={{ onExited: handleExited }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // แสดงที่มุมขวาล่าง
    >
      <Alert 
        onClose={handleClose} 
        severity={currentNotification.type} // สีของการแจ้งเตือน (success, info, warning)
        sx={{ width: '100%' }}
      >
        {currentNotification.message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationHandler;
