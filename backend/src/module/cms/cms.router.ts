import { Router } from "express";
import { verifyCMS } from "./cms.validation";
import { createCMS, deleteCMS, getCMS, updateCMS } from "./cms.controller";


const router = Router();

router.post('/create-cms', verifyCMS, createCMS);
router.put('/update-cms/:id', verifyCMS, updateCMS);
router.get('/get-cms-single', getCMS);
router.delete('/delete-cms/:id', deleteCMS);

export default router;