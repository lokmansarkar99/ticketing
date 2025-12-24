import { Router } from "express";
import { verifyJwt } from "../../middleware/verifyJwt";
import { verifyBlogCategory, verifyBlogCategoryUpdate } from "./blogCategory.validation";
import { createBlogCategory, deleteBlogCategory, getBlogCategoryAll, getBlogCategoryById, updateBlogCategory } from "./blogCategory.controller";

const router = Router();

router.post("/create-blog-category", verifyJwt, verifyBlogCategory, createBlogCategory);
router.get("/get-blog-category-all", getBlogCategoryAll);
router.get("/get-blog-category-by-id/:id", getBlogCategoryById);
router.put("/update-blog-category/:id", verifyJwt, verifyBlogCategoryUpdate, updateBlogCategory);
router.delete("/delete-blog-category/:id", verifyJwt, deleteBlogCategory);

export default router;
