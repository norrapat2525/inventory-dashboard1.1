import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardOverview from '../pages/DashboardOverview';
import ProductTable from '../components/product/ProductTable';
import TransactionsPage from '../pages/TransactionsPage'; // ✅ แก้ไขชื่อไฟล์ให้ถูกต้อง
import CustomersPage from '../pages/CustomersPage';
import SalesPage from '../pages/SalesPage';
import ReportsPage from '../pages/ReportsPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/overview" />} />
      <Route path="/overview" element={<DashboardOverview />} />
      <Route path="/products" element={<ProductTable />} />
      <Route path="/customers" element={<CustomersPage />} />
      <Route path="/sales" element={<SalesPage />} />
      <Route path="/transactions" element={<TransactionsPage />} />
      <Route path="/reports" element={<ReportsPage />} />
    </Routes>
  );
};

export default AppRoutes;