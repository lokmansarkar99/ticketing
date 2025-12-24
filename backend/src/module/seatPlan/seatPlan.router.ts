import { Router } from "express";

import { verifySeatPlan, verifySeatPlanUpdate } from "./seatPlan.validation";
import { createSeatPlan, deleteSeatPlan, getSeatPlanAll, getSeatPlanSingle, updateSeatPlan } from "./seatPlan.controller";




const router = Router();

router.post('/create-seat-plan', verifySeatPlan, createSeatPlan);
router.put('/update-seat-plan/:id', verifySeatPlanUpdate, updateSeatPlan);
router.get('/get-seat-plan-all', getSeatPlanAll);
router.get('/get-seat-plan-single/:id', getSeatPlanSingle);
router.delete('/delete-seat-plan/:id', deleteSeatPlan);

export default router;