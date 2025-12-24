import { Router } from "express";

import { verifySisterConcern, verifySisterConcernUpdate } from "./sisterConcern.validation";
import { createSisterConcern, deleteSisterConcern, getSisterConcernAll, getSisterConcernSingle, updateSisterConcern } from "./sisterConcern.controller";




const router = Router();

router.post('/create-sister-concern', verifySisterConcern, createSisterConcern);
router.put('/update-sister-concern/:id', verifySisterConcernUpdate, updateSisterConcern);
router.get('/get-sister-concern-all', getSisterConcernAll);
router.get('/get-sister-concern-single/:id', getSisterConcernSingle);
router.delete('/delete-sister-concern/:id', deleteSisterConcern);

export default router;