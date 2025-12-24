import { Router } from "express";
import { verifyJwt } from "../../middleware/verifyJwt";
import { verifyBlog, verifyBlogUpdate } from "./blog.validation";
import { createBlog, deleteBlog, getBlogAll, getBlogById, updateBlog } from "./blog.controller";


const router = Router();

router.post("/create-blog", verifyJwt, verifyBlog, createBlog);
router.get("/get-blog-all", getBlogAll);
router.get("/get-blog-by-id/:id", getBlogById);
router.put("/update-blog/:id", verifyJwt, verifyBlogUpdate, updateBlog);
router.delete("/delete-blog/:id", verifyJwt, deleteBlog);

export default router;
