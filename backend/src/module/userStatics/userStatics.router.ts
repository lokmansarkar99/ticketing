import { Router } from "express";
import { verifyUserStatics, verifyUserStaticsUpdate } from "./userStatics.validation";
import { createUserStatics, deleteUserStatics, getUserStaticsAll, getUserStaticsSingle, updateUserStatics } from "./userStatics.controller";




const router = Router();

router.post('/create-user-statics', verifyUserStatics, createUserStatics);
router.put('/update-user-statics/:id', verifyUserStaticsUpdate, updateUserStatics);
router.get('/get-user-statics-all', getUserStaticsAll);
router.get('/get-user-statics-single/:id', getUserStaticsSingle);
router.delete('/delete-user-statics/:id', deleteUserStatics);

export default router;