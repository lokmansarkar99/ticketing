import { Router } from "express";
import { verifyChangePassword, verifyForget, verifyForgetChangePassword, verifyOtpVerify, verifyUserLogin, verifyUserReg } from "./auth.validation";
import { changePassword, changePasswordInForgetPassword, createUser, forgetOTPVerify, forgetPasswordRequest, loginUser } from "./auth.controller";
import { verifyJwt } from "../../middleware/verifyJwt";
import { verifyAdmin } from "../../middleware/VerifyAdmin";
import { verifyOTP } from "../../middleware/verifyOtp";

const router = Router();

router.post('/create-user', verifyUserReg, createUser)
router.post('/login-user', verifyUserLogin, loginUser)
router.post('/change-password', verifyJwt, verifyChangePassword, changePassword)
router.post('/forget-password-request', verifyForget, forgetPasswordRequest)
router.post('/otp-verify', verifyOTP, verifyOtpVerify, forgetOTPVerify)
router.post('/forget-changePassword', verifyOTP, verifyForgetChangePassword, changePasswordInForgetPassword)

export default router;