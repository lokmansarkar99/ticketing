import { Router } from "express";
import { verifyJwt } from "../../middleware/verifyJwt";
import { authorizeCounterReportSubmit, authorizeSupervisorReportSubmit, counterReportSubmit, createSupervisorReportSubmit, deleteUser, detailsSupervisorReportSubmit, getBalance, getCounterReportSubmit, getGuideAll, getSupervisorReportSubmit, getUserAll, getUserById, supervisorDashboardReport, updateUser } from "./user.controller";
import { verifyCounterReportSubmit, verifySupervisorReport, verifySupervisorReportAuthorize, verifySupervisorReportSubmit, verifyUserUpdate } from "./user.validation";
import { verifyParams } from "../../middleware/verifyParams";

const router = Router();

router.get('/get-user-all', verifyJwt, getUserAll)
router.get('/get-guide-all', verifyJwt, getGuideAll)
router.get('/get-balance', verifyJwt, getBalance)
router.get('/get-user-by-id/:id', verifyJwt, verifyParams, getUserById)
router.get('/supervisor-dashboard', verifySupervisorReport, supervisorDashboardReport)
router.post('/create-supervisor-report-submit', verifyJwt, verifySupervisorReportSubmit, createSupervisorReportSubmit)
router.post('/create-counter-report-submit', verifyJwt, verifyCounterReportSubmit, counterReportSubmit)
router.get('/get-supervisor-report', verifyJwt, getSupervisorReportSubmit)
router.get('/get-counter-report-submit', verifyJwt, getCounterReportSubmit)
router.post('/authorize-supervisor-report/:id', verifyJwt, verifySupervisorReportAuthorize, authorizeSupervisorReportSubmit)
router.post('/authorize-counter-report/:id', verifyJwt, verifySupervisorReportAuthorize, authorizeCounterReportSubmit)
router.get('/details-supervisor-report/:id', verifyJwt, detailsSupervisorReportSubmit)
router.put('/update-user/:id', verifyJwt, verifyParams, verifyUserUpdate, updateUser)
router.delete('/delete-user/:id', verifyJwt, verifyParams, deleteUser)



export default router;