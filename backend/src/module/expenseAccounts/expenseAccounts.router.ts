import { Router } from "express";
import { verifyJwt } from "../../middleware/verifyJwt";
import { verifyParams } from "../../middleware/verifyParams";
import { verifyExpenseAccounts } from "./expenseAccounts.validation";
import { createExpenseAccounts, deleteExpenseAccounts, expenseAccountsReport, getExpenseAccountsAll, getExpenseAccountsById } from "./expenseAccounts.controller";

const router = Router();

router.post('/create-expense-accounts', verifyJwt, verifyExpenseAccounts, createExpenseAccounts)
router.get('/get-expense-accounts-all', verifyJwt, getExpenseAccountsAll)
router.get('/expense-report', verifyJwt, expenseAccountsReport)
router.get('/get-expense-accounts-single/:id', verifyParams, verifyJwt, getExpenseAccountsById)
router.delete('/delete-expense-accounts/:id', verifyParams, verifyJwt, deleteExpenseAccounts)

export default router;