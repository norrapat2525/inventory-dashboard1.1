import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardOverview from '../pages/DashboardOverview';
import ProductTable from '../components/product/ProductTable';
import TransactionsPage from '../pages/TransactionsPage';
import ReportsPage from '../pages/ReportsPage';
import CustomersPage from '../pages/CustomersPage'; // 1. Import หน้าลูกค้าใหม่

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/overview" />} />
      <Route path="/overview" element={<DashboardOverview />} />
      <Route path="/products" element={<ProductTable />} />
      <Route path="/transactions" element={<TransactionsPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      {/* 2. เพิ่ม Route สำหรับหน้าลูกค้า */}
      <Route path="/customers" element={<CustomersPage />} />
    </Routes>
  );
};

export default AppRoutes;
