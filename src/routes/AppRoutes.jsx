import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardOverview from '../pages/DashboardOverview';
import ProductTable from '../components/product/ProductTable';
import TransactionsPage from '../pages/Transactions'; // 1. Import คอมโพเนนต์จริง

const Reports = () => <h2>Reports</h2>;

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/overview" />} />
      <Route path="/overview" element={<DashboardOverview />} />
      <Route path="/products" element={<ProductTable />} />
      <Route path="/transactions" element={<TransactionsPage />} /> {/* 2. ใช้งานคอมโพเนนต์จริง */}
      <Route path="/reports" element={<Reports />} />
    </Routes>
  );
};

export default AppRoutes;