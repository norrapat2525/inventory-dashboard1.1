import useInventoryStore from '../stores/inventoryStore';

export const useInventoryData = () => {
  const products = useInventoryStore((state) => state.products);
  return { data: products, isLoading: false, isError: false };
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