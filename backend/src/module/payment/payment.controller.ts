import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import config from "../../config";
import axios from "axios";
import sendEmailAndSms from "../../utils/SendEmailAndSms";

const paymentInstanceURL = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
const paymentSuccessCheckURL = "https://sandbox.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php"
const refundPaymentURL = "https://sandbox.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php"
const refundPaymentStatusURL = "https://sandbox.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php"

const store_id = config.sslStoreId;
const store_passwd = config.sslStorePass;

export const paymentInstance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const timestamp = Date.now();
        const url = paymentInstanceURL;
        const is_live = false //true for live, false for sandbox
        const orderId = Number(req.params.id);
        const findOrder = await prisma.order.findUnique({
            where: {
                id: orderId
            },
            include: {
                orderSeat: true,
                order: true,
            }
        })
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: "Order not found"
            });
        } else if (findOrder.payment) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Payment already made"
            });
        } else if (findOrder.counterId) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "This order payment only counter not online payment"
            });
        }
        let productName = "";
        for (const seat of findOrder.orderSeat) {
            productName += seat.seat + " ";
        }
        const tran_id = `tran_id-${timestamp}`;
        const data = {
            store_id,
            store_passwd,
            total_amount: findOrder.paymentType === "FULL" ? findOrder.amount : findOrder.partial ? findOrder.dueAmount + (findOrder.order?.dueAmount || 0) : findOrder.partialPaymentAmount + (findOrder.order?.partialPaymentAmount || 0),
            currency: 'BDT',
            tran_id,
            success_url: `https://backend.iconicticket.com/api/v1/payment/payment-success/${tran_id}`,
            fail_url: 'https://backend.iconicticket.com/api/v1/payment/payment-failed',
            cancel_url: 'https://backend.iconicticket.com/api/v1/payment/payment-canceled',
            ipn_url: 'https://backend.iconicticket.com/api/v1/payment/pay-webhook',
            shipping_method: 'N/A',
            product_name: productName,
            product_category: 'BUS',
            product_profile: 'general',
            cus_name: findOrder.customerName || "N/A",
            cus_email: findOrder.email || "N/A",
            cus_add1: findOrder.address || "N/A",
            cus_add2: 'Dhaka',
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: findOrder.nationality || "N/A",
            cus_phone: findOrder.phone || "N/A",
            cus_fax: '01711111111',
            ship_name: 'Customer Name',
            ship_add1: 'Dhaka',
            ship_add2: 'Dhaka',
            ship_city: 'Dhaka',
            ship_state: 'Dhaka',
            ship_postcode: 1000,
            ship_country: 'Bangladesh',
            multi_card_name: 'mastercard',
            value_a: 'ref001_A',
            value_b: 'ref002_B',
            value_c: 'ref003_C',
            value_d: 'ref004_D'
        };
        const result = await axios.post(url, data, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${store_id}:${store_passwd}`).toString('base64')}`
            }
        })
        if (result.data.status === "SUCCESS") {
            await prisma.payment.create({
                data: {
                    orderId: findOrder.id,
                    returnOrderId: findOrder.returnOrderId,
                    amount: findOrder.paymentType === "FULL" ? findOrder.amount : findOrder.partial ? findOrder.dueAmount + (findOrder.order?.dueAmount || 0) : findOrder.partialPaymentAmount + (findOrder.order?.partialPaymentAmount || 0),
                    transId: tran_id,
                    userPhone: findOrder.phone,
                    sessionKey: result.data.sessionkey,
                    userEmail: findOrder.email || "N/A",

                }
            })
            await prisma.order.update({
                where: {
                    id: findOrder.id
                },
                data: {
                    partialPaymentAmount: findOrder.paymentType === "FULL" ? findOrder.amount : findOrder.partial ? findOrder.dueAmount : findOrder.partialPaymentAmount
                }
            })
            if (findOrder.order) {
                await prisma.order.update({
                    where: {
                        id: findOrder.order.id
                    },
                    data: {
                        partialPaymentAmount: findOrder?.order.paymentType === "FULL" ? findOrder.order.amount : findOrder.order.partial ? findOrder.order.dueAmount : findOrder.order.partialPaymentAmount
                    }
                })
            }
        }

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Payment request sent successfully',
            data: {
                status: result.data.status,
                url: result.data.GatewayPageURL,
                sessionKey: result.data.sessionkey
            }
        })
    }
    catch (err) {
        next(err);
    }
}

export const webhook = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const tran_id = req.params.id;
        // const { val_id, tran_id, amount, card_type, store_id, status } = req.body;
        // if (store_id !== config.sslStoreId) {
        //     return res.status(400).send({ success: false, message: 'Invalid store ID' });
        // }
        let findPayment = await prisma.payment.findUnique({
            where: {
                transId: tran_id
            },
            include: {
                order: {
                    include: {
                        order: true,
                        orderSeat: {
                            select: {
                                seat: true,
                            }
                        },
                        coachConfig: {
                            select: {


                                coach: {
                                    select: {
                                        route:{
                                            include:{
                                                Segment:{
                                                    include:{
                                                        SegmentFare: true,
                                                    }
                                                }
                                            }
                                        },
                                        coachClass: true,
                                        coachType: true,
                                        coachNo: true,
                                        schedule: true,


                                    }
                                },

                            }
                        }
                    },

                },
            }
        });

        if (!findPayment) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Payment not found'
            });
        }

        return res.status(200).send({
            success: true,
            message: 'Webhook received successfully',
            data: findPayment
        });


    }
    catch (err) {
        next(err);
    }
}
export const sslWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const tran_id = req.body.tran_id;
        const { store_id, } = req.body;
        if (store_id !== config.sslStoreId) {
            return res.status(400).send({ success: false, message: 'Invalid store ID' });
        }
        let findPayment = await prisma.payment.findUnique({
            where: {
                transId: tran_id
            },
            include: {
                order: true,
            }
        });

        if (!findPayment) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Payment not found'
            });
        } else if (findPayment.status === "Success") {
            return res.status(200).send({
                success: true,
                message: 'Webhook received successfully',
                data: findPayment
            });
        }
        let findOrder = await prisma.order.findUnique({
            where: {
                id: findPayment?.orderId
            },
            include: {
                order: true,
            }
        });
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Order not found'
            });
        }
        const { data } = await axios.get(`${paymentSuccessCheckURL}?sessionkey=${findPayment.sessionKey}&store_id=${store_id}&store_passwd=${store_passwd}&format=json`)
        if (data?.status === 'VALID') {

            if (findOrder.paymentType === "FULL") {
                if (!findOrder.returnOrderId) {
                    await prisma.order.update({
                        where: {
                            id: findOrder.id
                        },
                        data: {
                            status: 'Success',
                            payment: true,
                            paymentAmount: {
                                increment: findOrder.amount
                            },
                            dueAmount: {
                                decrement: findOrder.amount
                            },
                        },
                    });
                    await prisma.orderSeat.updateMany({
                        where: {
                            orderId: findOrder.id
                        },
                        data: {
                            status: 'Success',
                        },
                    });
                } else {
                    await prisma.order.update({
                        where: {
                            id: findOrder.returnOrderId
                        },
                        data: {
                            status: 'Success',
                            payment: true,
                            paymentAmount: {
                                increment: findOrder?.order?.partialPaymentAmount
                            },
                            dueAmount: {
                                decrement: findOrder?.order?.partialPaymentAmount
                            },
                        },
                    });
                    await prisma.order.update({
                        where: {
                            id: findOrder.id
                        },
                        data: {
                            status: 'Success',
                            payment: true,
                            paymentAmount: {
                                increment: findOrder?.amount
                            },
                            dueAmount: {
                                decrement: findOrder?.amount
                            },
                        },
                    });
                    await prisma.orderSeat.updateMany({
                        where: {
                            orderId: {
                                in: [findOrder.id, findOrder.returnOrderId]
                            },
                        },
                        data: {
                            status: 'Success',
                        },
                    });
                }
            } else if (findOrder.paymentType === "PARTIAL" && !findOrder.partial) {
                if (findOrder.returnOrderId) {
                    await prisma.order.update({
                        where: {
                            id: findOrder.id
                        },
                        data: {
                            partial: true,
                            partialPaymentAmount: findOrder.partialPaymentAmount,
                            dueAmount: {
                                decrement: findOrder.partialPaymentAmount,
                            },
                            payment: (findOrder.dueAmount - findOrder.partialPaymentAmount === 0) ? true : false,
                            paymentAmount: {
                                increment: findOrder.partialPaymentAmount
                            },
                            status: (findOrder.dueAmount - findOrder.partialPaymentAmount === 0) ? "Success" : "Pending",
                        },
                    });
                    if (findOrder.order) {
                        await prisma.order.update({
                            where: {
                                id: findOrder.returnOrderId
                            },
                            data: {
                                partial: true,
                                partialPaymentAmount: findOrder.order.partialPaymentAmount,
                                dueAmount: {
                                    decrement: findOrder.order.partialPaymentAmount,
                                },
                                payment: (findOrder.order.dueAmount - findOrder.order.partialPaymentAmount === 0) ? true : false,
                                paymentAmount: {
                                    increment: findOrder.order.partialPaymentAmount
                                },
                                status: (findOrder.order.dueAmount - findOrder.order.partialPaymentAmount === 0) ? "Success" : "Pending",
                            },
                        });
                    }
                } else {
                    await prisma.order.update({
                        where: { id: findOrder.id },
                        data: {
                            partial: true,
                            partialPaymentAmount: findOrder.partialPaymentAmount,
                            dueAmount: {
                                decrement: findOrder.partialPaymentAmount
                            },
                            payment: (findOrder.dueAmount - findOrder.partialPaymentAmount === 0) ? true : false,
                            paymentAmount: findOrder.partialPaymentAmount,
                            status: (findOrder.dueAmount - findOrder.partialPaymentAmount === 0) ? "Success" : "Pending",
                        },
                    });
                }
            } else if (findOrder.paymentType === "PARTIAL" && findOrder.partial) {
                if (!findOrder.returnOrderId) {
                    await prisma.order.update({
                        where: { id: findOrder.id },
                        data: {
                            partialPaymentAmount: findOrder.amount,
                            dueAmount: {
                                decrement: findOrder.partialPaymentAmount
                            },
                            payment: (findOrder.dueAmount - findOrder.partialPaymentAmount === 0) ? true : false,
                            paymentAmount: {
                                increment: findOrder.partialPaymentAmount
                            },
                            status: (findOrder.dueAmount - findOrder.partialPaymentAmount === 0) ? "Success" : "Pending",
                        },
                    });
                } else {
                    await prisma.order.update({
                        where: { id: findOrder.id },
                        data: {
                            partialPaymentAmount: findOrder.amount,
                            dueAmount: {
                                decrement: findOrder.partialPaymentAmount
                            },
                            payment: (findOrder.dueAmount - findOrder.partialPaymentAmount === 0) ? true : false,
                            paymentAmount: {
                                increment: findOrder.partialPaymentAmount
                            },
                            status: (findOrder.dueAmount - findOrder.partialPaymentAmount === 0) ? "Success" : "Pending",
                        },
                    });
                    if (findOrder.order) {
                        await prisma.order.update({
                            where: { id: findOrder.order.id },
                            data: {
                                partialPaymentAmount: findOrder.order.amount,
                                dueAmount: {
                                    decrement: findOrder.order.partialPaymentAmount
                                },
                                payment: (findOrder.order.dueAmount - findOrder.order.partialPaymentAmount === 0) ? true : false,
                                paymentAmount: {
                                    increment: findOrder.order.partialPaymentAmount
                                },
                                status: (findOrder.order.dueAmount - findOrder.order.partialPaymentAmount === 0) ? "Success" : "Pending",
                            },
                        });
                    }
                }
                await prisma.orderSeat.updateMany({
                    where: {
                        id: findOrder.id
                    },
                    data: {
                        status: (findOrder.dueAmount - findOrder.partialPaymentAmount === 0) ? "Success" : "Pending",
                    },
                });
                if (findOrder.order) {
                    await prisma.orderSeat.updateMany({
                        where: {
                            id: findOrder.order.id
                        },
                        data: {
                            status: (findOrder.dueAmount - findOrder.order.partialPaymentAmount === 0) ? "Success" : "Pending",
                        },
                    });
                }
            }
            findPayment = await prisma.payment.update({
                where: { transId: tran_id },
                data: {
                    status: 'Success',
                    valId: data.val_id,
                    bankTransId: data.bank_tran_id,
                    cardType: data.card_type,
                    cardIssuer: data.card_issuer,
                    card_brand: data.card_brand,
                },
                include: {
                    order: {
                        include: {
                            order: true,
                        }
                    },
                }
            });

            await sendEmailAndSms(findOrder.id);

        } else if (data.status === "FAILED") {
            await prisma.payment.update({
                where: { transId: tran_id },
                data: { status: 'Failed', },
            });
        }
        res.status(200).send("OK");

    }
    catch (err) {
        next(err);
    }
}

export const refundPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { paymentId, whyRefund } = req.body;
        const findPayment = await prisma.payment.findUnique({
            where: {
                id: paymentId
            },
        });
        if (!findPayment) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Payment not found'
            });
        }

        const findRefund = await prisma.refundPayment.findFirst({
            where: {
                paymentId: paymentId
            },
        });
        if (findRefund) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Refund Request Already Initialized'
            });
        }

        const result = await axios.get(`${refundPaymentURL}?bank_tran_id=${findPayment.bankTransId}&refund_amount=${findPayment.amount}&refund_remarks=${whyRefund}&store_id=${store_id}&store_passwd=${store_passwd}&v=1&format=json`);
        if (result?.data.APIConnect === "DONE" && result.data.status === "success") {
            const data = {
                paymentId,
                refundAmount: findPayment.amount,
                refundRemarks: whyRefund,
                refundStatus: result?.data?.status,
                refundRefId: result?.data?.refund_ref_id
            }
            const refundInfo = await prisma.refundPayment.create({
                data,
            })
            res.status(200).send({
                success: true,
                statusCode: 200,
                message: 'Refund Payment Initialized Successfully!',
                data: refundInfo
            });
        } else {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: result?.data?.errorReason,
            });
        }
    } catch (err) {
        next(err);
    }
}


export const refundPaymentStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findRefundPayment = await prisma.refundPayment.findFirst({
            where: {
                paymentId: id
            },
        });
        if (!findRefundPayment) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Refund Payment not found'
            });
        }
        const { data } = await axios.get(`${refundPaymentStatusURL}?refund_ref_id=${findRefundPayment.refundRefId}&store_id=${store_id}&store_passwd=${store_passwd}&format=json`);
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Refund Payment Status Check Successful!',
            data: data,
        })
    } catch (err) {
        next(err)
    }
}

export const paymentSuccess = async (req: Request, res: Response, next: NextFunction) => {
    const tranId = req.params.tran_id;
    res.redirect(`https://iconicticket.com/payment-success/${tranId}`);
}
export const paymentCanceled = async (req: Request, res: Response, next: NextFunction) => {
    res.redirect(`https://iconicticket.com/payment-canceled`);
}
export const paymentFailed = async (req: Request, res: Response, next: NextFunction) => {
    res.redirect(`https://iconicticket.com/payment-failed`);
}