import { Router } from "express";
import { verifyCoreValue, verifyCoreValueUpdate } from "./coreValue.validation";
import { createCoreValue, deleteCoreValue, getCoreValueAll, getCoreValueSingle, updateCoreValue } from "./coreValue.controller";




const router = Router();

router.post('/create-core-value', verifyCoreValue, createCoreValue);
router.put('/update-core-value/:id', verifyCoreValueUpdate, updateCoreValue);
router.get('/get-core-value-all', getCoreValueAll);
router.get('/get-core-value-single/:id', getCoreValueSingle);
router.delete('/delete-core-value/:id', deleteCoreValue);

export default router;