import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * ดึงข้อมูลสินค้าทั้งหมดจากชีต 'inventory'
 */
const getInventoryData = async () => {
  try {
    const response = await axios.get(`${API_URL}?action=read&table=inventory`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching inventory data:', error);
    throw error;
  }
};

/**
 * ดึงข้อมูลธุรกรรมทั้งหมดจากชีต 'transactions'
 */
const getTransactionsData = async () => {
  try {
    const response = await axios.get(`${API_URL}?action=read&table=transactions`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching transactions data:', error);
    throw error;
  }
};

/**
 * เพิ่มสินค้าใหม่ลงในชีต 'inventory'
 * @param {object} newProduct - อ็อบเจกต์ข้อมูลสินค้าใหม่
 */
const createProduct = async (newProduct) => {
  try {
    // สร้าง ID ชั่วคราวฝั่ง client (Backend ควรจะสร้าง ID จริง)
    const productData = { ...newProduct, id: `prod_${Date.now()}` };
    const response = await axios.post(API_URL, {
      action: 'create',
      table: 'inventory',
      ...productData
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * ลบสินค้าตาม ID จากชีต 'inventory'
 * @param {string | number} productId - ไอดีของสินค้าที่ต้องการลบ
 */
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

// ส่งออกฟังก์ชันทั้งหมดเพื่อให้ไฟล์อื่นเรียกใช้ได้
export {
  getInventoryData,
  getTransactionsData,
  createProduct,
  deleteProduct
};