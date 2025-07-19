import { useQuery } from 'react-query';
import { getInventoryData, getTransactionsData } from '../services/googleSheetsService';
// --- อัปเดต import ---
import { useQuery, useMutation, useQueryClient } from 'react-query';
// --- อัปเดต import ---
import { getInventoryData, getTransactionsData, deleteProduct } from '../services/googleSheetsService';


// Hook สำหรับข้อมูลสินค้า
export const useInventoryData = () => {
  return useQuery('inventory', getInventoryData);
};

// Hook สำหรับข้อมูลธุรกรรม
export const useTransactionsData = () => {
    return useQuery('transactions', getTransactionsData);
};
// --- เพิ่ม Hook ใหม่ตรงนี้ ---
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteProduct, {
    onSuccess: () => {
      // เมื่อลบข้อมูลสำเร็จ ให้สั่งให้ React Query ดึงข้อมูล inventory ใหม่
      queryClient.invalidateQueries('inventory');
    },
  });
};