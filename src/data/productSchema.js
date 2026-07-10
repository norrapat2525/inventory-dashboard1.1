// =============================================================
// LANE A3: Central Product Schema (schema สินค้ากลาง + dose)
// -------------------------------------------------------------
// จุดเดียวที่นิยามโครงสร้างข้อมูลสินค้าให้ทั้งแอปใช้ร่วมกัน
// - normalizeProduct(): แปลงข้อมูลเก่าจาก Firestore ให้เข้า schema ใหม่เสมอ
//   (เอกสารเดิมที่มีแค่ name/category/quantity/price ยังใช้งานได้ ไม่ต้อง migrate)
// - dose: อัตราการใช้ต่อพื้นที่ ใช้คำนวณในหน้า "วางแผนก่อนปลูก" (LANE A2)
// - marketLinks: ลิงก์ร้านค้าบนตลาดออนไลน์ ใช้แสดงปุ่มในตารางสินค้า (LANE A1)
// =============================================================

export const PRODUCT_CATEGORIES = [
  'ปุ๋ย',
  'ยาป้องกัน/กำจัดศัตรูพืช',
  'เมล็ดพันธุ์',
  'ฮอร์โมน/อาหารเสริม',
  'อุปกรณ์',
  'อื่นๆ',
];

// หน่วยนับสต็อก (1 หน่วย = สินค้า 1 ชิ้นที่ขาย)
export const PRODUCT_UNITS = [
  'กระสอบ',
  'ถุง',
  'ขวด',
  'แกลลอน',
  'กล่อง',
  'กิโลกรัม',
  'ลิตร',
  'ชิ้น',
];

// หน่วยของอัตราการใช้ต่อไร่ — ตัวตั้ง (กก., ลิตร ฯลฯ) ต้องเป็นหน่วยเดียวกับ packSize.unit
// เพื่อให้คำนวณจำนวนหน่วยสต็อกที่ต้องใช้ได้
export const DOSE_UNITS = [
  'กก./ไร่',
  'กรัม/ไร่',
  'ลิตร/ไร่',
  'ซีซี/ไร่',
  'เมล็ด/ไร่',
];

export const MARKETPLACES = [
  { key: 'shopee', label: 'Shopee', color: '#EE4D2D' },
  { key: 'lazada', label: 'Lazada', color: '#101B69' },
  { key: 'tiktok', label: 'TikTok Shop', color: '#161823' },
  { key: 'other', label: 'อื่นๆ', color: '#546E7A' },
];

export const createEmptyProduct = () => ({
  name: '',
  category: '',
  quantity: 0,
  price: 0,
  lowStockThreshold: 5,
  unit: 'ชิ้น',
  // ขนาดบรรจุต่อ 1 หน่วยสต็อก เช่น กระสอบละ 50 กก. => { amount: 50, unit: 'กก.' }
  packSize: { amount: 0, unit: '' },
  // อัตราการใช้ต่อไร่ เช่น 50 กก./ไร่ => { amount: 50, unit: 'กก./ไร่', note: 'รองพื้นก่อนปลูก' }
  dose: { amount: 0, unit: 'กก./ไร่', note: '' },
  marketLinks: { shopee: '', lazada: '', tiktok: '', other: '' },
});

const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

// แปลงเอกสารจาก Firestore (รูปแบบเก่าหรือใหม่) ให้ครบทุก field ตาม schema กลาง
export const normalizeProduct = (raw = {}) => {
  const empty = createEmptyProduct();
  return {
    ...(raw.id ? { id: raw.id } : {}),
    name: raw.name || '',
    category: raw.category || '',
    quantity: toNumber(raw.quantity),
    price: toNumber(raw.price),
    lowStockThreshold: toNumber(raw.lowStockThreshold, empty.lowStockThreshold),
    unit: raw.unit || empty.unit,
    packSize: {
      amount: toNumber(raw.packSize?.amount),
      unit: raw.packSize?.unit || '',
    },
    dose: {
      amount: toNumber(raw.dose?.amount),
      unit: raw.dose?.unit || empty.dose.unit,
      note: raw.dose?.note || '',
    },
    marketLinks: {
      shopee: raw.marketLinks?.shopee || '',
      lazada: raw.marketLinks?.lazada || '',
      tiktok: raw.marketLinks?.tiktok || '',
      other: raw.marketLinks?.other || '',
    },
  };
};

export const validateProduct = (product) => {
  const errors = {};
  if (!product.name?.trim()) errors.name = 'กรุณาระบุชื่อสินค้า';
  if (!product.category?.trim()) errors.category = 'กรุณาระบุหมวดหมู่';
  if (toNumber(product.quantity) < 0) errors.quantity = 'จำนวนต้องไม่ติดลบ';
  if (toNumber(product.price) < 0) errors.price = 'ราคาต้องไม่ติดลบ';
  Object.entries(product.marketLinks || {}).forEach(([key, url]) => {
    if (url && !/^https?:\/\//i.test(url)) {
      errors[`marketLinks.${key}`] = 'ลิงก์ต้องขึ้นต้นด้วย http:// หรือ https://';
    }
  });
  return { valid: Object.keys(errors).length === 0, errors };
};

// คืนรายการลิงก์ตลาดที่กรอกไว้ พร้อม label/สีสำหรับแสดงปุ่ม (LANE A1)
export const getMarketLinks = (product) =>
  MARKETPLACES.filter(({ key }) => product?.marketLinks?.[key]).map((m) => ({
    ...m,
    url: product.marketLinks[m.key],
  }));

// -------------------------------------------------------------
// LANE A2: คำนวณปริมาณที่ต้องใช้สำหรับพื้นที่ปลูก (หน่วย: ไร่)
// -------------------------------------------------------------
// totalNeeded  = dose.amount × areaRai (หน่วยตามตัวตั้งของ dose.unit)
// unitsNeeded  = จำนวนหน่วยสต็อกที่ต้องใช้ (ปัดขึ้น) — ถ้ามี packSize จะหารด้วยขนาดบรรจุ
//                ถ้าไม่มี packSize จะถือว่า 1 หน่วยสต็อก = 1 หน่วยของ dose
// shortage     = จำนวนหน่วยที่ขาด เทียบกับสต็อกปัจจุบัน
export const calcRequiredForArea = (product, areaRai) => {
  const p = normalizeProduct(product);
  const area = Math.max(0, toNumber(areaRai));
  const totalNeeded = p.dose.amount * area;
  const perUnit = p.packSize.amount > 0 ? p.packSize.amount : 1;
  const unitsNeeded = totalNeeded > 0 ? Math.ceil(totalNeeded / perUnit) : 0;
  const shortage = Math.max(0, unitsNeeded - p.quantity);
  const doseBaseUnit = p.dose.unit.split('/')[0] || '';
  return {
    doseAmount: p.dose.amount,
    doseUnit: p.dose.unit,
    totalNeeded,
    totalNeededUnit: p.packSize.unit || doseBaseUnit,
    unitsNeeded,
    stockUnit: p.unit,
    inStock: p.quantity,
    shortage,
    estimatedCost: unitsNeeded * p.price,
  };
};
