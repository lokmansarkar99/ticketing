import { Router } from "express";
import {
    createCoachAssignWithPermissions,
    getAllCoachAssigns,
    getCoachAssignById,
    updateCoachAssignWithPermissions,
    deleteCoachAssign,
} from "./coachAssign.controller";
import { verifyCoachAssign, verifyCoachAssignUpdate } from "./coachAssign.validation";
import { verifyJwt } from "../../middleware/verifyJwt";

const router = Router();

router.post("/create-coach-assign", verifyJwt, verifyCoachAssign, createCoachAssignWithPermissions);
router.get("/get-coach-assign-all", verifyJwt, getAllCoachAssigns);
router.get("/get-coach-assign-single/:id", verifyJwt, getCoachAssignById);
router.put("/update-coach-assign/:id", verifyJwt, verifyCoachAssignUpdate, updateCoachAssignWithPermissions);
router.delete("/delete-coach-assign/:id", verifyJwt, deleteCoachAssign);

export default router;
