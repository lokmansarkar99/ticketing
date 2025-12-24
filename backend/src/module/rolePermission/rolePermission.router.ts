import { Router } from "express";
import { verifyRolePermission, verifyRolePermissionUpdate } from "./rolePermission.validation";
import { createRolePermission, deleteRolePermission, getRolePermissionAll, getRolePermissionSingle, updateRolePermission } from "./rolePermission.controller";



const router = Router();

router.post('/create-role-permission', verifyRolePermission, createRolePermission);
router.put('/update-role-permission/:id', verifyRolePermissionUpdate, updateRolePermission);
router.get('/get-role-permission-all', getRolePermissionAll);
router.get('/get-role-permission-single/:id', getRolePermissionSingle);
router.delete('/delete-role-permission/:id', deleteRolePermission);

export default router;