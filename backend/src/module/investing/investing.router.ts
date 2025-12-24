import { Router } from "express";

import { verifyJwt } from "../../middleware/verifyJwt";
import { verifyInvesting,} from "./investing.validation";
import { createInvestingIn, createInvestingOut, deleteInvesting, getInvesting,} from "./investing.controller";
import { verifyParams } from "../../middleware/verifyParams";

const router = Router();

router.post('/investing-in', verifyJwt, verifyInvesting, createInvestingIn)
router.post('/investing-out', verifyJwt, verifyInvesting, createInvestingOut)
router.get('/get-investing', verifyJwt, getInvesting)
router.put('/update-investing/:id', verifyParams, verifyJwt,createInvestingOut)
router.delete('/delete-investing/:id', verifyParams, verifyJwt, deleteInvesting)


export default router;