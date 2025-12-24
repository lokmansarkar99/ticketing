import { Router } from "express";
import { verifyBookingSeat, verifyCancelBooking, verifyCancelRequest, verifyCheckSeatAvailability, verifyOrder, verifyOrderCancel, verifyOrderMigrate, verifyOrderUpdate } from "./order.validation";
import { bookingSeat, cancelBooking, cancelRequest, cancelTicket, checkSeatAvailability, createOrder, createOrderCounter, deleteOrder, duePayment, findCustomer, findTicket, getOrderAll, getOrderSingle, getTodayOrderCancelRequest, getTodaySalesCounter, orderMigrate, unBookingSeat, updateOrder, userCancelRequest } from "./order.controller";
import { verifyJwt } from "../../middleware/verifyJwt";
import { VerifyBookingCheck, VerifySeatCheck } from "../../middleware/VerifyCheckSeatAvailability";


const router = Router();

router.post('/create-order', verifyOrder, VerifySeatCheck, createOrder);
router.post('/migrate-order', verifyJwt, verifyOrderMigrate, VerifySeatCheck, orderMigrate);
router.post('/create-order-counter', verifyJwt, verifyOrder, VerifySeatCheck, VerifyBookingCheck, createOrderCounter);
router.post('/check-seat-availability', verifyCheckSeatAvailability, checkSeatAvailability);
router.post('/booking-seat', verifyJwt, verifyBookingSeat, bookingSeat);
router.post('/counter-booking-seat', verifyJwt, verifyBookingSeat, bookingSeat);
router.post('/un-booking-seat',verifyJwt, verifyBookingSeat, unBookingSeat);
router.put('/update-order/:id', verifyOrderUpdate, updateOrder);
router.put('/cancel-request', verifyJwt, verifyCancelRequest, cancelRequest);
router.put('/user-cancel-request', verifyCancelRequest, userCancelRequest);
router.get('/find-customer', findCustomer);
router.get('/today-cancel-request', verifyJwt, getTodayOrderCancelRequest);
router.put('/due-payment/:id', verifyJwt, duePayment);
router.get('/get-order-all', getOrderAll);
router.get('/get-today-sales-counter', verifyJwt, getTodaySalesCounter);
router.get('/get-order-single/:id', getOrderSingle);
router.get('/find-ticket/:id', findTicket);
router.put('/cancel-ticket/:id', verifyJwt, verifyOrderCancel, cancelTicket);
router.delete('/delete-order/:id', deleteOrder);
router.delete('/cancel-booking', verifyJwt, verifyCancelBooking, cancelBooking);

export default router;