import { create } from 'zustand';

const useInventoryStore = create((set, get) => ({
  // State
  products: [
    {
      id: 1,
      name: 'iPhone 14 Pro',
      category: 'Electronics',
      quantity: 50,
      price: 999,
      lowStockThreshold: 10,
    },
    {
      id: 2,
      name: 'MacBook Air M2',
      category: 'Electronics',
      quantity: 5,
      price: 1199,
      lowStockThreshold: 10,
    },
    {
      id: 3,
      name: 'AirPods Pro',
      category: 'Electronics',
      quantity: 0,
      price: 249,
      lowStockThreshold: 10,
    },
    {
      id: 4,
      name: 'Coffee Mug',
      category: 'Home & Kitchen',
      quantity: 25,
      price: 15,
      lowStockThreshold: 5,
    },
  ],
  
  transactions: [
    {
      id: 1,
      productId: 1,
      type: 'in',
      quantity: 20,
      date: '2024-01-15',
      note: 'Initial stock',
    },
    {
      id: 2,
      productId: 2,
      type: 'out',
      quantity: 2,
      date: '2024-01-16',
      note: 'Sale to customer',
    },
  ],

  notifications: [],

  // เพิ่ม filters state
  filters: {
    search: '',
    category: '',
    status: '',
  },

  // Actions
  addProduct: (product) => {
    set((state) => ({
      products: [...state.products, { ...product, id: Date.now() }]
    }));
  },

  updateProduct: (id, updatedProduct) => {
    set((state) => ({
      products: state.products.map(p => 
        p.id === id ? { ...p, ...updatedProduct } : p
      )
    }));
  },

  deleteProduct: (id) => {
    set((state) => ({
      products: state.products.filter(p => p.id !== id)
    }));
  },

  addTransaction: (transaction) => {
    set((state) => ({
      transactions: [...state.transactions, { ...transaction, id: Date.now() }]
    }));
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [...state.notifications, { 
        ...notification, 
        id: Date.now(),
        timestamp: new Date().toISOString() 
      }]
    }));
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },

  clearAllNotifications: () => {
    set({ notifications: [] });
  },

  // เพิ่มฟังก์ชัน setFilters
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },

  // เพิ่มฟังก์ชัน getFilteredProducts
  getFilteredProducts: () => {
    const { products, filters } = get();
    
    return products.filter(product => {
      // Filter by search term
      const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase());
      
      // Filter by category
      const matchesCategory = !filters.category || product.category === filters.category;
      
      // Filter by status
      let matchesStatus = true;
      if (filters.status) {
        if (filters.status === 'out-of-stock') {
          matchesStatus = product.quantity === 0;
        } else if (filters.status === 'low-stock') {
          matchesStatus = product.quantity > 0 && product.quantity <= product.lowStockThreshold;
        } else if (filters.status === 'in-stock') {
          matchesStatus = product.quantity > product.lowStockThreshold;
        }
      }
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  },

  // Helper functions
  getProductById: (id) => {
    return get().products.find(p => p.id === id);
  },

  getLowStockProducts: () => {
    return get().products.filter(p => 
      p.quantity > 0 && p.quantity <= p.lowStockThreshold
    );
  },

  getOutOfStockProducts: () => {
    return get().products.filter(p => p.quantity === 0);
  },
}));

export default useInventoryStore;