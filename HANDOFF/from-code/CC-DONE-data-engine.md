# CC-DONE: data-engine — LANE A เสร็จครบ 3 ข้อ

- **วันที่:** 2026-07-10
- **Branch:** `claude/data-engine-lane-a-rdnxom`
- **ขอบเขต:** ทำเฉพาะ LANE A (A1, A2, A3) — **ไม่แตะ LANE B ใดๆ ทั้งสิ้น**

> ⚠️ หมายเหตุ: ไม่พบไฟล์ `CLAUDE-CODE-TASK-data-engine.md` ใน repo / GitHub / Google Drive / Gmail
> จึงทำงานตามสรุปในคำสั่ง: A1 ปุ่มลิงก์ตลาด / A2 วางแผนก่อนปลูก v1 / A3 schema สินค้ากลาง + dose
> ถ้า spec ตัวจริงมีรายละเอียดต่างจากนี้ แจ้งได้เลย ปรับตามได้ทันที

---

## A3 — Schema สินค้ากลาง + dose ✅ (ทำก่อนเพราะเป็นฐานของ A1/A2)

**ไฟล์ใหม่:** `src/data/productSchema.js` — จุดเดียวที่นิยามโครงสร้างสินค้าให้ทั้งแอป

โครงสร้างสินค้า (เพิ่มจากของเดิม `name/category/quantity/price/lowStockThreshold`):

| Field | ความหมาย | ตัวอย่าง |
|---|---|---|
| `unit` | หน่วยนับสต็อก | กระสอบ, ถุง, ขวด |
| `packSize` | ขนาดบรรจุต่อ 1 หน่วยสต็อก | `{ amount: 50, unit: 'กก.' }` |
| `dose` | อัตราการใช้ต่อไร่ + หมายเหตุ | `{ amount: 50, unit: 'กก./ไร่', note: 'รองพื้นก่อนปลูก' }` |
| `marketLinks` | ลิงก์ตลาดออนไลน์ | `{ shopee, lazada, tiktok, other }` |

Helper ที่ export ให้ใช้ทั่วแอป:
- `normalizeProduct(raw)` — แปลงเอกสาร Firestore เก่า/ใหม่ให้ครบทุก field เสมอ → **ข้อมูลเดิมใน Firestore ใช้ได้ทันที ไม่ต้อง migrate**
- `validateProduct(product)` — ตรวจชื่อ/หมวด/ตัวเลขติดลบ/รูปแบบ URL
- `getMarketLinks(product)` — คืนเฉพาะตลาดที่กรอกลิงก์ พร้อม label+สีปุ่ม
- `calcRequiredForArea(product, areaRai)` — คำนวณปริมาณที่ต้องใช้/จำนวนหน่วยสต็อก(ปัดขึ้น)/ส่วนที่ขาด/ค่าใช้จ่ายประมาณ
- ค่าคงที่: `PRODUCT_CATEGORIES`, `PRODUCT_UNITS`, `DOSE_UNITS`, `MARKETPLACES`

**เชื่อมเข้าระบบ:** `src/stores/inventoryStore.js` เรียก `normalizeProduct` ตอน fetch / addProduct / updateProduct และ `src/components/product/ProductForm.jsx` เพิ่มช่องกรอก หน่วยนับ, ขนาดบรรจุ, อัตราใช้ต่อไร่, หมายเหตุ, ลิงก์ตลาด 4 ช่อง (มี validation URL)

## A1 — ปุ่มลิงก์ตลาด ✅

- `src/components/product/ProductTable.jsx` เพิ่มคอลัมน์ **"ลิงก์ตลาด"**
- แสดงปุ่ม Chip สีตามแบรนด์ (Shopee ส้ม / Lazada น้ำเงิน / TikTok ดำ / อื่นๆ เทา) เฉพาะตลาดที่กรอกลิงก์ไว้ กดแล้วเปิดแท็บใหม่ (`target="_blank" rel="noopener noreferrer"`) สินค้าที่ไม่มีลิงก์แสดง "—"
- กรอก/แก้ลิงก์ได้จากฟอร์มสินค้า (Add/Edit Product)

## A2 — วางแผนก่อนปลูก v1 ✅

- **ไฟล์ใหม่:** `src/pages/PlantingPlannerPage.jsx` — route `/planner` + เมนู "วางแผนปลูก" (ไอคอน 🚜) ใน sidebar
- การทำงาน v1:
  1. กรอก **พืชที่จะปลูก / พื้นที่ (ไร่) / วันที่คาดว่าจะปลูก** (วันที่ไม่บังคับ)
  2. เลือกสินค้าจาก Autocomplete (แสดงเฉพาะสินค้าที่ตั้งค่า dose แล้ว — มี Alert แนะนำถ้ายังไม่มี)
  3. ตารางคำนวณอัตโนมัติ: อัตราใช้ → ต้องใช้ทั้งหมด → จำนวนหน่วยสต็อกที่ต้องใช้ (ปัดขึ้นตามขนาดบรรจุ) → สถานะสต็อก **พอ/ขาด** → ค่าใช้จ่ายประมาณ + ยอดรวม
  4. **บันทึกแผน** ลง Firestore collection ใหม่ `plans` (snapshot ราคา/สต็อก ณ วันวางแผน) — แสดงการ์ดแผนที่บันทึกไว้ + ลบได้ (มี dialog ยืนยัน)
- ตัวอย่างที่ทดสอบจริง: ปุ๋ย 50 กก./ไร่ กระสอบละ 50 กก. พื้นที่ 10 ไร่ → ต้องใช้ 500 กก. = 10 กระสอบ, สต็อกมี 6 → **ขาด 4 กระสอบ**, ค่าใช้จ่าย ฿12,000 ✔

---

## ไฟล์ที่แตะทั้งหมด

| ไฟล์ | สถานะ | Lane |
|---|---|---|
| `src/data/productSchema.js` | ใหม่ | A3 |
| `src/stores/inventoryStore.js` | แก้ (normalize + plans actions) | A3, A2 |
| `src/components/product/ProductForm.jsx` | แก้ (ช่อง dose/packSize/ลิงก์ตลาด) | A3, A1 |
| `src/components/product/ProductTable.jsx` | แก้ (คอลัมน์ลิงก์ตลาด) | A1 |
| `src/pages/PlantingPlannerPage.jsx` | ใหม่ | A2 |
| `src/routes/AppRoutes.jsx` | แก้ (route `/planner`) | A2 |
| `src/components/layout/DashboardLayout.jsx` | แก้ (เมนู "วางแผนปลูก") | A2 |

## การตรวจสอบ

- ✅ `npm run build` ผ่าน (มี warning ขนาด chunk >500kB — ของเดิม ไม่เกี่ยวกับงานนี้)
- ✅ `npx eslint` ไฟล์ที่แตะทั้งหมดผ่าน (แถมเก็บ unused `catch (error)` เดิมในสโตร์ให้ lint ผ่าน)
- ✅ ทดสอบ helper ด้วย node: normalize ข้อมูลเก่า, คำนวณ dose มี/ไม่มี packSize, getMarketLinks, validate URL — ผ่านทุกเคส
- Backward compatible: เอกสาร products เดิมใน Firestore ไม่ต้องแก้อะไร

## สิ่งที่เหลือ / ข้อเสนอสำหรับรอบถัดไป (ไม่ได้ทำ — นอกขอบเขต v1)

- ปุ่ม "สร้างใบสั่งซื้อ" จากรายการที่ขาดในแผนปลูก
- แปลงหน่วย dose อัตโนมัติ (กรัม↔กก., ซีซี↔ลิตร) — ตอนนี้ตัวตั้งของ dose ต้องเป็นหน่วยเดียวกับหน่วยบรรจุ
- ผูกแผนปลูกกับลูกค้า (customers) และแจ้งเตือนก่อนถึงวันปลูก
- **LANE B: ไม่ได้แตะตามคำสั่ง**
