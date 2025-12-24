import { Router } from "express";
import { verifyCollection, verifyCollectionAuthorize } from "./collection.validation";
import { authorizeCollection, createCollection, deleteCollection, getCollectionAccountsDashboard, getCollectionAll, getCollectionSingle, updateCollection } from "./collection.controller";
import { verifyJwt } from "../../middleware/verifyJwt";



const router = Router();

router.post('/create-collection', verifyCollection, createCollection);
router.get('/get-collection-all',verifyJwt, getCollectionAll);
router.get('/get-collection-account-dashboard', getCollectionAccountsDashboard);
router.get('/get-collection-single/:id', getCollectionSingle);
router.put('/update-collection/:id', verifyCollection, updateCollection);
router.put('/authorize-collection/:id', verifyJwt, verifyCollectionAuthorize, authorizeCollection);
router.delete('/delete-collection/:id', deleteCollection);

export default router;