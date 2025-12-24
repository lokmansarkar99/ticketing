import { Router } from "express";
import { verifyCoachArrived, verifyCoachConfig, verifyCoachConfigUpdate, verifyCoachListGet } from "./coachConfig.validation";
import { coachArrivedDepart, coachReportSuperVisor, createCoachConfig, deleteCoachConfig, getCoachConfigAll, getCoachConfigByCoach, getCoachConfigSingle, getCoachConfigUpdate, getCoachList, getCoachListCounter, getTodayCoachList, updateCoachConfig } from "./coachConfig.controller";
import { verifyJwt } from "../../middleware/verifyJwt";


const router = Router();

router.post('/create-coach-config', verifyCoachConfig, createCoachConfig);
router.put('/update-coach-config/:id', verifyJwt, verifyCoachConfigUpdate, updateCoachConfig);
router.post('/coach-arrived-depart', verifyJwt, verifyCoachArrived, coachArrivedDepart);
router.get('/get-coach-config-all', getCoachConfigAll);
router.get('/get-coach-config-update', getCoachConfigUpdate);
router.get('/get-coach-list', verifyCoachListGet, getCoachList);
router.get('/get-coach-list-counter',verifyJwt, verifyCoachListGet, getCoachListCounter);
router.get('/get-coach-config-by-coach', getCoachConfigByCoach);
router.get('/get-coach-list-today', verifyJwt, getTodayCoachList);
router.get('/coach-report-supervisor/:id', verifyJwt, coachReportSuperVisor);
router.get('/get-coach-config-single/:id', getCoachConfigSingle);
router.delete('/delete-coach-config/:id', deleteCoachConfig);

export default router;