import { Router } from "express";
import { verifyExpenseCategory, verifyExpenseCategoryUpdate } from "./expenseCategory.validation";
import { createExpenseCategory, deleteExpenseCategory, getExpenseCategoryAll, getExpenseCategorySingle, updateExpenseCategory } from "./expenseCategory.controller";



const router = Router();

router.post('/create-expense-category', verifyExpenseCategory, createExpenseCategory);
router.put('/update-expense-category/:id', verifyExpenseCategoryUpdate, updateExpenseCategory);
router.get('/get-expense-category-all', getExpenseCategoryAll);
router.get('/get-expense-category-single/:id', getExpenseCategorySingle);
router.delete('/delete-expense-category/:id', deleteExpenseCategory);

export default router;