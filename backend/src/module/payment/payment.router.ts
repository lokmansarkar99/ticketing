import express, { Router } from "express";
import { paymentCanceled, paymentFailed, paymentInstance, paymentSuccess, refundPayment, refundPaymentStatus, sslWebhook, webhook } from "./payment.controller";


const router = Router();

router.post("/instance/:id", paymentInstance);
router.post("/pay-webhook", sslWebhook);
router.post("/payment-success/:tran_id", paymentSuccess);
router.post("/payment-canceled", paymentCanceled);
router.post("/payment-failed", paymentFailed);
router.get("/webhook/:id", webhook);
router.post("/refund-payment", refundPayment);
router.get("/refund-payment-status/:id", refundPaymentStatus);

export default router;