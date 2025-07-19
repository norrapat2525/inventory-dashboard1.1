import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// ฟังก์ชันเดิมสำหรับดึงข้อมูลสินค้า
const getInventoryData = async () => {
  try {
    const response = await axios.get(`${API_URL}?action=read&table=inventory`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching inventory data:', error);
    throw error;
  }
};

// --- เพิ่มฟังก์ชันใหม่ตรงนี้ ---
const getTransactionsData = async () => {
  try {
    // สังเกตว่าเราเปลี่ยน table=transactions เพื่อบอกให้หลังบ้านรู้ว่าต้องการข้อมูลจากชีตไหน
    const response = await axios.get(`${API_URL}?action=read&table=transactions`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching transactions data:', error);
    throw error;
  }
};

// --- อัปเดตบรรทัด export ให้มีฟังก์ชันใหม่ไปด้วย ---
export { getInventoryData, getTransactionsData };
// ... (โค้ดเดิมด้านบน) ...

// --- เพิ่มฟังก์ชันใหม่ตรงนี้ ---
const deleteProduct = async (productId) => {
  try {
    const response = await axios.post(API_URL, {
      action: 'delete',
      table: 'inventory',
      id: productId
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// --- อัปเดตบรรทัด export ---
export { getInventoryData, getTransactionsData, deleteProduct };