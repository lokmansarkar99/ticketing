import { Router } from "express";
import { verifyBalanceTransfer } from "./balanceTransfer.validation";
import { createBalanceTransfer, deleteBalanceTransfer, getBalanceTransfer, getBalanceTransferById } from "./balanceTransfer.controller";




const router = Router();

router.post('/create-balance-transfer', verifyBalanceTransfer, createBalanceTransfer);
router.get('/get-balance-transfer-all', getBalanceTransfer);
router.get('/get-balance-transfer-single/:id', getBalanceTransferById);
router.delete('/delete-balance-transfer/:id', deleteBalanceTransfer);

export default router;