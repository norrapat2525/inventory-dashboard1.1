import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardOverview from '../pages/DashboardOverview';
import ProductTable from '../components/product/ProductTable';
// แก้ไขบรรทัดนี้ให้ถูกต้อง
import TransactionsPage from '../pages/TransactionsPage'; 

const Reports = () => <h2>Reports</h2>;

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/overview" />} />
      <Route path="/overview" element={<DashboardOverview />} />
      <Route path="/products" element={<ProductTable />} />
      <Route path="/transactions" element={<TransactionsPage />} />
      <Route path="/reports" element={<Reports />} />
    </Routes>
  );
};

export default AppRoutes;