import { Router } from "express";
import { verifyPermissionType, verifyPermissionTypeUpdate } from "./permissionType.validation";
import { createPermissionType, deletePermissionType, getPermissionTypeAll, getPermissionTypeSingle, updatePermissionType } from "./permissionType.controller";



const router = Router();

router.post('/create-permission-type', verifyPermissionType, createPermissionType);
router.put('/update-permission-type/:id', verifyPermissionTypeUpdate, updatePermissionType);
router.get('/get-permission-type-all', getPermissionTypeAll);
router.get('/get-permission-type-single/:id', getPermissionTypeSingle);
router.delete('/delete-permission-type/:id', deletePermissionType);

export default router;