import { Router } from "express";
import { coachWiseSalesReport, coachWiseSalesSummery, counterWiseSalesReport, currentDueVehicle, duePayment, getAggregationAccounts, getTodaySales, getTripNumber, tripNumberWiseReport, tripReport, userChangePassword, userWiseSalesByCounterReport, userWiseSalesReport, userWiseSalesSummery } from "./admin.controller";
import { verifyJwt } from "../../middleware/verifyJwt";
import { verifyPayment } from "./admin.validation";
import { verifyCustomerChangePassword } from "../customer/customer.validation";

const router = Router();


router.get('/get-today-sales', getTodaySales);
router.post('/change-password/:id', verifyJwt, verifyCustomerChangePassword, userChangePassword);
router.get('/find-due', verifyJwt, currentDueVehicle);
router.get('/trip-report', verifyJwt, tripReport);
router.get('/trip-wise-report', verifyJwt, tripNumberWiseReport);
router.get('/get-trip-number', verifyJwt, getTripNumber);
router.post('/due-payment', verifyJwt, verifyPayment, duePayment);
router.get('/user-wise-sales', userWiseSalesReport);
router.get('/user-wise-sales-summery', userWiseSalesSummery);
router.get('/counter-wise-sales-report', counterWiseSalesReport);
router.get('/user-wise-sales-by-counter', userWiseSalesByCounterReport);
router.get('/coach-wise-sales', coachWiseSalesReport);
router.get('/coach-wise-sales-summery', coachWiseSalesSummery);
router.get('/get-aggregation-accounts', verifyJwt, getAggregationAccounts);

export default router;