import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useInventoryStore = create(
  devtools(
    persist(
      (set, get) => ({
        // นี่คือส่วนที่แก้ไข
        products: [
          { id: 1, name: 'Laptop Pro 15"', category: 'Electronics', stock: 25, minStock: 10, price: 1200 },
          { id: 2, name: 'Wireless Mouse', category: 'Electronics', stock: 150, minStock: 50, price: 25 },
          { id: 3, name: 'Classic T-Shirt', category: 'Clothing', stock: 8, minStock: 20, price: 15 },
          { id: 4, name: 'Running Shoes', category: 'Clothing', stock: 45, minStock: 15, price: 80 },
          { id: 5, name: 'Coffee Maker', category: 'Home', stock: 30, minStock: 10, price: 60 },
          { id: 6, name: 'Scented Candle', category: 'Home', stock: 200, minStock: 50, price: 12 },
          { id: 7, name: '4K Monitor 27"', category: 'Electronics', stock: 5, minStock: 5, price: 350 },
          { id: 8, name: 'Bluetooth Speaker', category: 'Electronics', stock: 0, minStock: 10, price: 90 },
        ],
        // สิ้นสุดส่วนที่แก้ไข

        loading: false,
        error: null,
        filters: { search: "", category: "", status: "" },
        setProducts: (products) => set({ products }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        setFilters: (newFilters) => set((state) => ({ filters: { ...state.filters, ...newFilters } })),
        addProduct: (product) => set((state) => ({ products: [...state.products, { ...product, id: Date.now() }] })),
        updateProduct: (id, updates) => set((state) => ({
          products: state.products.map(product =>
            product.id === id ? { ...product, ...updates } : product
          )
        })),
        deleteProduct: (id) => set((state) => ({
          products: state.products.filter(product => product.id !== id)
        })),
        getFilteredProducts: () => {
          const { products, filters } = get();
          return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase());
            const matchesCategory = !filters.category || product.category === filters.category;
            const matchesStatus = !filters.status || product.status === filters.status;
            return matchesSearch && matchesCategory && matchesStatus;
          });
        },
        getLowStockProducts: () => {
          const { products } = get();
          return products.filter(product => product.stock <= product.minStock);
        },
        getInventoryStats: () => {
          const products = get().products;
          return {
            totalProducts: products.length,
            totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
            lowStockCount: products.filter(p => p.stock <= p.minStock).length,
            outOfStockCount: products.filter(p => p.stock === 0).length,
          };
        },
      }),
      { name: 'inventory-storage', partialize: (state) => ({ products: state.products }) }
    )
  )
);

export default useInventoryStore;