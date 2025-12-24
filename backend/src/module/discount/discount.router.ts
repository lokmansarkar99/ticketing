import { Router } from "express";
import { verifyDiscount, verifyDiscountUpdate } from "./discount.validation";
import { checkDiscountValidity, createDiscount, deleteDiscount, getDiscountAll, getDiscountSingle, updateDiscount } from "./discount.controller";
import { verifyJwt } from "../../middleware/verifyJwt";




const router = Router();

router.post('/create-discount', verifyDiscount, createDiscount);
router.get('/get-discount-all', getDiscountAll);
router.get('/get-discount-single/:id', getDiscountSingle);
router.get('/check-discount-validity',checkDiscountValidity);
router.put('/update-discount/:id', verifyDiscountUpdate, updateDiscount);
router.delete('/delete-discount/:id', deleteDiscount);

export default router;