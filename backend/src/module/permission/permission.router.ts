import { Router } from "express";
import { verifyPermission, verifyPermissionUpdate } from "./permission.validation";
import { createPermission, deletePermission, getPermissionAll, getPermissionSingle, updatePermission } from "./permission.controller";



const router = Router();

router.post('/create-permission', verifyPermission, createPermission);
router.put('/update-permission/:id', verifyPermissionUpdate, updatePermission);
router.get('/get-permission-all', getPermissionAll);
router.get('/get-permission-single/:id', getPermissionSingle);
router.delete('/delete-permission/:id', deletePermission);

export default router;