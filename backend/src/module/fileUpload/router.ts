import { Router } from "express";
import { deleteFromS3, fileUpload, getAllImageFromS3 } from "./controller";
import fileUploadMiddleware from "../../middleware/fileUploadMiddleware";

const router = Router();

router.post('/upload', fileUploadMiddleware, fileUpload)
router.get('/get-images-all', getAllImageFromS3)
router.delete("/delete", deleteFromS3);

export default router;