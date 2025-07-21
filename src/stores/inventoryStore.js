import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ฟังก์ชันสำหรับสร้าง ID ที่ไม่ซ้ำกัน (ตัวอย่าง)
const generateId = (prefix) => `${prefix}${Date.now()}`;

const useInventoryStore = create(
  persist(
    (set, get) => ({
      //================== STATE (สถานะข้อมูล) ==================
      products: [
        { id: 1, name: 'iPhone 14 Pro', category: 'Electronics', quantity: 50, price: 999, lowStockThreshold: 10 },
        { id: 2, name: 'MacBook Air M2', category: 'Electronics', quantity: 5, price: 1199, lowStockThreshold: 10 },
        { id: 3, name: 'AirPods Pro', category: 'Electronics', quantity: 0, price: 249, lowStockThreshold: 10 },
      ],
      // 1. เพิ่ม State สำหรับเก็บข้อมูลลูกค้า
      customers: [
        { id: 'C1721479200000', name: 'บริษัท A จำกัด', phone: '081-234-5678', email: 'contact@a.com' },
        { id: 'C1721479200001', name: 'คุณสมชาย ใจดี', phone: '089-876-5432', email: 'somchai@email.com' },
      ],
      // 2. เปลี่ยน transactions เป็น sales และปรับโครงสร้างใหม่
      sales: [
        {
          id: 'S1721479200000',
          customerId: 'C1721479200001',
          date: '2025-07-20',
          items: [{ productId: 1, quantity: 1, price: 999 }],
          totalAmount: 999,
          status: 'Paid' // 'Paid' หรือ 'Unpaid'
        }
      ],
      notifications: [],

      //================== ACTIONS (ฟังก์ชันจัดการข้อมูล) ==================
      
      // --- Product Actions (ไม่มีการเปลี่ยนแปลง) ---
      addProduct: (product) => {
        const newProduct = { ...product, id: generateId('P') };
        set((state) => ({ products: [...state.products, newProduct] }));
        get().addNotification({ type: 'success', message: `Product "${product.name}" added.` });
      },
      updateProduct: (id, updatedProduct) => {
        set((state) => ({
          products: state.products.map(p => p.id === id ? { ...p, ...updatedProduct } : p)
        }));
        get().addNotification({ type: 'info', message: `Product "${updatedProduct.name}" updated.` });
      },
      deleteProduct: (id) => {
        const product = get().products.find(p => p.id === id);
        set((state) => ({ products: state.products.filter(p => p.id !== id) }));
        if (product) get().addNotification({ type: 'warning', message: `Product "${product.name}" deleted.` });
      },

      // --- 3. เพิ่มฟังก์ชันสำหรับจัดการลูกค้า ---
      addCustomer: (customer) => {
        const newCustomer = { ...customer, id: generateId('C') };
        set((state) => ({ customers: [...state.customers, newCustomer] }));
        get().addNotification({ type: 'success', message: `Customer "${customer.name}" added.` });
      },
      updateCustomer: (id, updatedCustomer) => {
        set((state) => ({
          customers: state.customers.map(c => c.id === id ? { ...c, ...updatedCustomer } : c)
        }));
        get().addNotification({ type: 'info', message: `Customer "${updatedCustomer.name}" updated.` });
      },
      deleteCustomer: (id) => {
        const customer = get().customers.find(c => c.id === id);
        set((state) => ({ customers: state.customers.filter(c => c.id !== id) }));
        if (customer) get().addNotification({ type: 'warning', message: `Customer "${customer.name}" deleted.` });
      },

      // --- 4. เปลี่ยน addTransaction เป็น createSaleOrder ---
      createSaleOrder: (saleData) => {
        // คำนวณยอดรวม
        const totalAmount = saleData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        
        const newSale = {
          ...saleData,
          id: generateId('S'),
          date: new Date().toISOString().split('T')[0],
          totalAmount,
        };

        set((state) => ({ sales: [newSale, ...state.sales] }));

        // ตัดสต็อกสินค้า
        newSale.items.forEach(item => {
          const product = get().products.find(p => p.id === item.productId);
          if (product) {
            const newQuantity = product.quantity - item.quantity;
            get().updateProduct(item.productId, { ...product, quantity: newQuantity });
          }
        });
        get().addNotification({ type: 'success', message: `Sale ${newSale.id} created.` });
      },

      // --- Notification Actions (ไม่มีการเปลี่ยนแปลง) ---
      addNotification: (notification) => set((state) => ({ notifications: [...state.notifications, { ...notification, id: Date.now() }] })),
      removeNotification: (id) => set((state) => ({ notifications: state.notifications.filter(n => n.id !== id) })),

      // --- Getters (ยังคงเดิม แต่ในอนาคตอาจต้องปรับปรุง) ---
      // ... (ส่วน getInventoryStats และอื่นๆ ยังคงเดิม) ...
    }),
    {
      name: 'inventory-storage-v2', // เปลี่ยนชื่อ key เพื่อไม่ให้ข้อมูลเก่าตีกับข้อมูลใหม่
      partialize: (state) => ({
        products: state.products,
        customers: state.customers,
        sales: state.sales,
      }),
    }
  )
);

export default useInventoryStore;
