import { Router } from "express";
import { createFundPrepaid, deleteFundPrepaid, getFundPrepaidAll, getFundPrepaidByCounterId, updateFundPrepaidStatus, } from "./fundPrepaid.controller";
import { verifyJwt } from "../../middleware/verifyJwt";
import { verifyFundPrepaid, verifyFundPrepaidStatus } from "./fundPrepaid.validation";

const router = Router();

router.post("/create-fund-prepaid", verifyJwt, verifyFundPrepaid, createFundPrepaid);
router.put("/update-fund-prepaid/:id", verifyJwt, verifyFundPrepaidStatus, updateFundPrepaidStatus);
router.get("/get-fund-prepaid-all", verifyJwt, getFundPrepaidAll);
router.get("/get-fund-prepaid-counter", verifyJwt, getFundPrepaidByCounterId);
router.delete("/delete-fund-prepaid/:id", verifyJwt, deleteFundPrepaid);

export default router;