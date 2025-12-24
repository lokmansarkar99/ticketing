import { Router } from "express";
import { verifyJwt } from "../../middleware/verifyJwt";
import { verifyAboutUs, verifyAboutUsUpdate } from "./aboutUs.validation";
import { createAboutUs, deleteAboutUs, getAboutUsAll, getAboutUsSingle, updateAboutUs } from "./aboutUs.controller";



const router = Router();

router.post('/create-about-us', verifyJwt, verifyAboutUs, createAboutUs);
router.put('/update-about-us/:id', verifyJwt, verifyAboutUsUpdate, updateAboutUs);
router.get('/get-about-us-all', getAboutUsAll);
router.get('/get-about-us-single/:id', getAboutUsSingle);
router.delete('/delete-about-us/:id', verifyJwt, deleteAboutUs);

export default router;