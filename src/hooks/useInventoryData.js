import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  getInventoryData,
  getTransactionsData,
  createProduct,
  deleteProduct,
} from '../services/googleSheetsService';

// Hook to get all inventory data
export const useInventoryData = () => {
  return useQuery('inventory', getInventoryData);
};

// Hook to get all transaction data
export const useTransactionsData = () => {
  return useQuery('transactions', getTransactionsData);
};

// Hook to create a new product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(createProduct, {
    onSuccess: () => {
      // When a product is created, refetch the inventory list
      queryClient.invalidateQueries('inventory');
    },
  });
};

// Hook to delete a product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteProduct, {
    onSuccess: () => {
      // When a product is deleted, refetch the inventory list
      queryClient.invalidateQueries('inventory');
    },
  });
};