import React, { useState, useEffect } from 'react';

/**
 * คอมโพเนนต์นี้จะ Render children ของมันก็ต่อเมื่อ
 * มันทำงานอยู่บนฝั่ง Client (เบราว์เซอร์) เท่านั้น
 * เพื่อป้องกันปัญหา Hydration Error
 */
const ClientOnly = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null; // ในระหว่างที่ยังไม่พร้อม จะไม่แสดงอะไรเลย
  }

  return <>{children}</>;
};

export default ClientOnly;
