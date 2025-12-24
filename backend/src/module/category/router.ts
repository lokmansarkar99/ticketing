import { Router } from "express";
import { verifyCategory, verifyCategoryUpdate } from "./validation";
import { createCategory, deleteCategory, getCategoryAll, getCategorySingle, updateCategory } from "./controller";




const router = Router();

router.post('/create-category', verifyCategory, createCategory);
router.put('/update-category/:id', verifyCategoryUpdate, updateCategory);
router.get('/get-category-all', getCategoryAll);
router.get('/get-category-single/:id', getCategorySingle);
router.delete('/delete-category/:id', deleteCategory);

export default router;