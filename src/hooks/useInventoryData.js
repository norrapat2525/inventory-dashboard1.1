import useInventoryStore from '../stores/inventoryStore';

export const useInventoryData = () => {
  const products = useInventoryStore((state) => state.products);
  return { data: products, isLoading: false, isError: false };
};

export const useCreateProduct = () => {
  const addProduct = useInventoryStore((state) => state.addProduct);
  return { mutate: addProduct };
};

// --- เพิ่ม Hook ใหม่ตรงนี้ ---
export const useUpdateProduct = () => {
  const updateProduct = useInventoryStore((state) => state.updateProduct);
  // คืนค่าฟังก์ชัน mutate ที่รับ 2 arguments (id, updates)
  return { mutate: (id, updates) => updateProduct(id, updates) };
};

export const useDeleteProduct = () => {
  const deleteProduct = useInventoryStore((state) => state.deleteProduct);
  return { mutate: deleteProduct };
};

export const useTransactionsData = () => {
    return { data: [], isLoading: false, isError: false };
}