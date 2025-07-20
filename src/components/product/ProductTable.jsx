import React, { useState, useMemo } from 'react';
// ... (import เดิม) ...
import ProductFilter from './ProductFilter'; // 1. Import คอมโพเนนต์ใหม่

const ProductTable = () => {
  const { data: products = [] } = useInventoryData(); // 2. Hook นี้จะคืนค่าสินค้าที่กรองแล้วโดยอัตโนมัติ
  // ... (โค้ด hook อื่นๆ และ state ของ modal เหมือนเดิม) ...

  const columns = useMemo(() => [ /* ... คอลัมน์เหมือนเดิม ... */ ], []);

  const table = useReactTable({
    data: products,
    columns,
    // 3. เราไม่ต้องการ state สำหรับ globalFilter ในนี้อีกต่อไป
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>Product List</Typography>
        <Button variant="contained" onClick={() => openModal()}>Add New Product</Button>
      </Box>

      {/* 4. นำ ProductFilter มาใช้งานแทน TextField เดิม */}
      <ProductFilter />

      {/* ... (โค้ด TableContainer และ Modal เหมือนเดิม) ... */}
    </Box>
  );
};

export default ProductTable;