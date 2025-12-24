import { Router } from "express";
import { verifySchedule, verifyScheduleUpdate } from "./schedule.validation";
import { createSchedule, deleteSchedule, getScheduleAll, getScheduleSingle, updateSchedule } from "./schedule.controller";



const router = Router();

router.post('/create-schedule', verifySchedule, createSchedule);
router.put('/update-schedule/:id', verifyScheduleUpdate, updateSchedule);
router.get('/get-schedule-all', getScheduleAll);
router.get('/get-schedule-single/:id', getScheduleSingle);
router.delete('/delete-schedule/:id', deleteSchedule);

export default router;