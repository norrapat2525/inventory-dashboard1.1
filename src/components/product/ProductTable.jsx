import React, { useState, useMemo } from 'react';
// ... (import เดิม) ...
import { useInventoryData, useDeleteProduct, useCreateProduct, useUpdateProduct } from '../../hooks/useInventoryData';
// ... (import เดิม) ...

const ProductTable = () => {
  const products = useInventoryStore((state) => state.products);
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct(); // <-- เพิ่ม Hook สำหรับอัปเดต
  const deleteMutation = useDeleteProduct();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // <-- State สำหรับเก็บข้อมูลสินค้าที่กำลังแก้ไข

  const openModal = (product = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  const handleFormSubmit = (productData) => {
    if (editingProduct) {
      // โหมดแก้ไข
      updateMutation.mutate(editingProduct.id, productData);
    } else {
      // โหมดเพิ่มใหม่
      createMutation.mutate(productData);
    }
    closeModal();
  };

  const columns = useMemo(() => [
      // ... (คอลัมน์อื่นๆ เหมือนเดิม) ...
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Box>
            {/* --- ทำให้ปุ่มแก้ไขใช้งานได้ --- */}
            <IconButton size="small" onClick={() => openModal(row.original)}>
              <Edit />
            </IconButton>
            <IconButton /* ... ปุ่มลบเหมือนเดิม ... */ >
              <Delete />
            </IconButton>
          </Box>
        ),
      },
    ],
    []
  );

  // ... (โค้ด useReactTable และ return JSX เดิม) ...
  // แต่ต้องแก้ Modal ให้ส่งข้อมูล `editingProduct` ไปด้วย

  return (
    <Box /* ... */ >
      {/* ... */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <ProductForm
          productData={editingProduct}
          onSubmit={handleFormSubmit}
          onClose={closeModal}
        />
      </Modal>
    </Box>
  );
};

export default ProductTable;