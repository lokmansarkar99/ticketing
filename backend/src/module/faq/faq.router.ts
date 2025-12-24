import { Router } from "express";
import { verifyFaq, verifyFaqUpdate } from "./faq.validation";
import { createFAQ, deleteFAQ, getFAQAll, getFAQSingle, updateFAQ } from "./faq.controller";



const router = Router();

router.post('/create-faq', verifyFaq, createFAQ);
router.put('/update-faq/:id', verifyFaqUpdate, updateFAQ);
router.get('/get-faq-all', getFAQAll);
router.get('/get-faq-single/:id', getFAQSingle);
router.delete('/delete-faq/:id', deleteFAQ);

export default router;