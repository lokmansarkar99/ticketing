import { Router } from "express";
import { verifyOffered, verifyOfferedUpdate } from "./offered.validation";
import { createOffered, deleteOffered, getOfferedAll, getOfferedSingle, updateOffered } from "./offered.controller";


const router = Router();

router.post('/create-offered', verifyOffered, createOffered);
router.put('/update-offered/:id', verifyOfferedUpdate, updateOffered);
router.get('/get-offered-all', getOfferedAll);
router.get('/get-offered-single/:id', getOfferedSingle);
router.delete('/delete-offered/:id', deleteOffered);

export default router;