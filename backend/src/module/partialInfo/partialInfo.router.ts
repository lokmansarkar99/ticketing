import { Router } from "express";
import { getPartialInfo, updatePartialInfo } from "./partialInfo.controller";
import { verifyJwt } from "../../middleware/verifyJwt";

const router = Router();

router.get('/get-partial-info', getPartialInfo);
router.put('/update-partial-info/:id',verifyJwt, updatePartialInfo);

export default router;