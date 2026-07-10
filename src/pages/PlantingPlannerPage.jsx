import React, { useState, useMemo } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Grid, MenuItem, Chip, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Alert, Card, CardContent, Autocomplete,
} from '@mui/material';
import { Delete, Save, Agriculture } from '@mui/icons-material';
import useInventoryStore from '../stores/inventoryStore';
import { calcRequiredForArea } from '../data/productSchema';
import ConfirmationDialog from '../components/common/ConfirmationDialog';

// =============================================================
// LANE A2: วางแผนก่อนปลูก v1
// -------------------------------------------------------------
// กรอกพืชที่จะปลูก + พื้นที่ (ไร่) แล้วเลือกสินค้าที่จะใช้
// ระบบคำนวณจาก dose (อัตราใช้ต่อไร่) ใน schema สินค้ากลาง (LANE A3):
//   ปริมาณที่ต้องใช้ / จำนวนหน่วยสต็อกที่ต้องใช้ / สต็อกพอไหม / ค่าใช้จ่ายโดยประมาณ
// บันทึกแผนลง Firestore collection "plans" ได้
// =============================================================

const formatNumber = (n) =>
  Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

const PlantingPlannerPage = () => {
  const products = useInventoryStore((state) => state.products);
  const plans = useInventoryStore((state) => state.plans);
  const addPlan = useInventoryStore((state) => state.addPlan);
  const deletePlan = useInventoryStore((state) => state.deletePlan);

  const [cropName, setCropName] = useState('');
  const [areaRai, setAreaRai] = useState('');
  const [plantingDate, setPlantingDate] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [planToDelete, setPlanToDelete] = useState(null);

  // สินค้าที่ตั้งค่า dose ไว้แล้วเท่านั้นที่นำมาวางแผนได้
  const plannableProducts = useMemo(
    () => (products || []).filter((p) => Number(p?.dose?.amount) > 0),
    [products]
  );

  const area = Number(areaRai) || 0;

  // คำนวณรายการที่เลือกทั้งหมดตามพื้นที่
  const planItems = useMemo(() =>
    selectedIds
      .map((id) => plannableProducts.find((p) => p.id === id))
      .filter(Boolean)
      .map((product) => ({ product, calc: calcRequiredForArea(product, area) })),
    [selectedIds, plannableProducts, area]
  );

  const totalCost = planItems.reduce((sum, item) => sum + item.calc.estimatedCost, 0);
  const shortageItems = planItems.filter((item) => item.calc.shortage > 0);
  const canSave = cropName.trim() && area > 0 && planItems.length > 0;

  const handleSavePlan = () => {
    if (!canSave) return;
    addPlan({
      cropName: cropName.trim(),
      areaRai: area,
      plantingDate: plantingDate || null,
      items: planItems.map(({ product, calc }) => ({
        productId: product.id,
        productName: product.name,
        doseAmount: calc.doseAmount,
        doseUnit: calc.doseUnit,
        totalNeeded: calc.totalNeeded,
        totalNeededUnit: calc.totalNeededUnit,
        unitsNeeded: calc.unitsNeeded,
        stockUnit: calc.stockUnit,
        stockAtPlan: calc.inStock,
        shortage: calc.shortage,
        estimatedCost: calc.estimatedCost,
      })),
      totalCost,
    });
    // เคลียร์ฟอร์มหลังบันทึก
    setCropName('');
    setAreaRai('');
    setPlantingDate('');
    setSelectedIds([]);
  };

  const handleConfirmDeletePlan = () => {
    if (planToDelete) {
      deletePlan(planToDelete.id);
      setPlanToDelete(null);
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Agriculture color="primary" fontSize="large" />
        <Typography variant="h4">วางแผนก่อนปลูก</Typography>
      </Box>

      {/* ----- ฟอร์มวางแผน ----- */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="พืชที่จะปลูก"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              placeholder="เช่น ข้าวโพด, มันสำปะหลัง"
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              label="พื้นที่ปลูก (ไร่)"
              type="number"
              value={areaRai}
              onChange={(e) => setAreaRai(e.target.value)}
              fullWidth
              size="small"
              inputProps={{ min: 0, step: 'any' }}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              label="วันที่คาดว่าจะปลูก"
              type="date"
              value={plantingDate}
              onChange={(e) => setPlantingDate(e.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              size="small"
              options={plannableProducts}
              getOptionLabel={(p) => p.name}
              value={plannableProducts.filter((p) => selectedIds.includes(p.id))}
              onChange={(e, value) => setSelectedIds(value.map((p) => p.id))}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip label={option.name} size="small" {...getTagProps({ index })} key={option.id} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="เลือกสินค้าที่จะใช้ (ปุ๋ย/ยา/เมล็ดพันธุ์)"
                  placeholder={plannableProducts.length ? 'พิมพ์เพื่อค้นหา...' : ''}
                />
              )}
            />
            {plannableProducts.length === 0 && (
              <Alert severity="info" sx={{ mt: 1 }}>
                ยังไม่มีสินค้าที่ตั้งค่า "อัตราใช้ต่อไร่" — ไปที่หน้า Products แล้วแก้ไขสินค้า
                เพื่อกรอกอัตราการใช้ก่อน จึงจะนำมาวางแผนได้
              </Alert>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* ----- ผลการคำนวณ ----- */}
      {planItems.length > 0 && (
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            รายการที่ต้องใช้ {cropName && `— ${cropName}`} ({formatNumber(area)} ไร่)
          </Typography>
          {area <= 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>กรุณาระบุพื้นที่ปลูก (ไร่) เพื่อคำนวณปริมาณ</Alert>
          )}
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>สินค้า</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>อัตราใช้</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">ต้องใช้ทั้งหมด</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">จำนวนที่ต้องใช้</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">สต็อก</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">ค่าใช้จ่ายประมาณ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {planItems.map(({ product, calc }) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.name}
                      {product.dose?.note && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          {product.dose.note}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{formatNumber(calc.doseAmount)} {calc.doseUnit}</TableCell>
                    <TableCell align="right">{formatNumber(calc.totalNeeded)} {calc.totalNeededUnit}</TableCell>
                    <TableCell align="right">{formatNumber(calc.unitsNeeded)} {calc.stockUnit}</TableCell>
                    <TableCell align="center">
                      {calc.shortage > 0 ? (
                        <Chip label={`ขาด ${formatNumber(calc.shortage)} ${calc.stockUnit}`} color="error" size="small" />
                      ) : (
                        <Chip label={`พอ (มี ${formatNumber(calc.inStock)})`} color="success" size="small" />
                      )}
                    </TableCell>
                    <TableCell align="right">฿{formatNumber(calc.estimatedCost)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ my: 2 }} />
          <Box display="flex" flexWrap="wrap" alignItems="center" justifyContent="space-between" gap={2}>
            <Box>
              <Typography variant="h6">รวมค่าใช้จ่ายประมาณ: ฿{formatNumber(totalCost)}</Typography>
              {shortageItems.length > 0 && (
                <Typography variant="body2" color="error">
                  สต็อกไม่พอ {shortageItems.length} รายการ — ต้องสั่งซื้อเพิ่มก่อนถึงวันปลูก
                </Typography>
              )}
            </Box>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSavePlan}
              disabled={!canSave}
            >
              บันทึกแผน
            </Button>
          </Box>
        </Paper>
      )}

      {/* ----- แผนที่บันทึกไว้ ----- */}
      <Typography variant="h6" gutterBottom>แผนที่บันทึกไว้ ({(plans || []).length})</Typography>
      {(plans || []).length === 0 ? (
        <Typography variant="body2" color="text.secondary">ยังไม่มีแผนที่บันทึกไว้</Typography>
      ) : (
        <Grid container spacing={2}>
          {plans.map((plan) => (
            <Grid item xs={12} sm={6} md={4} key={plan.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="subtitle1" fontWeight="bold">
                      {plan.cropName} — {formatNumber(plan.areaRai)} ไร่
                    </Typography>
                    <IconButton size="small" color="error" onClick={() => setPlanToDelete(plan)}>
                      <Delete fontSize="inherit" />
                    </IconButton>
                  </Box>
                  {plan.plantingDate && (
                    <Typography variant="body2" color="text.secondary">
                      วันที่ปลูก: {plan.plantingDate}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {plan.items?.length || 0} รายการ · รวม ฿{formatNumber(plan.totalCost)}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  {(plan.items || []).map((item, i) => (
                    <Typography key={i} variant="caption" display="block">
                      • {item.productName}: {formatNumber(item.unitsNeeded)} {item.stockUnit}
                      {item.shortage > 0 && ` (ขาด ${formatNumber(item.shortage)})`}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <ConfirmationDialog
        open={!!planToDelete}
        onClose={() => setPlanToDelete(null)}
        onConfirm={handleConfirmDeletePlan}
        title="ยืนยันการลบแผน"
        message={`ต้องการลบแผนปลูก "${planToDelete?.cropName}" ใช่หรือไม่?`}
      />
    </Box>
  );
};

export default PlantingPlannerPage;
