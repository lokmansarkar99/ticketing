import { Router } from "express";
import { verifySeat, verifySeatUpdate } from "./seat.validation";
import { createSeat, deleteSeat, getSeatAll, getSeatSingle, updateSeat } from "./seat.controller";




const router = Router();

router.post('/create-seat', verifySeat, createSeat);
router.put('/update-seat/:id', verifySeatUpdate, updateSeat);
router.get('/get-seat-all', getSeatAll);
router.get('/get-seat-single/:id', getSeatSingle);
router.delete('/delete-seat/:id', deleteSeat);

export default router;