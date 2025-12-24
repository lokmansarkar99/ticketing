import { Router } from "express";
import { createDriver, deleteDriver, getDriverAll, getDriverSingle, updateDriver } from "./driver.controller";
import { verifyDriverReg, verifyDriverUpdate } from "./driver.validation";

const router = Router();

router.post('/create-driver', verifyDriverReg, createDriver);
router.get('/get-driver-all', getDriverAll);
router.get('/get-driver-single/:id', getDriverSingle);
router.put('/update-driver/:id',verifyDriverUpdate, updateDriver);
router.delete('/delete-driver/:id', deleteDriver);

export default router;