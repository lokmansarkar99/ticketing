import { Router } from "express";
import { verifyVehicle, verifyVehicleUpdate } from "./vehicle.validation";
import { createVehicle, deleteVehicle, getVehicleAll, getVehicleSingle, updateVehicle } from "./vehicle.controller";





const router = Router();

router.post('/create-vehicle', verifyVehicle, createVehicle);
router.put('/update-vehicle/:id', verifyVehicleUpdate, updateVehicle);
router.get('/get-vehicle-all', getVehicleAll);
router.get('/get-vehicle-single/:id', getVehicleSingle);
router.delete('/delete-vehicle/:id', deleteVehicle);

export default router;