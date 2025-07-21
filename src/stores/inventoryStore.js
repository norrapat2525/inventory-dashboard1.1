import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

const generateId = (prefix) => `${prefix}${Date.now()}`;

const useInventoryStore = create(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        //================== STATE ==================
        products: [
          { id: 1, name: 'iPhone 14 Pro', category: 'Electronics', quantity: 50, price: 999, lowStockThreshold: 10 },
          { id: 2, name: 'MacBook Air M2', category: 'Electronics', quantity: 5, price: 1199, lowStockThreshold: 10 },
        ],
        customers: [
          { id: 'C1721479200000', name: 'บริษัท A จำกัด', phone: '081-234-5678', email: 'contact@a.com' },
          { id: 'C1721479200001', name: 'คุณสมชาย ใจดี', phone: '089-876-5432', email: 'somchai@email.com' },
        ],
        sales: [],
        notifications: [],
        // สถานะพิเศษสำหรับป้องกัน hydration error
        _isHydrated: false,
        _isClient: false,

        //================== ACTIONS ==================
        // เมื่อแอปโหลดเสร็จในฝั่ง client
        setClientReady: () => {
          console.log('🔧 [Store] Client is ready');
          set({ _isClient: true });
        },

        // เมื่อข้อมูลถูก hydrate เสร็จ
        setHydrated: (status) => {
          console.log('🔧 [Store] Hydration status:', status);
          set({ _isHydrated: status });
        },

        // ฟังก์ชันสำหรับดึงข้อมูลอย่างปลอดภัย
        getSafeCustomers: () => {
          const state = get();
          if (!state._isClient || !state._isHydrated) {
            console.log('🔧 [Store] Not ready, returning empty array');
            return [];
          }
          return Array.isArray(state.customers) ? state.customers : [];
        },

        getSafeProducts: () => {
          const state = get();
          if (!state._isClient || !state._isHydrated) {
            return [];
          }
          return Array.isArray(state.products) ? state.products : [];
        },
        
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
        createSaleOrder: (saleData) => {
          const totalAmount = saleData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
          const newSale = {
            ...saleData,
            id: generateId('S'),
            date: new Date().toISOString().split('T')[0],
            totalAmount,
          };
          set((state) => ({ sales: [newSale, ...state.sales] }));
          newSale.items.forEach(item => {
            const product = get().products.find(p => p.id === item.productId);
            if (product) {
              const newQuantity = product.quantity - item.quantity;
              get().updateProduct(item.productId, { ...product, quantity: newQuantity });
            }
          });
          get().addNotification({ type: 'success', message: `Sale ${newSale.id} created.` });
        },
        addNotification: (notification) => set((state) => ({ notifications: [...state.notifications, { ...notification, id: Date.now() }] })),
        removeNotification: (id) => set((state) => ({ notifications: state.notifications.filter(n => n.id !== id) })),
      }),
      {
        name: 'inventory-storage-v3', // เปลี่ยนชื่อเพื่อล้างข้อมูลเก่า
        partialize: (state) => ({
          products: state.products,
          customers: state.customers,
          sales: state.sales,
        }),
        onRehydrateStorage: () => {
          console.log('🔧 [Store] Starting rehydration...');
          return (state, error) => {
            if (error) {
              console.error('🔧 [Store] Rehydration error:', error);
              return;
            }
            
            console.log('🔧 [Store] Rehydration complete, validating data...');
            
            // ตรวจสอบและแก้ไขข้อมูลที่อาจเสียหาย
            if (!Array.isArray(state.customers)) {
              console.warn('🔧 [Store] Customers data corrupted, resetting...');
              state.customers = [
                { id: 'C1721479200000', name: 'บริษัท A จำกัด', phone: '081-234-5678', email: 'contact@a.com' },
                { id: 'C1721479200001', name: 'คุณสมชาย ใจดี', phone: '089-876-5432', email: 'somchai@email.com' },
              ];
            }
            
            if (!Array.isArray(state.products)) {
              console.warn('🔧 [Store] Products data corrupted, resetting...');
              state.products = [
                { id: 1, name: 'iPhone 14 Pro', category: 'Electronics', quantity: 50, price: 999, lowStockThreshold: 10 },
                { id: 2, name: 'MacBook Air M2', category: 'Electronics', quantity: 5, price: 1199, lowStockThreshold: 10 },
              ];
            }
            
            if (!Array.isArray(state.sales)) {
              state.sales = [];
            }
            
            console.log('🔧 [Store] Data validated, customers:', state.customers.length);
            
            // ตั้งสถานะ hydrated
            state._isHydrated = true;
            state.setHydrated(true);
          };
        },
      }
    )
  )
);

// ตั้งสถานะ client ready เมื่อโหลดครั้งแรก
if (typeof window !== 'undefined') {
  setTimeout(() => {
    useInventoryStore.getState().setClientReady();
  }, 100);
}

export default useInventoryStore;