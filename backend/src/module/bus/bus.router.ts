import { Router } from "express";
import { verifyBus, verifyBusUpdate } from "./bus.validation";
import { createBus, deleteBus, getBusAll, getBusSingle, updateBus } from "./bus.controller";

const router = Router();

router.post('/create-bus', verifyBus, createBus);
router.put('/update-bus/:id', verifyBusUpdate, updateBus);
router.get('/get-bus-all', getBusAll);
router.get('/get-bus-single/:id', getBusSingle);
router.delete('/delete-bus/:id', deleteBus);

export default router;