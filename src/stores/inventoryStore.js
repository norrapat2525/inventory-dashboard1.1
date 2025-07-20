import useInventoryStore from '../stores/inventoryStore';

export const useInventoryData = () => {
  // ดึงข้อมูลที่จำเป็นมาจาก store
  const products = useInventoryStore((state) => state.products);
  const filters = useInventoryStore((state) => state.filters);
  
  // ทำการกรองข้อมูลใน Hook
  const filteredProducts = products.filter(product => {
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
  
  return { data: filteredProducts, isLoading: false, isError: false };
};

export const useCreateProduct = () => {
  const addProduct = useInventoryStore((state) => state.addProduct);
  
  return {
    mutateAsync: async (productData) => {
      addProduct(productData);
      return productData;
    },
    isLoading: false,
  };
};

export const useUpdateProduct = () => {
  const updateProduct = useInventoryStore((state) => state.updateProduct);
  
  return {
    mutateAsync: async ({ id, ...productData }) => {
      updateProduct(id, productData);
      return { id, ...productData };
    },
    isLoading: false,
  };
};

export const useDeleteProduct = () => {
  const deleteProduct = useInventoryStore((state) => state.deleteProduct);
  
  return {
    mutateAsync: async (id) => {
      deleteProduct(id);
      return id;
    },
    isLoading: false,
  };
};

export const useTransactionsData = () => {
  const transactions = useInventoryStore((state) => state.transactions);
  return { data: transactions, isLoading: false, isError: false };
};