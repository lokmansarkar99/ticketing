import { Router } from "express";
import { verifyJwt } from "../../middleware/verifyJwt";
import { verifyReview, verifyReviewUpdate } from "./rating.validation";
import {
    createReview,
    deleteReview,
    getReviewAll,
    updateReview,
} from "./rating.controller";

const router = Router();

router.post("/create-review", verifyReview, createReview);
router.get("/get-review-all", getReviewAll);
router.put("/update-review/:id", verifyJwt, verifyReviewUpdate, updateReview);
router.delete("/delete-review/:id", verifyJwt, deleteReview);

export default router;
