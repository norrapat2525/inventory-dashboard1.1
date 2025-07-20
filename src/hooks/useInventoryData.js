import useInventoryStore from '../stores/inventoryStore';

// Hook นี้จะไปดึงข้อมูลจากคลังข้อมูลภายใน
export const useInventoryData = () => {
  const products = useInventoryStore((state) => state.products);
  return { data: products, isLoading: false, isError: false };
};

// Hook นี้จะเรียกใช้ action 'addProduct' จากคลังข้อมูลภายใน
export const useCreateProduct = () => {
  const addProduct = useInventoryStore((state) => state.addProduct);
  return { mutate: addProduct };
};

// Hook นี้จะเรียกใช้ action 'deleteProduct' จากคลังข้อมูลภายใน
export const useDeleteProduct = () => {
  const deleteProduct = useInventoryStore((state) => state.deleteProduct);
  return { mutate: deleteProduct };
};

// Hook นี้สามารถคงไว้เหมือนเดิมได้สำหรับตอนนี้
export const useTransactionsData = () => {
    return { data: [], isLoading: false, isError: false };
}