import { useQuery } from 'react-query';
import { getInventoryData, getTransactionsData } from '../services/googleSheetsService';

// Hook สำหรับข้อมูลสินค้า
export const useInventoryData = () => {
  return useQuery('inventory', getInventoryData);
};

// Hook สำหรับข้อมูลธุรกรรม
export const useTransactionsData = () => {
    return useQuery('transactions', getTransactionsData);
};