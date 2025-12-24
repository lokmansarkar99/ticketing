import { Router } from "express";
import { verifyFare, verifyFareUpdate } from "./fare.validation";
import { createFare, deleteFare, getFareAll, getFareSingle, updateFare } from "./fare.controller";


const router = Router();

router.post('/create-fare', verifyFare, createFare);
router.get('/get-fare-all', getFareAll);
router.get('/get-fare-single/:id', getFareSingle);
router.put('/update-fare/:id',verifyFareUpdate, updateFare);
router.delete('/delete-fare/:id', deleteFare);

export default router;