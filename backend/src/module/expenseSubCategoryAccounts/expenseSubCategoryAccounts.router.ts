import { Router } from "express";

import { verifyJwt } from "../../middleware/verifyJwt";
import { verifyParams } from "../../middleware/verifyParams";
import { verifyExpenseSubCategory, verifyExpenseSubCategoryUpdate } from "./expenseSubCategoryAccounts.validation";
import { createExpenseSubCategoryAccounts, deleteExpenseSubCategoryAccounts, getExpenseSubCategoryAccountsAll, getExpenseSubCategoryAccountsSingle, updateExpenseSubCategoryAccounts } from "./expenseSubCategoryAccounts.controller";

const router = Router();

router.post('/create-expense-subcategory-accounts', verifyJwt, verifyExpenseSubCategory, createExpenseSubCategoryAccounts)
router.get('/get-expense-subcategory-accounts-all', verifyJwt, getExpenseSubCategoryAccountsAll)
router.get('/get-expense-subcategory-accounts-single/:id', verifyParams, verifyJwt, getExpenseSubCategoryAccountsSingle)
router.put('/update-expense-subcategory-accounts/:id', verifyParams, verifyJwt, verifyExpenseSubCategoryUpdate, updateExpenseSubCategoryAccounts)
router.delete('/delete-expense-subcategory-accounts/:id', verifyParams, verifyJwt, deleteExpenseSubCategoryAccounts)

export default router;