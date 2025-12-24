import { Router } from "express";
import { verifyHelperReg, verifyHelperUpdate } from "./helper.validation";
import { createHelper, deleteHelper, getHelperAll, getHelperSingle, updateHelper } from "./helper.controller";
import { verifyJwt } from "../../middleware/verifyJwt";

const router = Router();

router.post('/create-helper', verifyJwt, verifyHelperReg, createHelper);
router.get('/get-helper-all', getHelperAll);
router.get('/get-helper-single/:id', getHelperSingle);
router.put('/update-helper/:id', verifyJwt, verifyHelperUpdate, updateHelper);
router.delete('/delete-helper/:id', verifyJwt, deleteHelper);

export default router;