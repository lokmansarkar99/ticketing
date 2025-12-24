import { Router } from "express";
import { verifyFuelCompany, verifyFuelCompanyUpdate } from "./fuelCompany.validation";
import { createFuelCompany, deleteFuelCompany, getFuelCompanyAll, getFuelCompanySingle, updateFuelCompany } from "./fuelCompanay.controller";

const router = Router();

router.post('/create-fuel-company', verifyFuelCompany, createFuelCompany);
router.get('/get-fuel-company-all', getFuelCompanyAll);
router.get('/get-fuel-company-single/:id', getFuelCompanySingle);
router.put('/update-fuel-company/:id', verifyFuelCompanyUpdate, updateFuelCompany);
router.delete('/delete-fuel-company/:id', deleteFuelCompany);

export default router;