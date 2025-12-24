import { Router } from "express";
import { coachActiveInActive, createCoach, deleteCoach, getCoachAll, getCoachSingle, updateCoach } from "./coach.controller";
import { verifyCoach, verifyCoachUpdate } from "./coach.validation";

const router = Router();

router.post('/create-coach', verifyCoach, createCoach);
router.put('/update-coach/:id', verifyCoachUpdate, updateCoach);
router.put('/update-coach-active/:id', coachActiveInActive);
router.get('/get-coach-all', getCoachAll);
router.get('/get-coach-single/:id', getCoachSingle);
router.delete('/delete-coach-single/:id', deleteCoach);

export default router;