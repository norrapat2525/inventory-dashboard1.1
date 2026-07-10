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
import { normalizeProduct } from '../data/productSchema';

const useInventoryStore = create((set, get) => ({
  //================== STATE ==================
  products: [],
  customers: [],
  sales: [],
  plans: [], // แผนก่อนปลูก (LANE A2)
  notifications: [],
  isLoading: true, // เริ่มต้นด้วยสถานะกำลังโหลด

  //================== ACTIONS ==================
  fetchInitialData: async () => {
    if (!get().isLoading) set({ isLoading: true });
    try {
      const productsSnapshot = await getDocs(collection(db, "products"));
      // normalize ทุกเอกสารให้เข้า schema สินค้ากลาง (เอกสารเก่าจะถูกเติม field ที่ขาดอัตโนมัติ)
      const productsData = productsSnapshot.docs.map(doc => normalizeProduct({ id: doc.id, ...doc.data() }));

      const customersSnapshot = await getDocs(collection(db, "customers"));
      const customersData = customersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const salesSnapshot = await getDocs(collection(db, "sales"));
      const salesData = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const plansSnapshot = await getDocs(collection(db, "plans"));
      const plansData = plansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      set({
        products: productsData,
        customers: customersData,
        sales: salesData,
        plans: plansData,
        isLoading: false
      });
    } catch (error) {
      console.error("Error fetching initial data:", error);
      set({ isLoading: false });
    }
  },

  addProduct: async (productData) => {
    try {
      const normalized = normalizeProduct(productData);
      const docRef = await addDoc(collection(db, "products"), normalized);
      const newProduct = { id: docRef.id, ...normalized };
      set((state) => ({ products: [...state.products, newProduct] }));
      get().addNotification({ type: 'success', message: `Product "${productData.name}" added.` });
    } catch {
      get().addNotification({ type: 'error', message: 'Failed to add product.' });
    }
  },
  updateProduct: async (id, updatedData) => {
    const productDoc = doc(db, "products", id);
    try {
      await updateDoc(productDoc, updatedData);
      set((state) => ({
        products: state.products.map(p => p.id === id ? normalizeProduct({ ...p, ...updatedData }) : p)
      }));
      get().addNotification({ type: 'info', message: `Product updated.` });
    } catch {
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
    } catch {
      get().addNotification({ type: 'error', message: 'Failed to delete product.' });
    }
  },

  addCustomer: async (customerData) => {
    try {
      const docRef = await addDoc(collection(db, "customers"), customerData);
      const newCustomer = { id: docRef.id, ...customerData };
      set((state) => ({ customers: [...state.customers, newCustomer] }));
      get().addNotification({ type: 'success', message: `Customer "${customerData.name}" added.` });
    } catch {
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
    } catch {
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
    } catch {
      get().addNotification({ type: 'error', message: 'Failed to delete customer.' });
    }
  },
  
  //================== PLANTING PLANS (LANE A2) ==================
  addPlan: async (planData) => {
    try {
      const plan = { ...planData, createdAt: new Date().toISOString() };
      const docRef = await addDoc(collection(db, "plans"), plan);
      set((state) => ({ plans: [...state.plans, { id: docRef.id, ...plan }] }));
      get().addNotification({ type: 'success', message: `บันทึกแผนปลูก "${planData.cropName}" แล้ว` });
    } catch {
      get().addNotification({ type: 'error', message: 'บันทึกแผนปลูกไม่สำเร็จ' });
    }
  },
  deletePlan: async (id) => {
    const planDoc = doc(db, "plans", id);
    try {
      await deleteDoc(planDoc);
      set((state) => ({ plans: state.plans.filter(p => p.id !== id) }));
      get().addNotification({ type: 'warning', message: 'ลบแผนปลูกแล้ว' });
    } catch {
      get().addNotification({ type: 'error', message: 'ลบแผนปลูกไม่สำเร็จ' });
    }
  },

  addNotification: (notification) => set((state) => ({ notifications: [...state.notifications, { ...notification, id: Date.now() }] })),
  removeNotification: (id) => set((state) => ({ notifications: state.notifications.filter(n => n.id !== id) })),
}));

export default useInventoryStore;