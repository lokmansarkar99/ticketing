import { Router } from "express";
import { verifyRole, verifyRoleUpdate } from "./role.validation";
import { createRole, deleteRole, getRoleAll, getRoleSingle, updateRole } from "./role.controller";




const router = Router();

router.post('/create-role', verifyRole, createRole);
router.put('/update-role/:id', verifyRoleUpdate, updateRole);
router.get('/get-role-all', getRoleAll);
router.get('/get-role-single/:id', getRoleSingle);
router.delete('/delete-role/:id', deleteRole);

export default router;