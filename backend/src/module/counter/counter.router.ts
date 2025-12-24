import { Router } from "express";
import { verifyCounter, verifyCounterUpdate } from "./counter.validation";
import { createCounter, deleteCounter, getCounterAll, getCounterAllByStation, getCounterSingle, getCounterViaRoute, updateCounter } from "./counter.controller";


const router = Router();

router.post('/create-counter', verifyCounter, createCounter);
router.put('/update-counter/:id', verifyCounterUpdate, updateCounter);
router.get('/get-counter-all', getCounterAll);
router.get('/get-counter-all-by-station', getCounterAllByStation);
router.get('/get-counter-single/:id', getCounterSingle);
router.get('/get-counter-by-route/:id', getCounterViaRoute);
router.delete('/delete-counter/:id', deleteCounter);

export default router;