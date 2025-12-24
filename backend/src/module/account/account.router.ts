import { Router } from "express";

import { verifyJwt } from "../../middleware/verifyJwt";
import { createAccount, deleteAccount, getAccountSingle, getAccountsAll, updateAccount } from "./account.controller";
import { verifyParams } from "../../middleware/verifyParams";
import { verifyAccount, verifyAccountQuery, verifyUpdateAccount } from "./account.valiation";

const router = Router();

router.post('/create-account', verifyJwt, verifyAccount, createAccount)
router.get('/get-accounts-all', verifyAccountQuery, getAccountsAll)
router.get('/get-account-single/:id', verifyJwt, getAccountSingle)
router.put('/update-account/:id', verifyParams, verifyJwt, verifyUpdateAccount, updateAccount)
router.delete('/delete-account/:id', verifyParams, verifyJwt, deleteAccount)


export default router;