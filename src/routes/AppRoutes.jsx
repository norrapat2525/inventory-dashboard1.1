import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardOverview from '../pages/DashboardOverview';
import ProductTable from '../components/product/ProductTable';
import TransactionsPage from '../pages/TransactionsPage';
import ReportsPage from '../pages/ReportsPage'; // 1. Import หน้ารายงานใหม่

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/overview" />} />
      <Route path="/overview" element={<DashboardOverview />} />
      <Route path="/products" element={<ProductTable />} />
      <Route path="/transactions" element={<TransactionsPage />} />
      {/* 2. เปลี่ยนให้เรียกใช้ ReportsPage */}
      <Route path="/reports" element={<ReportsPage />} />
    </Routes>
  );
};

export default AppRoutes;
