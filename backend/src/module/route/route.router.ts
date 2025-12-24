import { Router } from "express";
import { verifyRoute, verifyRouteUpdate } from "./route.validation";
import { createRoute, deleteRoute, getRouteAll, getRouteSingle, updateRoute } from "./route.controller";


const router = Router();

router.post('/create-route', verifyRoute, createRoute);
router.put('/update-route/:id', verifyRouteUpdate, updateRoute);
router.get('/get-route-all', getRouteAll);
router.get('/get-route-single/:id', getRouteSingle);
router.delete('/delete-route/:id', deleteRoute);

export default router;