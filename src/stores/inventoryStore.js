import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useInventoryStore = create(
  persist(
    (set, get) => ({
      //================== STATE (สถานะข้อมูล) ==================
      products: [
        { id: 1, name: 'iPhone 14 Pro', category: 'Electronics', quantity: 50, price: 999, lowStockThreshold: 10 },
        { id: 2, name: 'MacBook Air M2', category: 'Electronics', quantity: 5, price: 1199, lowStockThreshold: 10 },
        { id: 3, name: 'AirPods Pro', category: 'Electronics', quantity: 0, price: 249, lowStockThreshold: 10 },
        { id: 4, name: 'Coffee Mug', category: 'Home & Kitchen', quantity: 25, price: 15, lowStockThreshold: 5 },
        { id: 5, name: 'Wireless Mouse', category: 'Electronics', quantity: 3, price: 45, lowStockThreshold: 5 },
      ],
      transactions: [
        { id: 1, productId: 1, type: 'in', quantity: 20, date: '2024-01-15', note: 'Initial stock' },
        { id: 2, productId: 2, type: 'out', quantity: 2, date: '2024-01-16', note: 'Sale to customer' },
        { id: 3, productId: 4, type: 'in', quantity: 50, date: '2024-01-17', note: 'Bulk purchase' },
      ],
      notifications: [],

      //================== ACTIONS (ฟังก์ชันจัดการข้อมูล) ==================
      // Product Actions
      addProduct: (product) => {
        const newProduct = {
          ...product,
          id: Date.now(),
          quantity: Number(product.quantity) || 0,
          price: Number(product.price) || 0,
          lowStockThreshold: Number(product.lowStockThreshold) || 5,
        };
        set((state) => ({ products: [...state.products, newProduct] }));
        get().addNotification({ type: 'success', message: `Product "${product.name}" has been added successfully!` });
      },
      updateProduct: (id, updatedProduct) => {
        set((state) => ({
          products: state.products.map(p =>
            p.id === id ? {
              ...p,
              ...updatedProduct,
              quantity: Number(updatedProduct.quantity) || 0,
              price: Number(updatedProduct.price) || 0,
              lowStockThreshold: Number(updatedProduct.lowStockThreshold) || 5,
            } : p
          )
        }));
        get().addNotification({ type: 'info', message: `Product "${updatedProduct.name}" has been updated!` });
      },
      deleteProduct: (id) => {
        const product = get().products.find(p => p.id === id);
        set((state) => ({
          products: state.products.filter(p => p.id !== id)
        }));
        if (product) {
          get().addNotification({ type: 'warning', message: `Product "${product.name}" has been deleted!` });
        }
      },

      // Transaction Actions
      addTransaction: (transaction) => {
        const newTransaction = {
          ...transaction,
          id: Date.now(),
          date: new Date().toISOString().split('T')[0],
        };
        set((state) => ({
          transactions: [newTransaction, ...state.transactions]
        }));
        
        const quantityChange = transaction.type === 'in' ? Number(transaction.quantity) : -Number(transaction.quantity);
        const product = get().products.find(p => p.id === transaction.productId);
        if (product) {
            const newQuantity = Math.max(0, product.quantity + quantityChange);
            get().updateProduct(transaction.productId, { ...product, quantity: newQuantity });
        }
      },

      // Notification Actions
      addNotification: (notification) => {
        set((state) => ({
          notifications: [...state.notifications, { ...notification, id: Date.now(), timestamp: new Date().toISOString() }]
        }));
      },
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      },

      //================== HELPERS / GETTERS (ฟังก์ชันดึงข้อมูลสรุป) ==================
      getLowStockProducts: () => {
        return get().products.filter(p => p.quantity > 0 && p.quantity <= p.lowStockThreshold);
      },
      getOutOfStockProducts: () => {
        return get().products.filter(p => p.quantity === 0);
      },
      getInventoryStats: () => {
        const products = get().products;
        const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
        return {
          totalProducts: products.length,
          totalValue: totalValue,
          lowStockCount: get().getLowStockProducts().length,
          outOfStockCount: get().getOutOfStockProducts().length,
        };
      },
    }),
    {
      name: 'inventory-storage', // key for localStorage
      partialize: (state) => ({
        products: state.products,
        transactions: state.transactions
      }),
    }
  )
);

export default useInventoryStore;
