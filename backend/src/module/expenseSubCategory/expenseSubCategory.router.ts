import { Router } from "express";

import { verifyJwt } from "../../middleware/verifyJwt";
import { verifyParams } from "../../middleware/verifyParams";
import { verifyExpenseSubCategory, verifyExpenseSubCategoryUpdate } from "./expenseSubCategory.validation";
import { createExpenseSubCategory, deleteExpenseSubCategory, getExpenseSubCategoryAll, getExpenseSubCategorySingle, updateExpenseSubCategory } from "./expenseSubCategory.controller";

const router = Router();

router.post('/create-expense-subcategory', verifyJwt, verifyExpenseSubCategory, createExpenseSubCategory)
router.get('/get-expense-subcategory-all', verifyJwt, getExpenseSubCategoryAll)
router.get('/get-expense-subcategory-single/:id', verifyParams, verifyJwt, getExpenseSubCategorySingle)
router.put('/update-expense-subcategory/:id', verifyParams, verifyJwt, verifyExpenseSubCategoryUpdate, updateExpenseSubCategory)
router.delete('/delete-expense-subcategory/:id', verifyParams, verifyJwt, deleteExpenseSubCategory)

export default router;