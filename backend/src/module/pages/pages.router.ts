import { Router } from "express";
import { verifyJwt } from "../../middleware/verifyJwt";
import { verifyPages, verifyPagesUpdate } from "./pages.validation";
import { createPages, deletePages, getPagesAll, getPagesById, updatePages } from "./pages.controller";

const router = Router();

router.post("/create-pages", verifyJwt, verifyPages, createPages);
router.get("/get-pages-all", getPagesAll);
router.get("/get-pages-by-id/:id", getPagesById);
router.put("/update-pages/:id", verifyJwt, verifyPagesUpdate, updatePages);
router.delete("/delete-pages/:id", verifyJwt, deletePages);

export default router;
