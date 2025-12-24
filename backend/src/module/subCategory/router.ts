import { Router } from "express";
import { verifySubCategory, verifySubCategoryUpdate } from "./validation";
import { createSubCategory, deleteSubCategory, getSubCategoryAll, getSubCategorySingle, updateSubCategory } from "./controller";



const router = Router();

router.post('/create-sub-category', verifySubCategory, createSubCategory);
router.put('/update-sub-category/:id', verifySubCategoryUpdate, updateSubCategory);
router.get('/get-sub-category-all', getSubCategoryAll);
router.get('/get-sub-category-single/:id', getSubCategorySingle);
router.delete('/delete-Sub-category/:id', deleteSubCategory);

export default router;