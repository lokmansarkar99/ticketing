import { Router } from "express";
import { verifyExpenseCategory, verifyExpenseCategoryUpdate } from "./expenseCategoryAccounts.validation";
import { createExpenseCategoryAccounts, deleteExpenseCategoryAccounts, getExpenseCategoryAccountsAll, getExpenseCategoryAccountsSingle, updateExpenseCategoryAccounts } from "./expenseCategoryAccounts.controller";



const router = Router();

router.post('/create-expense-category-accounts', verifyExpenseCategory, createExpenseCategoryAccounts);
router.put('/update-expense-category-accounts/:id', verifyExpenseCategoryUpdate, updateExpenseCategoryAccounts);
router.get('/get-expense-category-accounts-all', getExpenseCategoryAccountsAll);
router.get('/get-expense-category-accounts-single/:id', getExpenseCategoryAccountsSingle);
router.delete('/delete-expense-category-accounts/:id', deleteExpenseCategoryAccounts);

export default router;