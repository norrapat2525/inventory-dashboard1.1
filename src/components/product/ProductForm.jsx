import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
  MenuItem,
  Typography,
  Divider,
  InputAdornment,
} from '@mui/material';
import useInventoryStore from '../../stores/inventoryStore';
import {
  createEmptyProduct,
  normalizeProduct,
  validateProduct,
  PRODUCT_CATEGORIES,
  PRODUCT_UNITS,
  DOSE_UNITS,
  MARKETPLACES,
} from '../../data/productSchema';

// แปลง product (nested) -> ค่าใน form (ทุกช่องเป็น string เพื่อผูกกับ TextField)
const toFormValues = (product) => {
  const p = normalizeProduct(product);
  return {
    name: p.name,
    category: p.category,
    quantity: String(p.quantity ?? ''),
    price: String(p.price ?? ''),
    lowStockThreshold: String(p.lowStockThreshold ?? ''),
    unit: p.unit,
    packSizeAmount: p.packSize.amount ? String(p.packSize.amount) : '',
    packSizeUnit: p.packSize.unit,
    doseAmount: p.dose.amount ? String(p.dose.amount) : '',
    doseUnit: p.dose.unit,
    doseNote: p.dose.note,
    linkShopee: p.marketLinks.shopee,
    linkLazada: p.marketLinks.lazada,
    linkTiktok: p.marketLinks.tiktok,
    linkOther: p.marketLinks.other,
  };
};

// แปลงค่าใน form กลับเป็น product ตาม schema กลาง
const toProductData = (form) =>
  normalizeProduct({
    name: form.name.trim(),
    category: form.category.trim(),
    quantity: Number(form.quantity) || 0,
    price: Number(form.price) || 0,
    lowStockThreshold: Number(form.lowStockThreshold) || 0,
    unit: form.unit,
    packSize: { amount: Number(form.packSizeAmount) || 0, unit: form.packSizeUnit.trim() },
    dose: { amount: Number(form.doseAmount) || 0, unit: form.doseUnit, note: form.doseNote.trim() },
    marketLinks: {
      shopee: form.linkShopee.trim(),
      lazada: form.linkLazada.trim(),
      tiktok: form.linkTiktok.trim(),
      other: form.linkOther.trim(),
    },
  });

const marketFieldName = { shopee: 'linkShopee', lazada: 'linkLazada', tiktok: 'linkTiktok', other: 'linkOther' };

const ProductForm = ({ open, handleClose, productToEdit }) => {
  const addProduct = useInventoryStore((state) => state.addProduct);
  const updateProduct = useInventoryStore((state) => state.updateProduct);

  const [formData, setFormData] = useState(toFormValues(createEmptyProduct()));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(toFormValues(productToEdit || createEmptyProduct()));
    setErrors({});
  }, [productToEdit, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = toProductData(formData);
    const { valid, errors: validationErrors } = validateProduct(productData);
    if (!valid) {
      setErrors(validationErrors);
      return;
    }

    if (productToEdit) {
      updateProduct(productToEdit.id, productData);
    } else {
      addProduct(productData);
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{productToEdit ? 'Edit Product' : 'Add New Product'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Product Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                margin="dense"
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="category"
                label="Category"
                value={formData.category}
                onChange={handleChange}
                select
                fullWidth
                required
                margin="dense"
                error={!!errors.category}
                helperText={errors.category}
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
                {/* รองรับหมวดหมู่เดิมที่ไม่อยู่ในลิสต์มาตรฐาน */}
                {formData.category && !PRODUCT_CATEGORIES.includes(formData.category) && (
                  <MenuItem value={formData.category}>{formData.category}</MenuItem>
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="unit"
                label="หน่วยนับสต็อก"
                value={formData.unit}
                onChange={handleChange}
                select
                fullWidth
                margin="dense"
              >
                {PRODUCT_UNITS.map((u) => (
                  <MenuItem key={u} value={u}>{u}</MenuItem>
                ))}
                {formData.unit && !PRODUCT_UNITS.includes(formData.unit) && (
                  <MenuItem value={formData.unit}>{formData.unit}</MenuItem>
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="quantity"
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                fullWidth
                required
                margin="dense"
                error={!!errors.quantity}
                helperText={errors.quantity}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="price"
                label="Price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                required
                margin="dense"
                error={!!errors.price}
                helperText={errors.price}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="lowStockThreshold"
                label="Low Stock Threshold"
                type="number"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                fullWidth
                required
                margin="dense"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" color="text.secondary">
                ขนาดบรรจุ & อัตราการใช้ (สำหรับวางแผนก่อนปลูก)
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                name="packSizeAmount"
                label="ขนาดบรรจุ"
                type="number"
                value={formData.packSizeAmount}
                onChange={handleChange}
                fullWidth
                margin="dense"
                inputProps={{ min: 0, step: 'any' }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                name="packSizeUnit"
                label="หน่วยบรรจุ (เช่น กก.)"
                value={formData.packSizeUnit}
                onChange={handleChange}
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                name="doseAmount"
                label="อัตราใช้ต่อไร่"
                type="number"
                value={formData.doseAmount}
                onChange={handleChange}
                fullWidth
                margin="dense"
                inputProps={{ min: 0, step: 'any' }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                name="doseUnit"
                label="หน่วย"
                value={formData.doseUnit}
                onChange={handleChange}
                select
                fullWidth
                margin="dense"
              >
                {DOSE_UNITS.map((u) => (
                  <MenuItem key={u} value={u}>{u}</MenuItem>
                ))}
                {formData.doseUnit && !DOSE_UNITS.includes(formData.doseUnit) && (
                  <MenuItem value={formData.doseUnit}>{formData.doseUnit}</MenuItem>
                )}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="doseNote"
                label="หมายเหตุการใช้ (เช่น รองพื้นก่อนปลูก / ผสมน้ำฉีดพ่น)"
                value={formData.doseNote}
                onChange={handleChange}
                fullWidth
                margin="dense"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" color="text.secondary">
                ลิงก์ตลาดออนไลน์
              </Typography>
            </Grid>
            {MARKETPLACES.map((m) => (
              <Grid item xs={12} sm={6} key={m.key}>
                <TextField
                  name={marketFieldName[m.key]}
                  label={`ลิงก์ ${m.label}`}
                  value={formData[marketFieldName[m.key]]}
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                  placeholder="https://..."
                  error={!!errors[`marketLinks.${m.key}`]}
                  helperText={errors[`marketLinks.${m.key}`]}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">🔗</InputAdornment>,
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {productToEdit ? 'Save Changes' : 'Add Product'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductForm;
