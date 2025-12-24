import { Counter } from './../../../node_modules/.prisma/client/index.d';
import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { PermissionUser, Prisma, Segment, SegmentFare } from "@prisma/client";
import { findOrderSeat, findOrderSeatByBooking } from "../../utils/findOrderSeat";
import axios from "axios";
import config from "../../config";
import sendEmailAndSms from "../../utils/SendEmailAndSms";


const store_id = config.sslStoreId;
const store_passwd = config.sslStorePass;
const paymentInstanceURL = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"

export const generateTicketNo = async () => {
    const findOrder = await prisma.order.findFirst({
        orderBy: {
            ticketNo: 'desc'
        }
    })
    let findId;
    if (findOrder) {
        findId = findOrder?.ticketNo.toString() || '00000';
    } else {
        findId = '100000'
    }
    const nextId = parseInt(findId) + 1
    const newId = nextId.toString().padStart(5, '0')
    return newId
};


export const deleteOldBookings = async () => {
    const fiveMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

    try {
        const result = await prisma.bookingSeat.deleteMany({
            where: {
                createdAt: {
                    lte: fiveMinutesAgo,
                },
            },
        });
    } catch (error) {
        console.error('Error deleting old bookings:', error);
    }
}


export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { seats, fromStationId, destinationStationId, coachConfigId, returnCoachConfigId = 0, returnBoardingPoint, returnDroppingPoint, ...data } = req.body;
        console.log({ coachConfigId })
        const findCoach = await prisma.coachConfig.findUnique({
            where: {
                id: coachConfigId
            },
            include: {
                coach: {
                    include: {
                        route: {
                            include: {
                                Segment: {
                                    include: {
                                        SegmentFare: true,
                                    }
                                },
                            }
                        }
                    }
                }
            }
        })
        let findReturnCoach = null;

        if (returnCoachConfigId) {
            findReturnCoach = await prisma.coachConfig.findUnique({
                where: {
                    id: returnCoachConfigId
                },
                include: {
                    coach: {
                        include: {
                            route: {
                                include: {
                                    Segment: {
                                        include: {
                                            SegmentFare: true,
                                        }
                                    },
                                }
                            }
                        }
                    }
                }
            })
        }
        if (!findCoach) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Coach Not Found'
            })
        }
        if (data.orderType === "Round_Trip" && !findReturnCoach) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Return Coach Not Found'
            })
        }
        let id = 0;
        const transaction = await prisma.$transaction(async (prisma) => {
            if (data.orderType === "Round_Trip") {
                const findCoachSeat = seats.filter((seat: any) => seat.coachConfigId === coachConfigId)
                const findReturnCoachSeat = seats.filter((seat: any) => seat.coachConfigId === returnCoachConfigId);
                let amount = 0;
                let returnAmount = 0;

                const findSegment = findCoach.coach?.route?.Segment[0].SegmentFare.find((segment: SegmentFare) => fromStationId === segment.fromStationId && destinationStationId === segment.toStationId)

                const findReturnSegment = findReturnCoach!.coach?.route?.Segment[0].SegmentFare.find((segment: SegmentFare) => destinationStationId === segment.fromStationId && fromStationId === segment.toStationId)
                if (findSegment) {
                    if (findCoach.coach.coachClass === "E_Class") {
                        amount += 0 * (findCoachSeat.length || 0)
                    } else if (findCoach.coach.coachClass === "B_Class") {
                        amount += 0 * (findCoachSeat.length || 0)
                    } else if (findCoach.coach.coachClass === "S_Class") {
                        for (const seat of findCoachSeat) {
                            if (seat[0] === 'L') {

                                amount += 0
                            } else {
                                amount += 0

                            }
                        }
                    } else {
                        amount += 0 * (findCoachSeat.length || 0)
                    }
                }
                if (findReturnSegment) {
                    if (findReturnCoach!.coach.coachClass === "E_Class") {
                        returnAmount += 0 * (findCoachSeat.length || 0)
                    } else if (findReturnCoach!.coach.coachClass === "B_Class") {
                        returnAmount += 0 * (findCoachSeat.length || 0)
                    } else if (findReturnCoach!.coach.coachClass === "S_Class") {
                        for (const seat of findReturnCoachSeat) {
                            if (seat[0] === 'L') {

                                returnAmount += 0
                            } else {
                                returnAmount += 0

                            }
                        }
                    } else {
                        returnAmount += 0 * (findCoachSeat.length || 0)
                    }
                }


                if (!data.counterId && data.paymentType == "PARTIAL" && !data.paymentAmount) {
                    return res.status(400).send({
                        success: false,
                        statusCode: 400,
                        message: 'Payment Amount is required for PARTIAL payment'
                    })
                }

                let ticketNo = await generateTicketNo();
                if (data.orderType === "Round_Trip") {
                    if (!data?.returnBoardingPoint || !data?.returnDroppingPoint) {
                        data.returnBoardingPoint = data.droppingPoint;
                        data.returnDroppingPoint = data.boardingPoint;
                    }
                }

                const resultOne = await prisma.order.create({
                    data: {
                        coachConfigId,
                        ticketNo: ticketNo,
                        date: data.date,
                        boardingPoint: data.boardingPoint,
                        droppingPoint: data.droppingPoint,
                        customerName: data.customerName,
                        phone: data.phone,
                        email: data.email,
                        address: data.address,
                        gender: data.gender,
                        bookingType: data.bookingType,
                        age: data.age,
                        nid: data.nid,
                        nationality: data.nationality,
                        paymentMethod: data.paymentMethod,
                        paymentType: data.paymentType,
                        noOfSeat: findCoachSeat.length || 0,
                        amount: data.amount / 2,
                        partialPaymentAmount: data.paymentType === "Full" ? amount : (data.paymentAmount > amount ? amount : data.paymentAmount),
                        dueAmount: data.amount,
                    }
                })
                let availablePaymentAmount = (data.paymentAmount > data.amount ? data.paymentAmount - data.amount : 0);
                const resultTwo = await prisma.order.create({
                    data: {
                        coachConfigId: returnCoachConfigId,
                        returnOrderId: resultOne.id,
                        ticketNo: (Number(ticketNo) + 1).toString().padStart(5, '0'),
                        date: data.returnDate,
                        boardingPoint: data.returnBoardingPoint,
                        droppingPoint: data.returnDroppingPoint,
                        customerName: data.customerName,
                        phone: data.phone,
                        email: data.email,
                        address: data.address,
                        gender: data.gender,
                        bookingType: data.bookingType,
                        age: data.age,
                        nid: data.nid,
                        nationality: data.nationality,
                        paymentMethod: data.paymentMethod,
                        paymentType: data.paymentType,
                        noOfSeat: findReturnCoachSeat.length || 0,
                        amount: data.amount / 2,
                        partialPaymentAmount: data.paymentType === "Full" ? data.returnAmount : availablePaymentAmount,
                        dueAmount: data.returnAmount,
                    }
                })

                if (resultOne && resultTwo) {
                    await prisma.order.update({
                        where: {
                            id: resultOne.id
                        },
                        data: {
                            returnOrderId: resultTwo.id
                        }
                    })
                    await prisma.orderSeat.createMany({
                        data: findCoachSeat.map((seat: any) => ({
                            segmentId: findSegment!.id,
                            isSeatShare: findCoach.coach.route.from === seat.fromStationId && findCoach.coach.route.to === seat.destinationStationId ? false : true,
                            fromStationId: seat.fromStationId,
                            destinationStationId: seat.destinationStationId,
                            coachConfigId: coachConfigId,
                            date: seat.date,
                            fare: seat.fare,
                            seat: seat.seat,
                            orderId: resultOne.id,
                            status: "Pending",
                            unitPrice: amount / findCoachSeat.length,
                            discount: findCoach?.discount || 0,
                            paymentMethod: resultOne.paymentMethod,
                            online: true,

                        }))
                    })
                    await prisma.orderSeat.createMany({
                        data: findReturnCoachSeat.map((seat: any) => ({
                            segmentId: findReturnSegment!.id,
                            isSeatShare: findReturnCoach!.coach.route.from === seat.fromStationId && findReturnCoach!.coach.route.to === seat.destinationStationId ? false : true,
                            fromStationId: seat.fromStationId,
                            destinationStationId: seat.destinationStationId,
                            coachConfigId: returnCoachConfigId,
                            date: seat.date,
                            fare: seat.fare,
                            seat: seat.seat,
                            orderId: resultTwo.id,
                            status: "Pending",
                            unitPrice: returnAmount / findReturnCoachSeat.length,
                            discount: findReturnCoach?.discount || 0,
                            paymentMethod: resultTwo.paymentMethod,
                            online: true,

                        }))
                    })

                    await prisma.coachConfig.update({
                        where: {
                            id: coachConfigId
                        },
                        data: {
                            seatAvailable: {
                                decrement: findCoachSeat.length || 0
                            }
                        }
                    })
                    await prisma.coachConfig.update({
                        where: {
                            id: returnCoachConfigId
                        },
                        data: {
                            seatAvailable: {
                                decrement: findReturnCoachSeat.length || 0
                            }
                        }
                    })


                    await prisma.bookingSeat.deleteMany({
                        where: {
                            coachConfigId: coachConfigId,

                            seat: {
                                in: findCoachSeat.map((seat: any) => seat.seat)
                            },
                        }
                    })
                    await prisma.bookingSeat.deleteMany({
                        where: {
                            coachConfigId: returnCoachConfigId,

                            seat: {
                                in: findReturnCoachSeat.map((seat: any) => seat.seat)
                            },
                        }
                    })
                }
                const timestamp = Date.now();
                const url = paymentInstanceURL;
                const is_live = false //true for live, false for sandbox

                let productName = "Seat";
                // for (const seat of seats) {
                //     productName += seat.seat + " ";
                // }
                const tran_id = `tran_id-${timestamp}`;
                const orderData = {
                    store_id,
                    store_passwd,
                    total_amount: resultOne.paymentType === "FULL" ? resultOne.amount + resultTwo.amount : resultOne.partialPaymentAmount + resultTwo.partialPaymentAmount,
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
                    cus_name: resultOne.customerName || "N/A",
                    cus_email: resultOne.email || "N/A",
                    cus_add1: resultOne.address || "N/A",
                    cus_add2: 'Dhaka',
                    cus_city: 'Dhaka',
                    cus_state: 'Dhaka',
                    cus_postcode: '1000',
                    cus_country: resultOne.nationality || "N/A",
                    cus_phone: resultOne.phone || "N/A",
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
                const paymentsResult = await axios.post(url, orderData, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${Buffer.from(`${store_id}:${store_passwd}`).toString('base64')}`
                    }
                })
                if (paymentsResult.data.status === "SUCCESS") {
                    await prisma.payment.create({
                        data: {
                            orderId: resultOne.id,
                            returnOrderId: resultTwo.id,
                            amount: resultOne.paymentType === "FULL" ? resultOne.amount + resultTwo.amount : resultOne.partialPaymentAmount + resultTwo.partialPaymentAmount,
                            transId: tran_id,
                            userPhone: resultOne.phone,
                            sessionKey: paymentsResult.data.sessionkey,
                            userEmail: resultOne.email || "N/A",
                        }
                    })
                }
                id = resultTwo.id

                return {
                    success: true,
                    statusCode: 200,
                    message: 'Order Created Success',
                    status: paymentsResult.data.status,
                    url: paymentsResult.data.GatewayPageURL,
                    sessionKey: paymentsResult.data.sessionkey
                }

            } else {


                const findSegment = findCoach.coach.route.Segment[0].SegmentFare.find((segment: SegmentFare) => fromStationId === segment.fromStationId && destinationStationId === segment.toStationId)
                let amount = data.amount;
                // if (findSegment) {
                //     if (findCoach.coachClass === "E_Class") {
                //         amount += 0 * (seats.length || 0)
                //     } else if (findCoach.coachClass === "B_Class") {
                //         amount += 0 * (seats.length || 0)
                //     } else if (findCoach.coachClass === "S_Class") {
                //         for (const seat of seats) {
                //             if (seat[0] === 'L') {

                //                 amount += 0
                //             } else {
                //                 amount += 0

                //             }
                //         }
                //     } else {
                //         amount += 0 * (seats.length || 0)
                //     }
                // }


                if (!data.counterId && data.paymentType == "PARTIAL" && !data.paymentAmount) {
                    return res.status(400).send({
                        success: false,
                        statusCode: 400,
                        message: 'Payment Amount is required for PARTIAL payment'
                    })
                }

                data.ticketNo = await generateTicketNo();
                const result = await prisma.order.create({
                    data: {
                        ...data,
                        partialPaymentAmount: data.paymentType === "PARTIAL" ? data.paymentAmount : 0,
                        dueAmount: amount,
                        paymentAmount: 0,
                        coachConfigId
                    }
                })
                if (result) {

                    await prisma.orderSeat.createMany({
                        data: seats.map((seat: any) => ({
                            segmentId: findSegment!.id,
                            isSeatShare: findCoach.coach.route.from === seat.fromStationId && findCoach.coach.route.to === seat.destinationStationId ? false : true,
                            fromStationId: seat.fromStationId,
                            destinationStationId: seat.destinationStationId,
                            coachConfigId: coachConfigId,
                            date: seat.date,
                            seat: seat.seat,
                            orderId: result.id,
                            status: "Pending",
                            unitPrice: amount / seats.length,
                            discount: findCoach.discount,
                            paymentMethod: result.paymentMethod,
                            online: true,
                            fare: seat.fare
                        }))
                    })
                    await prisma.coachConfig.update({
                        where: {
                            id: coachConfigId
                        },
                        data: {
                            seatAvailable: {
                                decrement: seats.length
                            }
                        }
                    })
                    await prisma.bookingSeat.deleteMany({
                        where: {
                            coachConfigId: coachConfigId,
                            seat: {
                                in: seats.map((seat: any) => seat.seat)
                            },
                        }
                    })
                }

                const timestamp = Date.now();
                const url = paymentInstanceURL;
                const is_live = false //true for live, false for sandbox

                let productName = "Seat";
                // for (const seat of seats) {
                //     productName += seat.seat + " ";
                // }
                const tran_id = `tran_id-${timestamp}`;
                const orderData = {
                    store_id,
                    store_passwd,
                    total_amount: result.paymentType === "FULL" ? result.amount : result.partialPaymentAmount,
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
                    cus_name: result.customerName || "N/A",
                    cus_email: result.email || "N/A",
                    cus_add1: result.address || "N/A",
                    cus_add2: 'Dhaka',
                    cus_city: 'Dhaka',
                    cus_state: 'Dhaka',
                    cus_postcode: '1000',
                    cus_country: result.nationality || "N/A",
                    cus_phone: result.phone || "N/A",
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
                const paymentsResult = await axios.post(url, orderData, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${Buffer.from(`${store_id}:${store_passwd}`).toString('base64')}`
                    }
                })
                if (paymentsResult.data.status === "SUCCESS") {
                    await prisma.payment.create({
                        data: {
                            orderId: result.id,
                            amount: result.paymentType === "FULL" ? result.amount : result.partialPaymentAmount,
                            transId: tran_id,
                            userPhone: result.phone,
                            sessionKey: paymentsResult.data.sessionkey,
                            userEmail: result.email || "N/A",

                        }
                    })
                }
                id = result.id;

                return {
                    success: true,
                    statusCode: 200,
                    message: 'Order Created Success',
                    status: paymentsResult.data.status,
                    url: paymentsResult.data.GatewayPageURL,
                    sessionKey: paymentsResult.data.sessionkey
                }
            }

        },
            {
                maxWait: 500000,
                timeout: 1000000,
            }
        )
        res.status(200).send(transaction)

    }
    catch (err) {
        next(err)
    }
}
export const createOrderCounter = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { id, permission, counterId, } = req.user;


        const { seats, fromStationId, destinationStationId, coachConfigId, returnCoachConfigId = 0, returnBoardingPoint, returnDroppingPoint, ...data } = req.body;
        if (data.bookingType === "SeatBooking" && (!permission || !permission.bookingPermission)) {
            console.log("ss", data.bookingType)
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'You have no permission to Seat Booking'
            })
        }
        const findCoach = await prisma.coachConfig.findUnique({
            where: {
                id: coachConfigId
            },
            include: {
                coach: {
                    include: {
                        route: {
                            include: {
                                Segment: {
                                    include: {
                                        SegmentFare: true,
                                    }
                                },
                            }
                        }
                    }
                }
            }
        })
        let findReturnCoach = null;

        if (returnCoachConfigId) {
            findReturnCoach = await prisma.coachConfig.findUnique({
                where: {
                    id: returnCoachConfigId
                },
                include: {
                    coach: {
                        include: {
                            route: {
                                include: {
                                    Segment: {
                                        include: {
                                            SegmentFare: true,
                                        }
                                    },
                                }
                            }
                        }
                    }
                }
            })
        }
        if (!findCoach) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Coach Not Found'
            })
        }
        if (data.orderType === "Round_Trip" && !findReturnCoach) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Return Coach Not Found'
            })
        }
        if (data.bookingType === "SeatBooking" && data.orderType === "Round_Trip") {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Seat Booking Not Allow For Round Trip'
            })
        }


        const transaction = await prisma.$transaction(async (prisma) => {
            if (permission && permission.isPrepaid) {
                const findCounter = await prisma.counter.findUnique({
                    where: {
                        id: counterId
                    }
                })
                if (findCounter) {
                    if (findCounter.balance < data.amount) {
                        return res.status(400).send({
                            success: false,
                            statusCode: 400,
                            message: 'Insufficient Balance'
                        })
                    } else {
                        await prisma.counter.update({
                            where: {
                                id: counterId
                            },
                            data: {
                                balance: findCounter.balance - data.amount
                            }
                        })
                    }

                }
            }
            if (data.orderType === "Round_Trip") {
                const findCoachSeat = seats.filter((seat: any) => seat.coachConfigId === coachConfigId)
                const findReturnCoachSeat = seats.filter((seat: any) => seat.coachConfigId === returnCoachConfigId);
                let amount = 0;
                let returnAmount = 0;
                const findSegment = findCoach.coach.route.Segment[0].SegmentFare.find((segment: SegmentFare) => fromStationId === segment.fromStationId && destinationStationId === segment.toStationId)

                const findReturnSegment = findReturnCoach!.coach.route.Segment[0].SegmentFare.find((segment: SegmentFare) => destinationStationId === segment.fromStationId && fromStationId === segment.toStationId)

                if (findSegment) {
                    if (findCoach.coach.coachClass === "E_Class") {
                        amount += (0 * (findCoachSeat.length || 0) - (findCoach.discount * (findCoachSeat.length || 0)))
                    } else if (findCoach.coach.coachClass === "B_Class") {
                        amount += (0 * (findCoachSeat.length || 0) - (findCoach.discount * (findCoachSeat.length || 0)))
                    } else if (findCoach.coach.coachClass === "S_Class") {
                        for (const seat of findCoachSeat) {
                            if (seat[0] === 'L') {

                                amount += 0 - (findCoach.discount)
                            } else {
                                amount += 0 - (findCoach.discount)

                            }
                        }
                    } else {
                        amount += (0 * (findCoachSeat.length || 0) - (findCoach.discount * (findCoachSeat.length || 0)))
                    }
                }
                if (findReturnSegment) {
                    if (findReturnCoach!.coach.coachClass === "E_Class") {
                        returnAmount += (0 * (findReturnCoachSeat.length || 0) - (findReturnCoach!.discount * (findReturnCoachSeat.length || 0)))
                    } else if (findReturnCoach!.coach.coachClass === "B_Class") {
                        returnAmount += (0 * (findReturnCoachSeat.length || 0) - (findReturnCoach!.discount * (findReturnCoachSeat.length || 0)))
                    } else if (findReturnCoach!.coach.coachClass === "S_Class") {
                        for (const seat of findReturnCoachSeat) {
                            if (seat[0] === 'L') {

                                returnAmount += 0 - (findReturnCoach!.discount)
                            } else {
                                returnAmount += 0 - (findReturnCoach!.discount)

                            }
                        }
                    } else {
                        returnAmount += (0 * (findReturnCoachSeat.length || 0) - (findReturnCoach!.discount * (findReturnCoachSeat.length || 0)))
                    }
                }


                if (!data.counterId && data.paymentType == "PARTIAL" && !data.paymentAmount) {
                    return res.status(400).send({
                        success: false,
                        statusCode: 400,
                        message: 'Payment Amount is required for PARTIAL payment'
                    })
                }

                let ticketNo = await generateTicketNo();
                let totalUpPrice = seats
                    .filter((s: any) => s.coachConfigId === coachConfigId)
                    .reduce((sum: any, s: any) => sum + s.unitPrice, 0);
                let totalDownPrice = seats
                    .filter((s: any) => s.coachConfigId === returnCoachConfigId)
                    .reduce((sum: any, s: any) => sum + s.unitPrice, 0);
                const resultOne = await prisma.order.create({
                    data: {
                        coachConfigId,
                        counterId: data.counterId,
                        userId: data.userId,
                        ticketNo: ticketNo,
                        date: data.date,
                        boardingPoint: data.boardingPoint,
                        droppingPoint: data.droppingPoint,
                        customerName: data.customerName,
                        phone: data.phone,
                        email: data.email,
                        address: data.address,
                        gender: data.gender,
                        bookingType: data.bookingType,
                        age: data.age,
                        nid: data.nid,
                        nationality: data.nationality,
                        paymentMethod: data.paymentMethod,
                        paymentType: data.paymentType,
                        noOfSeat: findCoachSeat.length || 0,
                        amount: totalUpPrice,
                        paymentAmount: data.paymentType === "Full" ? amount : (data.paymentAmount > amount ? amount : data.paymentAmount),
                        partialPaymentAmount: data.paymentType === "Full" ? amount : (data.paymentAmount > amount ? amount : data.paymentAmount),
                        dueAmount: data.paymentType === "Full" ? 0 : (data.paymentAmount > amount ? 0 : amount - data.paymentAmount),
                        partial: true,
                    }
                })
                let availablePaymentAmount = (data.paymentAmount > amount ? returnAmount - (data.paymentAmount - amount) : returnAmount);
                const resultTwo = await prisma.order.create({
                    data: {
                        returnOrderId: resultOne.id,
                        counterId: data.counterId,
                        userId: data.userId,
                        coachConfigId: returnCoachConfigId,
                        ticketNo: (Number(ticketNo) + 1).toString().padStart(5, '0'),
                        date: data.returnDate,
                        boardingPoint: returnBoardingPoint,
                        droppingPoint: returnDroppingPoint,
                        customerName: data.customerName,
                        phone: data.phone,
                        email: data.email,
                        address: data.address,
                        gender: data.gender,
                        bookingType: data.bookingType,
                        age: data.age,
                        nid: data.nid,
                        nationality: data.nationality,
                        paymentMethod: data.paymentMethod,
                        paymentType: data.paymentType,
                        noOfSeat: findReturnCoachSeat.length || 0,
                        amount: totalDownPrice,
                        paymentAmount: data.paymentType === "Full" ? amount : (data.paymentAmount > amount ? amount : data.paymentAmount),
                        partialPaymentAmount: data.paymentType === "Full" ? returnAmount : availablePaymentAmount,
                        dueAmount: availablePaymentAmount,
                        partial: true,
                        status: data.paymentType === "Full" ? "Success" : "Pending"
                    }
                })


                if (resultOne && resultTwo) {
                    await prisma.order.update({
                        where: {
                            id: resultOne.id
                        },
                        data: {
                            returnOrderId: resultTwo.id
                        }
                    })
                    await prisma.orderSeat.createMany({
                        data: findCoachSeat.map((seat: any) => ({
                            segmentId: findSegment!.id,
                            isSeatShare: findCoach.coach.route.from === seat.fromStationId && findCoach.coach.route.to === seat.destinationStationId ? false : true,
                            fromStationId: seat.fromStationId,
                            destinationStationId: seat.destinationStationId,
                            coachConfigId: coachConfigId,
                            date: seat.date,
                            seat: seat.seat,
                            fare: seat.fare,
                            orderId: resultOne.id,
                            status: "Success",
                            unitPrice: totalUpPrice / findCoachSeat.length,
                            discount: findCoach.discount || 0,
                            paymentMethod: resultOne.paymentMethod,
                            online: false,

                        }))
                    })
                    await prisma.orderSeat.createMany({
                        data: findReturnCoachSeat.map((seat: any) => ({
                            segmentId: findReturnSegment!.id,
                            isSeatShare: findReturnCoach!.coach.route.from === seat.fromStationId && findReturnCoach!.coach.route.to === seat.destinationStationId ? false : true,
                            fromStationId: seat.fromStationId,
                            destinationStationId: seat.destinationStationId,
                            coachConfigId: returnCoachConfigId,
                            date: seat.date,
                            seat: seat.seat,
                            fare: seat.fare,
                            orderId: resultTwo.id,
                            status: "Success",
                            unitPrice: totalDownPrice / findCoachSeat.length,
                            discount: findReturnCoach?.discount || 0,
                            paymentMethod: resultOne.paymentMethod,
                            online: false,

                        }))
                    })

                    await prisma.coachConfig.update({
                        where: {
                            id: coachConfigId
                        },
                        data: {
                            seatAvailable: {
                                decrement: findCoachSeat.length || 0
                            }
                        }
                    })
                    await prisma.coachConfig.update({
                        where: {
                            id: returnCoachConfigId
                        },
                        data: {
                            seatAvailable: {
                                decrement: findReturnCoachSeat.length || 0
                            }
                        }
                    })


                    await prisma.bookingSeat.deleteMany({
                        where: {
                            coachConfigId: coachConfigId,
                            seat: {
                                in: findCoachSeat.map((seat: any) => seat.seat)
                            },
                        }
                    })
                    await prisma.bookingSeat.deleteMany({
                        where: {
                            coachConfigId: returnCoachConfigId,
                            seat: {
                                in: findReturnCoachSeat.map((seat: any) => seat.seat)
                            },
                        }
                    })
                }
                const findOrder = await prisma.order.findUnique({
                    where: {
                        id: resultOne.id,
                    },
                    include: {
                        coachConfig: {
                            include: {
                                coach: {
                                    include: {
                                        CoachViaRoute: {
                                            include: {
                                                counter: true,
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        orderSeat: {
                            include: {
                                coachConfig: true
                            }
                        },
                        returnOrder: {
                            include: {
                                coachConfig: {
                                    include: {
                                        coach: {
                                            include: {
                                                CoachViaRoute: {
                                                    include: {
                                                        counter: true,
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                orderSeat: {
                                    include: {
                                        coachConfig: true,
                                    }
                                }
                            }
                        }
                    }
                })


                return {
                    success: true,
                    statusCode: 200,
                    message: 'Order Created Success',
                    data: findOrder
                }


            } else {
                const findCoachSeat = seats.filter((seat: any) => seat.coachConfigId === coachConfigId)

                const findSegment = findCoach.coach.route.Segment[0].SegmentFare.find((segment: SegmentFare) => fromStationId === segment.fromStationId && destinationStationId === segment.toStationId)
                let amount = 0;
                if (findSegment) {
                    if (findCoach.coach.coachClass === "E_Class") {
                        amount += (0 * (seats.length || 0) - findCoach.discount * (seats.length || 0))
                    } else if (findCoach.coach.coachClass === "B_Class") {
                        amount += (0 * (seats.length || 0) - findCoach.discount * (seats.length || 0))
                    } else if (findCoach.coach.coachClass === "S_Class") {
                        for (const seat of seats) {
                            if (seat[0] === 'L') {

                                amount += 0 - findCoach.discount
                            } else {
                                amount += 0 - findCoach.discount

                            }
                        }
                    } else {
                        amount += (0 * (seats.length || 0) - findCoach.discount * (seats.length || 0))
                    }
                }


                if (data.counterId && data.paymentType == "PARTIAL" && !data.paymentAmount) {
                    return res.status(400).send({
                        success: false,
                        statusCode: 400,
                        message: 'Payment Amount is required for PARTIAL payment'
                    })
                }
                let findOrder;
                if (data.bookingType === "SeatIssue") {
                    data.ticketNo = await generateTicketNo();

                    const result = await prisma.order.create({
                        data: {
                            ...data,
                            counterId: data.counterId,
                            userId: data.userId,
                            coachConfigId,
                        }
                    })
                    if (result) {

                        await prisma.orderSeat.createMany({
                            data: seats.map((seat: any) => ({
                                segmentId: findSegment!.id,
                                isSeatShare: findCoach.coach.route.from === seat.fromStationId && findCoach.coach.route.to === seat.destinationStationId ? false : true,
                                fromStationId: seat.fromStationId,
                                destinationStationId: seat.destinationStationId,
                                coachConfigId: coachConfigId,
                                date: seat.date,
                                seat: seat.seat,
                                orderId: result.id,
                                status: "Success",
                                unitPrice: data.amount / findCoachSeat.length,
                                discount: findCoach.discount || 0,
                                paymentMethod: result.paymentMethod,
                                online: false,
                                fare: seat?.fare
                            }))
                        })
                        await prisma.coachConfig.update({
                            where: {
                                id: coachConfigId
                            },
                            data: {
                                seatAvailable: {
                                    decrement: seats.length
                                }
                            }
                        })

                        await Promise.all(
                            seats.map((seat: any) =>
                                prisma.counterBookedSeat.deleteMany({
                                    where: {
                                        segmentId: findSegment!.id,
                                        counterId: data.counterId,
                                        userId: id,
                                        isSeatShare:
                                            findCoach.coach.route.from === seat.fromStationId &&
                                                findCoach.coach.route.to === seat.destinationStationId
                                                ? false
                                                : true,
                                        fromStationId: seat.fromStationId,
                                        destinationStationId: seat.destinationStationId,
                                        coachConfigId: coachConfigId,
                                        date: seat.date,
                                        seat: seat.seat,
                                    },
                                })
                            )
                        );

                        await prisma.bookingSeat.deleteMany({
                            where: {
                                coachConfigId: coachConfigId,
                                seat: {
                                    in: seats.map((seat: any) => seat.seat)
                                },
                            }
                        })
                    }
                    findOrder = await prisma.order.findUnique({
                        where: {
                            id: result.id,
                        },
                        include: {
                            coachConfig: {
                                include: {
                                    coach: {
                                        include: {
                                            CoachViaRoute: {
                                                include: {
                                                    counter: true,
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            orderSeat: {
                                include: {
                                    coachConfig: true,
                                }
                            }
                        }
                    })
                } else {
                    await prisma.bookingSeat.deleteMany({
                        where: {
                            coachConfigId: coachConfigId,
                            seat: {
                                in: seats.map((seat: any) => seat.seat)
                            },
                        }
                    })
                    await prisma.counterBookedSeat.createMany({
                        data: seats.map((seat: any) => ({
                            segmentId: findSegment!.id,
                            counterId: data.counterId,
                            userId: id,
                            isSeatShare: findCoach.coach.route.from === seat.fromStationId && findCoach.coach.route.to === seat.destinationStationId ? false : true,
                            fromStationId: seat.fromStationId,
                            destinationStationId: seat.destinationStationId,
                            coachConfigId: coachConfigId,
                            date: seat.date,
                            seat: seat.seat,
                            paymentMethod: data.paymentMethod,
                            customerName: data.customerName,
                            phone: data.phone,
                            email: data.email,
                            address: data.address,
                            age: data.age,
                            gender: data.gender,
                            nid: data.nid,
                            nationality: data.nationality,
                            paymentType: data.paymentType,
                            boardingPoint: data.boardingPoint,
                            droppingPoint: data.droppingPoint,
                        }))
                    })
                }

                return {
                    success: true,
                    statusCode: 200,
                    message: 'Order Created Success',
                    data: findOrder
                }
            }

        },
            {
                maxWait: 500000,
                timeout: 1000000,
            }
        )
        res.status(200).send(transaction)

    }

    catch (err) {
        next(err)
    }
}

export const checkSeatAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { seats, fromStationId, destinationStationId, coachConfigId, } = req.body;
        let available = true;
        let seatNo = null;
        const result = await findOrderSeat(coachConfigId, fromStationId, destinationStationId);

        for (const seat of seats) {
            const findSeat = result.find(s => s === seat);
            if (findSeat) {
                available = false;
                seatNo = findSeat;
                break;
            }
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: available ? 'Seats Available' : `${seatNo} Seats Not Available`,
            data: { available }
        })
    }
    catch (err) {
        next(err)
    }
}

export const bookingSeat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { counterId } = req.user;
        await deleteOldBookings();
        const { seat, coachConfigId, } = req.body;
        let available = true;
        let seatNo = null;
        const findSeat = await prisma.bookingSeat.findFirst({
            where: {
                coachConfigId,
                seat
            },
            include: {
                counter: {
                    select: {
                        name: true,
                    }
                }
            }
        })
        if (findSeat) {
            res.status(400).send({
                success: false,
                statusCode: 400,
                message: ` Seat Already Booked By ${findSeat.counter.name}`
            })
        } else {
            const order = await findOrderSeatByBooking(coachConfigId);
            const d = order.find(s => s === seat);

            if (d) {
                res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: `${d} Seat Already Ordered`
                })
            } else {
                const createBooking = await prisma.bookingSeat.create({
                    data: {
                        counterId,
                        coachConfigId,
                        seat
                    }
                })
                res.status(200).send({
                    success: true,
                    statusCode: 200,
                    message: available ? 'Seats Available' : `${seatNo} Seats Not Available`,
                    data: { available }
                })
            }

        }


    }
    catch (err) {
        next(err)
    }
}

export const unBookingSeat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { counterId } = req.user;
        await deleteOldBookings();
        const { seat, coachConfigId, } = req.body;
        const findSeat = await prisma.bookingSeat.findFirst({
            where: {
                coachConfigId,
                seat
            }
        })
        if (!findSeat) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Seat Not Booked"
            })
        }
        if (findSeat?.counterId !== counterId) {
            console.log(findSeat?.counterId, counterId)
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "You Don't Have Permission"
            })
        }
        if (findSeat) {
            await prisma.bookingSeat.delete({
                where:
                {
                    id: findSeat.id
                }
            })
        }

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Unbooked Done",
        })
    }
    catch (err) {
        next(err)
    }
}

export const getOrderAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.OrderWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { date: { contains: search as string, } },
                    { customerName: { contains: search as string, } },
                    { phone: { contains: search as string, } },
                ],
            });
        }
        const result = await prisma.order.findMany({
            where: {
                AND: whereCondition
            },
            include: {
                counter: {
                    select: {
                        address: true
                    }
                },

                orderSeat: {
                    select: {
                        seat: true
                    }
                }
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.order.count()
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Order retrieved Success',
            meta: {
                page: skip,
                size: take,
                total,
                totalPage: Math.ceil(total / take)
            },
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getOrderSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.order.findUnique({
            where: {
                id
            },
            include: {
                coachConfig: {
                    include: {
                        coach: true,
                    }
                },
                counter: {
                    select: {
                        address: true
                    }
                },

                orderSeat: {
                    select: {
                        seat: true
                    }
                }
            },
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Order Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Order retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}
export const findTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ticketNo = req.params.id;
        let result;
        result = await prisma.order.findUnique({
            where: {
                ticketNo
            },
            include: {
                counter: {
                    select: {
                        address: true
                    }
                },
                coachConfig: {
                    include: {
                        coach: {
                            include: {
                                CoachViaRoute: {
                                    include: {
                                        counter: true,
                                    }
                                }
                            }
                        }
                    }
                },
                orderSeat: true,
                returnOrder: {
                    include: {
                        counter: {
                            select: {
                                address: true
                            }
                        },
                        coachConfig: {
                            include: {
                                coach: true
                            }
                        },

                        orderSeat: {
                            include: {
                                coachConfig: true
                            }
                        }
                    },
                }
            },
        })
        if (!result) {
            result = await prisma.order.findFirst({
                where: {
                    phone: ticketNo
                },
                include: {
                    counter: {
                        select: {
                            address: true
                        }
                    },

                    orderSeat: {
                        include: {
                            coachConfig: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        }
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Ticket Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Ticket retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}
export const cancelTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const seatId = Number(req.params.id);
        const { cancelNote, refundAmount, refundType } = req.body;
        const { id } = req.user;
        const result = await prisma.orderSeat.findUnique({
            where: {
                id: seatId,
                // cancelBy: null
            },
            include: {
                order: {
                    include: {
                        user: {
                            select: {
                                permission: true,
                            }
                        }
                    }
                },
            }
        })
        // return res.send(result)
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Ticket Not Found'
            })
        }





        const transaction = await prisma.$transaction(async (prisma) => {

            let amount = 0;
            if (result.order?.user?.permission?.isPrepaid) {
                amount += result?.fare;

            }
            if (amount > 0 && result?.order?.counterId) {
                await prisma.counter.update({
                    where: {
                        id: result.order.counterId
                    },
                    data: {
                        balance: {
                            increment: amount
                        }
                    }
                })
            }

            await prisma.orderSeat.update({
                where: {
                    id: seatId
                },
                data: {
                    cancelBy: id,
                    cancelNote,
                    refundAmount,
                    refundType,
                    cancelDate: new Date(),
                    status: "Cancelled",
                }
            });
            await prisma.coachConfig.update({
                where: {
                    id: result.coachConfigId
                },
                data: {
                    seatAvailable: {
                        increment: 1
                    }
                }
            });
        },
            {
                maxWait: 500000,
                timeout: 1000000,
            }
        )
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Ticket Cancel Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findOrder = await prisma.order.findUnique({
            where: {
                id
            },
        })
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Order Not Found'
            })
        }
        await prisma.orderSeat.deleteMany({
            where: {
                orderId: id
            }
        })
        const result = await prisma.order.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Order Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Order Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ...data } = req.body;
        const id = Number(req.params.id)
        const findOrder = await prisma.order.findUnique({
            where: {
                id
            }
        })
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Order Not Found'
            })
        }


        const result = await prisma.order.update({
            where: {
                id,
            },
            data
        })


        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Order Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}
export const cancelRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        const { seats } = req.body;
        const { id: userId, counterId, role, permission = {} } = req.user;
        const p: PermissionUser = permission
        const findSeat = await prisma.orderSeat.findMany({
            where: {
                id: {
                    in: seats.map((seat: any) => seat)
                },

            },
            include: {
                order: {
                    include: {
                        user: {
                            select: {
                                permission: true,
                            }
                        }
                    }
                },
            }
        })
        if (role === "counter") {
            let amount = 0;
            for (const seat of findSeat) {
                if (!seat?.order?.counterId) {
                    return res.status(400).send({
                        success: false,
                        statusCode: 400,
                        message: 'This Order Is Not Booked By This Counter'
                    })
                }
                if (seat?.order?.counterId && counterId !== seat.order.counterId) {
                    return res.status(400).send({
                        success: false,
                        statusCode: 400,
                        message: 'This Order Is Not Booked By This Counter'
                    })
                }
                if (seat.order.user?.permission?.isPrepaid && p.ticketCancel) {
                    amount += seat?.fare;
                }
            }
            if (amount > 0 && findSeat[0].order.counterId) {
                await prisma.counter.update({
                    where: {
                        id: findSeat[0].order.counterId
                    },
                    data: {
                        balance: {
                            increment: amount
                        }
                    }
                })
            }
        }
        const result = await prisma.orderSeat.updateMany({
            where: {
                id: {
                    in: seats.map((seat: any) => seat)
                }
            },
            data: {
                cancelBy: p.ticketCancel ? userId : null,
                cancelDate: new Date(),
                status: p?.ticketCancel ? "Cancelled" : "CancelRequest"
            }
        })


        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Order Cancel Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}
export const orderMigrate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { cancelSeats = [], seats = [], fromStationId, destinationStationId, coachConfigId, ...data } = req.body;

        const { id: userId, permission = {} } = req.user;

        const p: PermissionUser = permission;
        if (cancelSeats.length !== seats.length) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Number Of Seats Not Match'
            })
        }

        if (!p || !p.seatTransfer) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'You Don\'t Have Permission To Migrate Order'
            })
        }

        const findSeat = await prisma.orderSeat.findMany({
            where: {
                id: {
                    in: cancelSeats.map((seat: any) => seat)
                },

            },
            include: {
                order: true,
            }
        })
        if (!findSeat.length) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Cancel Seats Not Found'
            })
        }
        console.log(findSeat[0]?.order?.amount, data.amount);
        // if (data.amount !== findSeat[0]?.order?.amount) {
        //     return res.status(400).send({
        //         success: false,
        //         statusCode: 400,
        //         message: 'Amount Not Match'
        //     })
        // }







        const findCoach = await prisma.coachConfig.findUnique({
            where: {
                id: coachConfigId
            },
            include: {
                coach: {
                    include: {
                        route: {
                            include: {
                                Segment: {
                                    include: {
                                        SegmentFare: true,
                                    }
                                },
                            }
                        }
                    }
                }
            }
        })

        if (!findCoach) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Coach Not Found'
            })
        }




        const transaction = await prisma.$transaction(async (prisma) => {

            const findCoachSeat = seats.filter((seat: any) => seat.coachConfigId === coachConfigId)

            const findSegment = findCoach.coach.route.Segment[0].SegmentFare.find((segment: SegmentFare) => fromStationId === segment.fromStationId && destinationStationId === segment.toStationId)
            let amount = 0;
            if (findSegment) {
                if (findCoach.coach.coachClass === "E_Class") {
                    amount += (0 * (seats.length || 0) - findCoach.discount * (seats.length || 0))
                } else if (findCoach.coach.coachClass === "B_Class") {
                    amount += (0 * (seats.length || 0) - findCoach.discount * (seats.length || 0))
                } else if (findCoach.coach.coachClass === "S_Class") {
                    for (const seat of seats) {
                        if (seat[0] === 'L') {

                            amount += 0 - findCoach.discount
                        } else {
                            amount += 0 - findCoach.discount

                        }
                    }
                } else {
                    amount += (0 * (seats.length || 0) - findCoach.discount * (seats.length || 0))
                }
            }


            if (data.counterId && data.paymentType == "PARTIAL" && !data.paymentAmount) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: 'Payment Amount is required for PARTIAL payment'
                })
            }
            let findOrder;
            data.ticketNo = await generateTicketNo();

            const result = await prisma.order.create({
                data: {
                    ...data,
                    counterId: data.counterId,
                    userId: data.userId,
                    coachConfigId,
                }
            })
            if (result) {

                await prisma.orderSeat.createMany({
                    data: seats.map((seat: any) => ({
                        segmentId: findSegment!.id,
                        isSeatShare: findCoach.coach.route.from === seat.fromStationId && findCoach.coach.route.to === seat.destinationStationId ? false : true,
                        fromStationId: seat.fromStationId,
                        destinationStationId: seat.destinationStationId,
                        coachConfigId: coachConfigId,
                        date: seat.date,
                        seat: seat.seat,
                        orderId: result.id,
                        status: "Success",
                        unitPrice: data.amount / findCoachSeat.length,
                        discount: findCoach.discount || 0,
                        paymentMethod: result.paymentMethod,
                        online: false,
                        fare: seat?.fare
                    }))
                })
                await prisma.coachConfig.update({
                    where: {
                        id: coachConfigId
                    },
                    data: {
                        seatAvailable: {
                            decrement: seats.length
                        }
                    }
                })


                await prisma.bookingSeat.deleteMany({
                    where: {
                        coachConfigId: coachConfigId,
                        seat: {
                            in: seats.map((seat: any) => seat.seat)
                        },
                    }
                })
            }
            findOrder = await prisma.order.findUnique({
                where: {
                    id: result.id,
                },
                include: {
                    orderSeat: {
                        include: {
                            coachConfig: true,
                        }
                    }
                }
            })

            if (cancelSeats.length === findOrder?.orderSeat.length) {
                for (let i = 0; i < cancelSeats.length; i++) {
                    await prisma.orderSeat.update({
                        where: {
                            id: cancelSeats[i]
                        },
                        data: {
                            cancelBy: userId,
                            cancelDate: new Date(),
                            status: "Migrate",
                            migrateSeatId: findOrder?.orderSeat[i].id
                        }
                    })
                }
            }

            return {
                success: true,
                statusCode: 200,
                message: 'Order Migrate Success',
                data: findOrder
            }

        },
            {
                maxWait: 500000,
                timeout: 1000000,
            }
        )
        res.status(200).send(transaction)








        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Order Migrate Success',
        })
    }
    catch (err) {
        next(err)
    }
}
export const userCancelRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        const { seats } = req.body;
        const result = await prisma.orderSeat.updateMany({
            where: {
                id: {
                    in: seats.map((seat: any) => seat)
                }
            },
            data: {
                cancelDate: new Date(),
                status: "CancelRequest"
            }
        })


        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Order Cancel Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}
export const duePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        const findOrder = await prisma.order.findUnique({
            where: {
                id
            }
        })
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Order Not Found'
            })
        }


        const result = await prisma.order.update({
            where: {
                id,
            },
            data: {
                dueAmount: {
                    decrement: findOrder.dueAmount,
                },
                paymentAmount: {
                    increment: findOrder.dueAmount
                },
                payment: true,
                status: "Success"
            }
        })
        await prisma.orderSeat.updateMany({
            where: {
                orderId: id
            },
            data: {
                status: "Success"
            }
        })


        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Order Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getTodaySalesCounter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fromDate = req.query.fromDate || new Date();
        const toDate = req.query.toDate || new Date();
        const { id, counterId } = req.user;
        const startDate = new Date(fromDate.toString());
        const endDate = new Date(toDate.toString());
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        console.log({ startDate, endDate });


        const totalSales = await prisma.orderSeat.aggregate({
            _sum: {
                unitPrice: true,
            },
            where: {
                AND: [
                    { createdAt: { gte: startDate } },
                    { createdAt: { lte: endDate } }
                ],
                order: {
                    counterId
                },
                status: "Success",
            },
        });

        const totalOnlineSalesAmount = await prisma.orderSeat.aggregate({
            _sum: {
                unitPrice: true,
            },
            where: {

                AND: [
                    { createdAt: { gte: startDate } },
                    { createdAt: { lte: endDate } }
                ],
                order: {
                    counterId
                },
                status: "Success",
                online: true,
            },
        });
        const onlineHistory = await prisma.orderSeat.findMany({
            where: {
                AND: [
                    { createdAt: { gte: startDate } },
                    { createdAt: { lte: endDate } }
                ],
                order: {
                    counterId
                },
                status: "Success",
                online: true,
            },
            include: {
                order: {
                    select: {
                        smsSend: true,
                        paymentMethod: true,
                        customerName: true,
                        phone: true,
                    }
                },
                cancelByUser: {
                    select: {
                        userName: true,
                    }
                },
                coachConfig: {
                    select: {
                        coachNo: true,
                        coach: {
                            select: {
                                route: true,
                            }
                        },
                        createdAt: true,
                        departureDate: true,

                    }
                }

            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const onlineHistoryCancel = await prisma.orderSeat.findMany({
            where: {
                AND: [
                    { cancelDate: { gte: startDate } },
                    { cancelDate: { lte: endDate } }
                ],
                order: {
                    counterId
                },
                status: "Cancelled",
                online: true,
            },
            include: {
                order: {
                    select: {
                        smsSend: true,
                        paymentMethod: true,
                        customerName: true,
                        phone: true,
                    }
                },
                cancelByUser: {
                    select: {
                        userName: true,
                    }
                },
                coachConfig: {
                    select: {
                        coachNo: true,
                        coach: {
                            select: {
                                route: true,
                            }
                        },
                        createdAt: true,
                        departureDate: true,

                    }
                }

            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const todaySalesHistory = await prisma.orderSeat.findMany({
            where: {
                AND: [
                    { createdAt: { gte: startDate } },
                    { createdAt: { lte: endDate } }
                ],
                order: {
                    counterId
                },
                status: "Success",
            },
            include: {
                order: {
                    select: {
                        smsSend: true,
                        paymentMethod: true,
                        customerName: true,
                        phone: true,
                    }
                },
                cancelByUser: {
                    select: {
                        userName: true,
                    }
                },
                coachConfig: {
                    select: {
                        coachNo: true,
                        coach: {
                            select: {
                                route: true,
                            }
                        },
                        createdAt: true,
                        departureDate: true,

                    }
                }

            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const cancelHistory = await prisma.orderSeat.findMany({
            where: {
                AND: [
                    { cancelDate: { gte: startDate } },
                    { cancelDate: { lte: endDate } }
                ],
                order: {
                    counterId
                },
                status: "Cancelled",
            },
            include: {
                order: {
                    select: {
                        smsSend: true,
                        paymentMethod: true,
                        customerName: true,
                        phone: true,
                    }
                },
                cancelByUser: {
                    select: {
                        userName: true,
                    }
                },
                coachConfig: {
                    select: {
                        coachNo: true,
                        coach: {
                            select: {
                                route: true,
                            }
                        },
                        createdAt: true,
                        departureDate: true,

                    }
                }

            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        let onlineTicketCount = onlineHistory.length;
        let totalTicketCount = todaySalesHistory.length;
        let cancelTicketCount = cancelHistory.length;

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Get Today Sales Successfully",
            data: {
                todaySales: totalSales._sum.unitPrice || 0,
                todayOnlineSales: totalOnlineSalesAmount._sum.unitPrice || 0,
                todayOnlineTicketCount: onlineTicketCount,
                todayTotalTicketCount: totalTicketCount,
                todayCancelTicketCount: cancelTicketCount,
                todaySalesHistory: todaySalesHistory,
                cancelHistory: cancelHistory,
                onlineHistory: onlineHistory,
                onlineHistoryCancel: onlineHistoryCancel,
            },
        })

    } catch (err) {
        next(err);
    }
}
export const getTodayOrderCancelRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fromDate = req.query.fromDate || new Date();
        const toDate = req.query.toDate || new Date();

        const startDate = new Date(fromDate.toString());
        const endDate = new Date(toDate.toString());
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        const { id } = req.user;
        const cancelRequest = await prisma.orderSeat.findMany({
            where: {
                AND: [{ cancelDate: { gte: startDate } }, { cancelDate: { lte: endDate } }],
                status: "CancelRequest",
            },
            include: {
                order: {
                    select: {
                        customerName: true,
                        phone: true,
                        dueAmount: true,
                    }
                },
                cancelByUser: {
                    select: {
                        userName: true,
                    }
                },
                coachConfig: {
                    select: {
                        coachNo: true,
                        coach: {
                            select: {
                                route: true,
                            }
                        },
                        createdAt: true,
                        departureDate: true,

                    }
                }

            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Get Today Sales Successfully",
            data: cancelRequest,
        })

    } catch (err) {
        next(err);
    }
}


export const cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, counterId } = req.user;
        const { seats } = req.body;
        for (const seat of seats) {
            await prisma.counterBookedSeat.deleteMany({
                where: {
                    counterId: counterId,
                    userId: id,
                    seat: seat.seat,
                    coachConfigId: seat.coachConfigId,
                    date: seat.date
                }
            })
            await prisma.bookingSeat.deleteMany({
                where: {
                    seat: seat.seat,
                    coachConfigId: seat.coachConfigId,

                }
            })
        }

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Booking Cancelled Successfully",
        })

    }
    catch (err) {
        next(err);
    }
}


export const findCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const phoneNumber = req.query.phoneNumber;
        const findOrder = await prisma.order.findFirst({
            where: {
                phone: phoneNumber as string
            }
        })
        let customer = null;
        if (findOrder) {
            customer = {
                name: findOrder.customerName,
                phone: findOrder.phone,
                gender: findOrder.gender,
                boardingPoint: findOrder.boardingPoint,
                droppingPoint: findOrder.droppingPoint,
                address: findOrder.address,
                email: findOrder.email,
                nid: findOrder.nid,
                nationality: findOrder.nationality,
            }
        }
        res.status(200).send({
            status: true,
            statusCode: 200,
            message: "Customer Found Successfully",
            data: customer,
        })
    }
    catch (err) {
        next(err);
    }
}


