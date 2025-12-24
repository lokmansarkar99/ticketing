import { Router } from "express";
import { verifyCustomer, verifyCustomerChangePassword, verifyCustomerLogin, verifyCustomerUpdate, verifyRequestOTP } from "./customer.validation";
import { createCustomer, createCustomerWithOtp, customerChangePassword, deleteCustomer, getCustomerAll, getCustomerOrderList, getCustomerSingle, loginCustomer, loginWithOTP, requestOTP, updateCustomer } from "./customer.controller";
import { verifyOTP } from "../../middleware/verifyOtp";
import { verifyOtpVerify } from "../auth/auth.validation";
import { verifyJwt } from "../../middleware/verifyJwt";


const router = Router();

router.post('/create-customer', verifyCustomer, createCustomer);
router.post('/customer-change-password', verifyJwt, verifyCustomerChangePassword, customerChangePassword);
router.post('/create-customer-otp-verify', verifyOtpVerify, verifyOTP, createCustomerWithOtp);
router.post('/login-customer', verifyCustomerLogin, loginCustomer);
router.post('/request-otp', verifyRequestOTP, requestOTP);
router.post('/login-with-otp', verifyOtpVerify, verifyOTP, loginWithOTP);
router.get('/get-customer-all', getCustomerAll);
router.get('/get-customer-order-list', verifyJwt, getCustomerOrderList);
router.get('/get-customer-single/:id', getCustomerSingle);
router.put('/update-customer/:id', verifyJwt, verifyCustomerUpdate, updateCustomer);
router.delete('/delete-customer/:id', deleteCustomer);

export default router;