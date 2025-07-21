import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { Box } from '@mui/material'; // หรือ Layout component หลักของคุณ

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        {/* คุณสามารถเพิ่ม Sidebar หรือ Navbar ตรงนี้ได้ */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {/* AppRoutes จะเป็นตัวสลับหน้าเพจต่างๆ */}
          <AppRoutes />
        </Box>
      </Box>
    </Router>
  );
}

export default App;
