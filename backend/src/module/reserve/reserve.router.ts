import { Router } from "express";
import { verifyReserve, verifyReserveUpdate } from "./reserve.validation";
import { createReserve, deleteReserve, getReserveAll, getReserveSingle, updateReserve } from "./reserve.controller";
import { verifyJwt } from "../../middleware/verifyJwt";
import { verifyParams } from "../../middleware/verifyParams";




const router = Router();

router.post('/create-reserve', verifyReserve, createReserve);
router.put('/update-reserve/:id',verifyJwt,verifyParams, verifyReserveUpdate, updateReserve);
router.get('/get-reserve-all', getReserveAll);
router.get('/get-reserve-single/:id',verifyParams, getReserveSingle);
router.delete('/delete-reserve/:id',verifyJwt,verifyParams, deleteReserve);

export default router;