import { Router } from "express";
import { verifyStation, verifyStationUpdate } from "./station.validation";
import { createStation, deleteStation, getStationAll, getStationSingle, updateStation } from "./station.controller";



const router = Router();

router.post('/create-station', verifyStation, createStation);
router.put('/update-station/:id', verifyStationUpdate, updateStation);
router.get('/get-station-all', getStationAll);
router.get('/get-station-single/:id', getStationSingle);
router.delete('/delete-station/:id', deleteStation);

export default router;