import { create } from 'zustand';
import { db } from '../firebaseConfig';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';

const useInventoryStore = create((set, get) => ({
  //================== STATE ==================
  products: [],
  customers: [],
  sales: [],
  notifications: [],
  isLoading: true, // เริ่มต้นด้วยสถานะกำลังโหลด

  //================== ACTIONS ==================
  fetchInitialData: async () => {
    // ตั้งค่า isLoading เป็น true ก่อนเริ่มดึงข้อมูล
    if (!get().isLoading) set({ isLoading: true });
    try {
      const productsSnapshot = await getDocs(collection(db, "products"));
      const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const customersSnapshot = await getDocs(collection(db, "customers"));
      const customersData = customersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const salesSnapshot = await getDocs(collection(db, "sales"));
      const salesData = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      set({ 
        products: productsData, 
        customers: customersData, 
        sales: salesData, 
        isLoading: false // ดึงข้อมูลเสร็จแล้ว
      });
    } catch (error) {
      console.error("Error fetching initial data:", error);
      set({ isLoading: false }); // หากมีข้อผิดพลาด ให้หยุดโหลด
    }
  },

  addProduct: async (productData) => {
    try {
      const docRef = await addDoc(collection(db, "products"), productData);
      const newProduct = { id: docRef.id, ...productData };
      set((state) => ({ products: [...state.products, newProduct] }));
      get().addNotification({ type: 'success', message: `Product "${productData.name}" added.` });
    } catch (error) {
      console.error("Error adding product:", error);
      get().addNotification({ type: 'error', message: 'Failed to add product.' });
    }
  },
  updateProduct: async (id, updatedData) => {
    const productDoc = doc(db, "products", id);
    try {
      await updateDoc(productDoc, updatedData);
      set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updatedData } : p)
      }));
      get().addNotification({ type: 'info', message: `Product updated.` });
    } catch (error) {
      console.error("Error updating product:", error);
      get().addNotification({ type: 'error', message: 'Failed to update product.' });
    }
  },
  deleteProduct: async (id) => {
    const product = get().products.find(p => p.id === id);
    const productDoc = doc(db, "products", id);
    try {
      await deleteDoc(productDoc);
      set((state) => ({ products: state.products.filter(p => p.id !== id) }));
      if (product) get().addNotification({ type: 'warning', message: `Product "${product.name}" deleted.` });
    } catch (error) {
      console.error("Error deleting product:", error);
      get().addNotification({ type: 'error', message: 'Failed to delete product.' });
    }
  },

  addCustomer: async (customerData) => {
    try {
      const docRef = await addDoc(collection(db, "customers"), customerData);
      const newCustomer = { id: docRef.id, ...customerData };
      set((state) => ({ customers: [...state.customers, newCustomer] }));
      get().addNotification({ type: 'success', message: `Customer "${customerData.name}" added.` });
    } catch (error) {
      console.error("Error adding customer:", error);
      get().addNotification({ type: 'error', message: 'Failed to add customer.' });
    }
  },
  
  updateCustomer: async (id, updatedData) => {
    const customerDoc = doc(db, "customers", id);
    try {
      await updateDoc(customerDoc, updatedData);
      set((state) => ({
        customers: state.customers.map(c => c.id === id ? { ...c, ...updatedData } : c)
      }));
      get().addNotification({ type: 'info', message: `Customer updated.` });
    } catch (error) {
      console.error("Error updating customer:", error);
      get().addNotification({ type: 'error', message: 'Failed to update customer.' });
    }
  },
  deleteCustomer: async (id) => {
    const customer = get().customers.find(c => c.id === id);
    const customerDoc = doc(db, "customers", id);
    try {
      await deleteDoc(customerDoc);
      set((state) => ({ customers: state.customers.filter(c => c.id !== id) }));
      if (customer) get().addNotification({ type: 'warning', message: `Customer "${customer.name}" deleted.` });
    } catch (error) {
      console.error("Error deleting customer:", error);
      get().addNotification({ type: 'error', message: 'Failed to delete customer.' });
    }
  },
  
  addNotification: (notification) => set((state) => ({ notifications: [...state.notifications, { ...notification, id: Date.now() }] })),
  removeNotification: (id) => set((state) => ({ notifications: state.notifications.filter(n => n.id !== id) })),
}));

export default useInventoryStore;
