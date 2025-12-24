import { Router } from "express";
import { verifySlider } from "./slider.validation";
import { createSlider, deleteSlider, getSliderAll, getSliderSingle, updateSlider } from "./slider.controller";
import { verifyJwt } from "../../middleware/verifyJwt";



const router = Router();

router.post('/create-slider', verifyJwt, verifySlider, createSlider);
router.put('/update-slider/:id', verifyJwt, verifySlider, updateSlider);
router.get('/get-slider-all', getSliderAll);
router.get('/get-slider-single/:id', getSliderSingle);
router.delete('/delete-slider/:id', verifyJwt, deleteSlider);

export default router;