// ตอนนี้เราจะใช้ Zustand โดยตรงแทน react-query เพื่อให้การทำงานเสถียร
import useInventoryStore from '../stores/inventoryStore';

export const useInventoryData = () => {
  const products = useInventoryStore((state) => state.products);
  // คืนค่าข้อมูลในรูปแบบเดียวกับ useQuery เพื่อให้กระทบส่วนอื่นน้อยที่สุด
  return { data: products, isLoading: false, isError: false };
};

export const useCreateProduct = () => {
  const addProduct = useInventoryStore((state) => state.addProduct);
  // คืนค่าฟังก์ชัน mutate ให้เหมือนกับ useMutation ของ react-query
  return { mutate: addProduct };
};

export const useDeleteProduct = () => {
  const deleteProduct = useInventoryStore((state) => state.deleteProduct);
  // คืนค่าฟังก์ชัน mutate ให้เหมือนกับ useMutation ของ react-query
  return { mutate: deleteProduct };
};

// สามารถปล่อย useTransactionsData ไว้เหมือนเดิม หรือสร้างเวอร์ชันจำลองในอนาคต
export const useTransactionsData = () => {
    return { data: [], isLoading: false, isError: false };
}