import { Router } from "express";
import { verifyExpense, verifyExpenseAuthorize, verifyExpenseUpdate } from "./expense.validation";
import { authorizeExpense, createExpense, deleteExpense, getExpenseAccountsDashboard, getExpenseAll, getExpenseSingle, updateExpense } from "./expense.controller";
import { verifyJwt } from "../../middleware/verifyJwt";


const router = Router();

router.post('/create-expense',verifyJwt, verifyExpense, createExpense);
router.put('/update-expense/:id',verifyJwt, verifyExpenseUpdate, updateExpense);
router.put('/authorize-expense/:id',verifyJwt, verifyExpenseAuthorize, authorizeExpense);
router.get('/get-expense-all', getExpenseAll);
router.get('/get-expense-account-dashboard', getExpenseAccountsDashboard);
router.get('/get-expense-single/:id', getExpenseSingle);
router.delete('/delete-expense/:id', deleteExpense);

export default router;