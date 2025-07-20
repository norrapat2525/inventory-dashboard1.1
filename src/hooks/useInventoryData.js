import useInventoryStore from '../stores/inventoryStore';

export const useInventoryData = () => {
  // ดึงฟังก์ชันที่คืนค่า "สินค้าที่ผ่านการกรองแล้ว" มาจาก store
  const getFilteredProducts = useInventoryStore((state) => state.getFilteredProducts);
  const products = getFilteredProducts();
  return { data: products, isLoading: false, isError: false };
};

// ... hooks อื่นๆ เหมือนเดิม ...
export const useCreateProduct = () => { /* ... */ };
export const useUpdateProduct = () => { /* ... */ };
export const useDeleteProduct = () => { /* ... */ };
export const useTransactionsData = () => { /* ... */ };