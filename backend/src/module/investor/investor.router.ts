import { Router } from "express";
import { verifyInvestor, verifyUpdateInvestor } from "./investor.validation";
import { createInvestor, deleteInvestor, getInvestorAll, getInvestorSingle, updateInvestor } from "./investor.controller";


const router = Router();

router.post('/create-investor', verifyInvestor, createInvestor);
router.get('/get-investor-all', getInvestorAll);
router.get('/get-investor-single/:id', getInvestorSingle);
router.put('/update-investor/:id', verifyUpdateInvestor, updateInvestor);
router.delete('/delete-investor/:id', deleteInvestor);

export default router;