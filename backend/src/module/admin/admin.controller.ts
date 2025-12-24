import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import moment from "moment-timezone";
import { format, parseISO } from "date-fns";
import { BookingClass, CounterType, Status } from "@prisma/client";
import bcrypt from "bcrypt";

export const getTodaySales = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fromDate = req.query.fromDate || new Date();
        const toDate = req.query.toDate || new Date();

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
                                schedule: true,
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
                                schedule: true,
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
                                schedule: true,
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
                                schedule: true,
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
        const migrateHistory = await prisma.orderSeat.findMany({
            where: {
                AND: [
                    { cancelDate: { gte: startDate } },
                    { cancelDate: { lte: endDate } }
                ],
                status: "Migrate",
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
                                schedule: true,
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
                todayMigrateHistory: migrateHistory,
                cancelHistory: cancelHistory,
                onlineHistory: onlineHistory,
                onlineHistoryCancel: onlineHistoryCancel,
            },
        })

    } catch (err) {
        next(err);
    }
}

export const userWiseSalesReport = async (req: Request, res: Response, next: NextFunction) => {
    const { counterId, userId, fromDate, toDate, dateType, orderStatus, busType } = req.query;
    const isPurchaseDate = dateType === "Purchase";
    if (!counterId || !userId || !fromDate || !toDate || !dateType || !orderStatus || !busType) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }

    try {
        const startDate = new Date(fromDate.toString());
        const endDate = new Date(toDate.toString());
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        const report = await prisma.orderSeat.findMany({
            where: {
                AND: isPurchaseDate
                    ? [
                        { createdAt: { gte: startDate } },
                        { createdAt: { lte: endDate } }
                    ]
                    : [
                        { date: { gte: fromDate.toString() } },
                        { date: { lte: toDate.toString() } }
                    ],
                order: {
                    counterId: Number(counterId),
                    userId: Number(userId),
                },
                status: {
                    in: orderStatus === "All" ? ["Success", "Cancelled",] : [orderStatus as Status]
                },
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


        res.status(200).json({
            success: true,
            data: report
        });
    } catch (err) {
        next(err);
    }
}
export const userWiseSalesSummery = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, fromDate, toDate, dateType, } = req.query;
    const isPurchaseDate = dateType === "Purchase";
    if (!userId || !fromDate || !toDate || !dateType) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }

    try {
        const startDate = new Date(fromDate.toString());
        const endDate = new Date(toDate.toString());
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);



        const data = await prisma.coachConfig.findMany({
            where: {
                AND: isPurchaseDate
                    ? [
                        {orderSeat:{some:{createdAt: { gte: startDate } }}},
                        {orderSeat:{some:{createdAt: { lte: endDate } }}},
                        
                    ]
                    : [
                        { departureDate: { gte: fromDate.toString() } },
                        { departureDate: { lte: toDate.toString() } }
                    ],
            },
            select: {
                coachNo: true,
                coach: {
                    select: {
                        route: {
                            select: {
                                routeName: true,
                                viaRoute: true,
                            }
                        }
                    }
                },
                departureDate: true,
                orderSeat: {
                    where: {
                        status: 'Success',
                        order: {
                            userId: Number(userId)
                        }
                    },
                    select: {
                        fare: true,
                        unitPrice: true,
                        online: true,
                    },
                },
            },
        });

        let reports = [];
        for (const coach of data) {
            const totalSold = coach.orderSeat.length;
            if (totalSold === 0) continue;
            const soldFare = coach.orderSeat.reduce((sum, seat) => sum + (seat.fare ?? 0), 0);

            reports.push({
                travelDate: coach.departureDate,
                coachNo: coach.coachNo,
                schedule: coach?.coach?.route?.viaRoute[0]?.schedule,
                route: coach.coach.route.routeName,
                soldSeatQty: totalSold,
                fare: soldFare,
            });
        }



        res.status(200).json({
            success: true,
            data: reports
        });
    } catch (err) {
        next(err);
    }
}

export const userWiseSalesByCounterReport = async (req: Request, res: Response, next: NextFunction) => {
    const { counterId, fromDate, toDate, orderStatus, dateType } = req.query;
    const isPurchaseDate = dateType === "Purchase";
    if (!counterId || !fromDate || !toDate || !dateType || !orderStatus) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }

    try {
        const findUsers = await prisma.user.findMany({
            where: {

                counterId: Number(counterId),
            },
            select: {
                id: true,
                userName: true,
                counter: {
                    select: {
                        name: true,
                    }
                }
            }
        })
        const startDate = new Date(fromDate.toString());
        const endDate = new Date(toDate.toString());
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        const data = await prisma.orderSeat.findMany({
            where: {
                AND: isPurchaseDate
                    ? [
                        { createdAt: { gte: startDate } },
                        { createdAt: { lte: endDate } }
                    ]
                    : [
                        { date: { gte: fromDate.toString() } },
                        { date: { lte: toDate.toString() } }
                    ],
                order: {
                    counterId: Number(counterId),
                    userId: {
                        in: findUsers.map(user => user.id)
                    }
                },
                status: {
                    in: orderStatus === "All" ? ["Success", "Cancelled",] : [orderStatus as Status]
                },

            },
            include: {
                order: {
                    select: {
                        userId: true,
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
                                coachType: true,
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


        let reports: any[] = [];
        for (const user of findUsers) {
            let nonAc = data.filter(order => order.coachConfig.coach.coachType === "NON AC" && order.order.userId === user.id).length;
            let ac = data.filter(order => order.coachConfig.coach.coachType === "AC" && order.order.userId === user.id).length;
            let totalSold = data.filter(order => order.order.userId === user.id).length;
            let totalCancel = data.filter(order => order.status === "Cancelled" && order.order.userId === user.id).length;
            let actualSold = totalSold - totalCancel;
            let totalFare = data.filter(order => order.order.userId === user.id).reduce((sum, seat) => sum + (seat.fare ?? 0), 0);
            let refundAmount = data.filter(order => order.order.userId === user.id).reduce((sum, seat) => sum + (seat.refundAmount ?? 0), 0);
            let totalCommission = 0;
            let deposit = totalFare - refundAmount;
            reports.push({
                userName: user.userName,
                counter: user.counter.name,
                nonAc,
                ac,
                totalSold,
                totalCancel,
                actualSold,
                totalFare,
                refundAmount,
                totalCommission,
                deposit
            })
        }

        res.status(200).json({
            success: true,
            data: reports
        });
    } catch (err) {
        next(err);
    }
}

export const coachWiseSalesReport = async (req: Request, res: Response, next: NextFunction) => {
    const { routeName, schedule, fromDate, toDate, dateType, orderStatus, coachClass } = req.query;
    const isPurchaseDate = dateType === "Purchase";
    if (!routeName || !schedule || !fromDate || !toDate || !dateType || !orderStatus || !coachClass) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }

    try {
        const startDate = new Date(fromDate.toString());
        const endDate = new Date(toDate.toString());
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        const data = await prisma.orderSeat.findMany({
            where: {
                AND: isPurchaseDate
                    ? [
                        { createdAt: { gte: startDate } },
                        { createdAt: { lte: endDate } }
                    ]
                    : [
                        { date: { gte: fromDate.toString() } },
                        { date: { lte: toDate.toString() } }
                    ],
                status: {
                    in: orderStatus === "All" ? ["Success", "Cancelled",] : [orderStatus as Status]
                },
                coachConfig: {

                    coach: {
                        // coachClass: coachClass as BookingClass,
                        route: {
                            routeName: routeName as string,
                        },
                        // schedule: schedule as string,
                    }
                }
            },
            include: {
                fromStation: true,
                toStation: true,
                order: {
                    select: {
                        ticketNo: true,
                        smsSend: true,
                        paymentMethod: true,
                        customerName: true,
                        phone: true,
                        user: true,
                        date: true,
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
                                coachClass: true,
                                route: {
                                    include: {
                                        Segment: {
                                            include:{
                                                SegmentFare: true,
                                            }
                                        },
                                    }
                                },
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

        let reports: any = []

        for (const seat of data) {
            const findFare = seat.coachConfig.coach.route.Segment[0].SegmentFare.find(s => seat.fromStationId === s.fromStationId && seat.destinationStationId === s.toStationId);
            if (!findFare) {
                throw new Error("Something Went Wrong");

            }
            let ticketNo = seat.order.ticketNo;
            let issueDate = seat.createdAt;
            let travelDate = seat.order.date;
            let coachNo = seat.coachConfig.coachNo;
            let seatNo = seat.seat;
            let buyerName = seat.order.customerName;
            let buyerMobile = seat.order.phone;
            let routeName = seat.coachConfig.coach.route.routeName;
            let from = seat.fromStation.name;
            let to = seat.toStation.name;
            let discount = seat.discount;
            let fare = seat.fare - seat.discount;
            let refund = 0;
            let serviceCharge = 0;
            let orderedBy = seat.order.user?.userName;
            let cancelBy = seat.cancelByUser?.userName;
            let cancelDate = seat.cancelDate;
            let remarks = seat.status;
            reports.push({
                ticketNo,
                issueDate,
                travelDate,
                coachNo,
                seatNo,
                buyerName,
                buyerMobile,
                routeName,
                from,
                to,
                originalFare: seat.fare,
                discount,
                fare,
                refund,
                serviceCharge,
                orderedBy: orderedBy || null,
                cancelBy,
                cancelDate,
                remarks
            })
        }


        res.status(200).json({
            success: true,
            dd: data,
            data: reports
        });
    } catch (err) {
        next(err);
    }
}



export const counterWiseSalesReport = async (req: Request, res: Response) => {
    try {
        const { routeName, fromDate, toDate, dateType } = req.query;

        if (!routeName || !fromDate || !toDate || !dateType) {
            return res.status(400).json({ message: "Missing required parameters" });
        }

        const isPurchaseDate = dateType === "Purchase";

        // Fetch sold seats data based on filters
        const soldSeats = await prisma.orderSeat.findMany({
            where: {
                order: {
                    userId: {
                        not: null
                    }
                },
                status: "Success", // sold tickets only
                coachConfig: {
                    coach: {
                        route: {
                            routeName: String(routeName)
                        }
                    }
                },
                ...(isPurchaseDate
                    ? {
                        createdAt: {
                            gte: parseISO(fromDate as string),
                            lte: parseISO(toDate as string),
                        }
                    }
                    : {
                        date: {
                            gte: fromDate as string,
                            lte: toDate as string
                        }
                    })
            },
            select: {
                date: true,
                createdAt: true,
                seat: true,
                fare: true,
                order: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                userName: true,
                                counter: {
                                    select: {
                                        commission: true,
                                        commissionType: true
                                    }
                                }
                            }
                        }
                    }
                },
                coachConfig: {
                    select: {
                        coach: {
                            select: {
                                coachNo: true,
                                schedule: true
                            }
                        }
                    }
                }
            }
        });

        if (!soldSeats.length) {
            return res.status(200).json({ message: "No data found", report: [] });
        }

        // Prepare report grouped by date → then user → then order details
        const reportMap = new Map<string, any>();

        for (const seat of soldSeats) {
            // Convert time to Asia/Dhaka timezone
            const reportDate = isPurchaseDate
                ? moment(seat.createdAt).tz("Asia/Dhaka").format("YYYY-MM-DD")
                : seat.date;

            if (!reportMap.has(reportDate)) {
                reportMap.set(reportDate, {
                    date: reportDate,
                    totalSoldSeat: 0,
                    totalFare: 0,
                    commissionFee: 0,
                    user: []
                });
            }

            const currentReport = reportMap.get(reportDate);

            // Calculate commission
            let commissionFee = 0;
            if (seat.order?.user?.counter) {
                if (seat.order.user.counter.commissionType === "Fixed") {
                    commissionFee = seat.order.user.counter.commission;
                } else {
                    commissionFee = (seat.fare * seat.order.user.counter.commission) / 100;
                }
            }

            // Update totals for this date
            currentReport.totalSoldSeat += 1;
            currentReport.totalFare += seat.fare;
            currentReport.commissionFee += commissionFee;

            // Find existing user or add a new one
            const userIndex = currentReport.user.findIndex(
                (u: any) => u.userName === seat.order?.user?.userName
            );

            if (userIndex === -1) {
                currentReport.user.push({
                    userName: seat.order?.user?.userName || "Unknown",
                    totalSoldSeat: 1,
                    totalFare: seat.fare,
                    orderDetails: [
                        {
                            date: seat.date,
                            coachNo: seat.coachConfig.coach.coachNo,
                            schedule: seat.coachConfig.coach.schedule,
                            seatNo: [seat.seat],
                            totalSoldSeat: 1,
                            totalFare: seat.fare
                        }
                    ]
                });
            } else {
                const userData = currentReport.user[userIndex];
                userData.totalSoldSeat += 1;
                userData.totalFare += seat.fare;

                // Check if there's already an order for the same coach & schedule
                const existingOrder = userData.orderDetails.find(
                    (od: any) =>
                        od.coachNo === seat.coachConfig.coach.coachNo &&
                        od.schedule === seat.coachConfig.coach.schedule &&
                        od.date === seat.date
                );

                if (existingOrder) {
                    existingOrder.seatNo.push(seat.seat);
                    existingOrder.totalSoldSeat += 1;
                    existingOrder.totalFare += seat.fare;
                } else {
                    userData.orderDetails.push({
                        date: seat.date,
                        coachNo: seat.coachConfig.coach.coachNo,
                        schedule: seat.coachConfig.coach.schedule,
                        seatNo: [seat.seat],
                        totalSoldSeat: 1,
                        totalFare: seat.fare
                    });
                }
            }
        }

        // Convert Map to array
        const reports = Array.from(reportMap.values());

        return res.status(200).json({
            success: true,
            message: "Counter wise Report generated successfully",
            data: reports
        });

    } catch (error) {
        console.error("Error generating report:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const coachWiseSalesSummery = async (req: Request, res: Response, next: NextFunction) => {
    const { fromDate, toDate, coachClass, } = req.query;
    if (!fromDate || !toDate || !coachClass) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }

    try {
        const startDate = new Date(fromDate.toString());
        const endDate = new Date(toDate.toString());
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);



        const data = await prisma.coachConfig.findMany({
            where: {
                AND: [
                    { createdAt: { gte: startDate } },
                    { createdAt: { lte: endDate } }
                ]
            },
            select: {

                coachNo: true,
                coach: {
                    select: {
                        coachClass: true,
                        route: {
                            select: {
                                routeName: true,
                                viaRoute: true,
                            }
                        }
                    }
                },
                departureDate: true,
                orderSeat: {
                    select: {
                        order: {
                            select: {
                                counter: true,
                                counterId: true,
                            }
                        },
                        fare: true,
                        unitPrice: true,
                        online: true,
                    },
                },
            },
        });

        let reports = [];
        for (const coach of data) {
            const totalSold = coach.orderSeat.length;
            const soldFare = coach.orderSeat.reduce((sum, seat) => sum + (seat.fare ?? 0), 0);
            let seatQuantity = 0;
            if (coach.coach.coachClass === "E_Class") {
                seatQuantity = 41
            } else if (coach.coach.coachClass === "B_Class") {
                seatQuantity = 28
            } else if (coach.coach.coachClass === "S_Class") {
                seatQuantity = 43
            } else if (coach.coach.coachClass === "Sleeper") {
                seatQuantity = 30
            }
            let seatRemainingUnsold = seatQuantity - totalSold;
            let counterSale: any = [];
            for (const seat of coach.orderSeat) {
                if (seat.order.counterId) {
                    const findCounter = counterSale.find((c: any) => c.counterId && seat.order.counterId);
                    if (!findCounter) {
                        counterSale.push({
                            counterId: seat.order.counterId,
                            counterName: seat.order.counter?.name,
                            quantity: 1
                        })
                    } else {
                        findCounter.quantity++;
                    }
                }
            }
            reports.push({
                travelDate: coach.departureDate,
                coachNo: coach.coachNo,
                route: coach.coach.route.routeName,
                counterSale,
                soldSeatQty: totalSold,
                seatQuantity,
                seatRemainingUnsold,
            });
        }


        res.status(200).json({
            success: true,
            data: reports
        });
    } catch (err) {
        next(err);
    }
}

export const duePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { registrationNo, fuelCompanyId, amount, payments } = req.body;
        const { id } = req.user;
        const date = moment().tz('Asia/Dhaka').format('YYYY-MM-DD');
        const findDue = await prisma.dueTable.findFirst({
            where: {
                registrationNo,
                fuelCompanyId,
            }
        })
        if (!findDue) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'No due payment found'
            });
        }
        const updateDue = await prisma.dueTable.update({
            where: {
                id: findDue.id,
            },
            data: {
                due: {
                    decrement: amount
                }
            }
        })
        await prisma.fuelPayment.create({
            data: {
                registrationNo,
                fuelCompanyId,
                paidAmount: amount,
                currentDueAmount: updateDue.due,
                date,
                userId: id,
            }
        })
        for (const pay of payments) {
            await prisma.paymentAccounts.create({
                data: {
                    userId: id,
                    accountId: pay.accountId,
                    paymentAmount: pay.paymentAmount,
                    paymentType: "Fuel",
                    paymentInOut: "OUT",
                }
            })
        }

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Payment successful'
        });
    }
    catch (err) {
        next(err);
    }
}


export const currentDueVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { registrationNo, fuelCompanyId, } = req.query;
        if (!registrationNo || !fuelCompanyId) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Missing required parameters'
            });
        }
        const findDue = await prisma.dueTable.findFirst({
            where: {
                registrationNo: registrationNo as string,
                fuelCompanyId: Number(fuelCompanyId),
            }
        })
        if (!findDue) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'No due payment found'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Current Due',
            data: findDue
        });
    }
    catch (err) {
        next(err);
    }
}
export const tripReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fromDate = req.query.fromDate || new Date();
        const toDate = req.query.toDate || new Date();
        const registrationNo = req.query.registrationNo;

        const startDate = new Date(fromDate.toString());
        const endDate = new Date(toDate.toString());
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);


        const result = await prisma.trip.findMany({
            where: {
                AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }],
                registrationNo: registrationNo as string,
                // tripStatus: "Close",
                // downDate: {
                //     not: null
                // }
            },
        })
        const data: any[] = [];
        for (const t of result) {
            if (t.coachConfigIdDownWay) {
                const upWayPassenger = await prisma.collection.aggregate({
                    _sum: {
                        noOfPassenger: true,
                        amount: true,
                    },
                    where: {
                        coachConfigId: t.coachConfigIdUpWay
                    }
                })
                const downWayPassenger = await prisma.collection.aggregate({
                    _sum: {
                        noOfPassenger: true,
                    },
                    where: {
                        coachConfigId: t.coachConfigIdDownWay
                    }
                })
                const newReport = {
                    date: t.upDate,
                    passengerUpWay: (upWayPassenger._sum.noOfPassenger || 0),
                    passengerDownWay: (downWayPassenger._sum.noOfPassenger || 0),
                    totalPassenger: (downWayPassenger._sum.noOfPassenger || 0) + (upWayPassenger._sum.noOfPassenger || 0),
                    upWayIncome: (upWayPassenger._sum.amount || 0),
                    downWayIncome: (upWayPassenger._sum.amount || 0),
                    ...t,

                }
                data.push(newReport)
            }
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Trip Report Get Successfully',
            data: data
        });
    }
    catch (err) {
        next(err);
    }
}
export const tripNumberWiseReport = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const tripNumber = Number(req.query.tripNumber);
        const findTripNumber = await prisma.trip.findUnique({
            where: {
                id: tripNumber
            },
            include: {
                coachConfig: {
                    select: {
                        supervisorId: true,
                    }
                }
            }
        })

        if (!findTripNumber) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Trip Number Not found"
            })
        }


        const upWayDate = findTripNumber.upDate as string;
        const downWayDate = findTripNumber.downDate as string;
        const supervisor = Number(findTripNumber.coachConfig.supervisorId);
        const findUpWayCoach = await prisma.coachConfig.findFirst({
            where: {
                departureDate: upWayDate,
                supervisorId: supervisor,
            },
            include: {
                coach: {
                    include: {
                        route: {
                            select: {
                                routeName: true,
                            }
                        },
                    }
                },

                supervisor: {
                    select: {
                        userName: true,
                        contactNo: true,
                    }
                },
                driver: {
                    select: {
                        name: true,
                        contactNo: true,
                    }
                },
                helper: {
                    select: {
                        name: true,
                        contactNo: true,
                    }
                }
            }
        })
        const findDownWayCoach = await prisma.coachConfig.findFirst({
            where: {
                departureDate: downWayDate,
                supervisorId: supervisor,
            },
            include: {
                coach: {
                    include: {
                        route: {
                            select: {
                                routeName: true,
                            }
                        },
                    }
                },
                supervisor: {
                    select: {
                        userName: true,
                        contactNo: true,
                    }
                },
                driver: {
                    select: {
                        name: true,
                        contactNo: true,
                    }
                },
                helper: {
                    select: {
                        name: true,
                        contactNo: true,
                    }
                }
            }
        })
        if (!findUpWayCoach || !findDownWayCoach) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Coach Config Not found"
            })
        }
        let upWayCoachConfigId = findUpWayCoach.id;
        let downWayCoachConfigId = findDownWayCoach.id;
        let totalUpOpeningBalance = 0;
        let totalDownOpeningBalance = 0;
        let totalUpIncome = 0;
        let totalDownIncome = 0;
        let totalExpense = 0;
        let othersIncomeUpWay = 0;
        let othersIncomeDownWay = 0;
        const findOthersIncomeUpWay = await prisma.collection.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Up_Way",
                date: upWayDate,
                collectionType: "OthersIncome"
            },
            include: {
                counter: true,
            }
        })
        const findOthersIncomeDownWay = await prisma.collection.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Down_Way",
                date: upWayDate,
                collectionType: "OthersIncome"
            },
            include: {
                counter: true,
            }
        })
        console.log(upWayDate)
        const findCollectionUpWay = await prisma.collection.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Up_Way",
                date: upWayDate,
                collectionType: "CounterCollection"
            },
            include: {
                counter: true,
            }
        })
        const findCollectionDownWay = await prisma.collection.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Down_Way",
                date: downWayDate,
                collectionType: "CounterCollection"
            },
            include: {
                counter: true,
            }
        })
        const findOpeningBalanceUpWay = await prisma.collection.findFirst({
            where: {
                supervisorId: supervisor,
                routeDirection: "Up_Way",
                date: upWayDate,
                collectionType: "OpeningBalance"
            },
            include: {
                counter: true,
            }
        })
        const findOpeningBalanceDownWay = await prisma.collection.findFirst({
            where: {
                supervisorId: supervisor,
                routeDirection: "Down_Way",
                date: downWayDate,
                collectionType: "OpeningBalance"
            },
            include: {
                counter: true,
            }
        })
        const findExpenseUpWay = await prisma.expense.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Up_Way",
                date: upWayDate,
            },
            include: {
                expenseCategory: true,
            }
        })
        const findExpenseDownWay = await prisma.expense.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Down_Way",
                date: downWayDate,
            },
            include: {
                expenseCategory: true,
            }
        })
        const upWayCollectionReport = findCollectionUpWay.map(col => {
            totalUpIncome += col.amount;
            return {
                counterName: col.counter?.name,
                counterMasterName: col.counter?.primaryContactPersonName,
                noOfPassenger: col.noOfPassenger,
                // vul entry
                fare: 0,
                amount: col.amount,
                routeDirection: col.routeDirection
            }
        })
        const upWayOthersIncomeReport = findOthersIncomeUpWay.map(col => {
            othersIncomeUpWay += col.amount;
            return {
                counterName: "N/A",
                counterMasterName: "N/A",
                routeDirection: col.routeDirection,
                noOfPassenger: col.noOfPassenger,
                // vul entry
                fare: 0,
                amount: col.amount,
            }
        })
        const downWayOthersIncomeReport = findOthersIncomeDownWay.map(col => {
            othersIncomeDownWay += col.amount;
            return {
                counterName: "N/A",
                counterMasterName: "N/A",
                routeDirection: col.routeDirection,
                noOfPassenger: col.noOfPassenger,
                // vul entry
                fare: 0,
                amount: col.amount,
            }
        })
        totalUpOpeningBalance += findOpeningBalanceUpWay?.amount || 0;
        const upWayOpeningBalanceReport = {
            counterName: findOpeningBalanceUpWay?.counter?.address,
            amount: findOpeningBalanceUpWay?.amount,
            routeDirection: findOpeningBalanceUpWay?.routeDirection

        }
        totalDownOpeningBalance += findOpeningBalanceDownWay?.amount || 0;
        const downWayOpeningBalanceReport =
        {
            counterName: findOpeningBalanceDownWay?.counter?.address,
            amount: findOpeningBalanceDownWay?.amount,
            routeDirection: findOpeningBalanceDownWay?.routeDirection
        }

        const downWayCollectionReport = findCollectionDownWay.map(col => {
            totalDownIncome += col.amount;
            return {
                counterName: col.counter?.name,
                counterMasterName: col.counter?.primaryContactPersonName,
                routeDirection: col.routeDirection,
                noOfPassenger: col.noOfPassenger,
                // vul entry
                fare: 0,
                amount: col.amount,

            }
        })

        const expenseUpWayReport = findExpenseUpWay.map(ex => {
            upWayCoachConfigId = ex.coachConfigId;
            totalExpense += ex.amount;
            return {
                expenseCategory: ex.expenseCategory?.name,
                amount: ex.amount,
                routeDirection: ex.routeDirection
            }
        })
        const expenseDownWayReport = findExpenseDownWay.map(ex => {
            downWayCoachConfigId = ex.coachConfigId;
            totalExpense += ex.amount;
            return {
                expenseCategory: ex.expenseCategory?.name,
                amount: ex.amount,
                routeDirection: ex.routeDirection
            }
        })


        console.log(upWayCoachConfigId, downWayCoachConfigId)
        res.status(200).send({
            success: true,
            message: "Supervisor reported success!",
            statusCode: 200,
            data: {
                upWayCoachInfo: findUpWayCoach,
                downWayCoachInfo: findDownWayCoach,
                totalIncome: totalDownIncome + totalUpIncome,
                // upWayCoachConfigId: upWayCoachConfigId,
                // downWayCoachConfigId: downWayCoachConfigId,
                // upWayTripNo: findUpWayCoach.tripNo,
                // downWayTripNo: findDownWayCoach.tripNo,
                totalAmount: (totalDownIncome + totalUpIncome) - totalExpense,
                totalUpIncome,
                gp: findTripNumber.gp,
                totalDownIncome,
                totalExpense,
                totalUpOpeningBalance,
                totalDownOpeningBalance,
                othersIncomeUpWay,
                othersIncomeDownWay,
                collectionReport: [...upWayCollectionReport, ...downWayCollectionReport, ...upWayOthersIncomeReport, ...downWayOthersIncomeReport],
                expenseReport: [...expenseUpWayReport, ...expenseDownWayReport]
            }
        })
    }
    catch (err) {
        next(err);
    }
}
export const getTripNumber = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fromDate = req.query.fromDate || new Date();
        const toDate = req.query.toDate || new Date();

        const startDate = new Date(fromDate.toString());
        const endDate = new Date(toDate.toString());
        startDate.setHours(0, 0, 0, 0);
        startDate.setMonth(startDate.getMonth() - 1);
        endDate.setHours(23, 59, 59, 999);


        const result = await prisma.trip.findMany({
            where: {
                AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }],
            },
            select: {
                id: true
            }
        })

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Trip Number Get Successfully',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
}


export const getAggregationAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fromDate = req.query.fromDate || new Date();
        const toDate = req.query.toDate || new Date();

        const startDate = new Date(fromDate.toString());
        const endDate = new Date(toDate.toString());

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        const receivedAmount = await prisma.paymentAccounts.aggregate({
            _sum: {
                paymentAmount: true,
            },
            where: {
                paymentInOut: "IN",
                AND: [
                    { createdAt: { gte: startDate } },
                    { createdAt: { lte: endDate } }
                ]

            },
        });
        const paymentAmount = await prisma.paymentAccounts.aggregate({
            _sum: {
                paymentAmount: true,
            },
            where: {
                paymentType: "Fuel",
                paymentInOut: "OUT",
                AND: [
                    { createdAt: { gte: startDate } },
                    { createdAt: { lte: endDate } }
                ]

            },
        });
        const expenseAmount = await prisma.paymentAccounts.aggregate({
            _sum: {
                paymentAmount: true,
            },
            where: {
                paymentType: "Expense",
                paymentInOut: "IN",
                AND: [
                    { createdAt: { gte: startDate } },
                    { createdAt: { lte: endDate } }
                ]

            },
        });
        return res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Aggregation Accounts Get Successfully',
            data: {
                receivedAmount: (receivedAmount._sum.paymentAmount || 0),
                paymentAmount: (paymentAmount._sum.paymentAmount || 0),
                expenseAmount: (expenseAmount._sum.paymentAmount || 0),
                cashOnHand: ((receivedAmount._sum.paymentAmount || 0) - (paymentAmount._sum.paymentAmount || 0)) - (expenseAmount._sum.paymentAmount || 0)
            }
        })
    }
    catch (err) {
        next(err);
    }
}


export const userChangePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { id } = req.params;
        const { newPassword } = req.body;
        const findUser = await prisma.user.findUnique({ where: { id: Number(id) } })
        if (!findUser) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "User Not Found"
            })
        }


        await prisma.user.update({
            where: {
                id: Number(id)
            },
            data: {
                password: await bcrypt.hash(newPassword, 10)
            }
        })


        res.status(201).send({
            success: true,
            statusCode: 200,
            message: "Password Change Successfully",
        })
    }
    catch (err) {
        next(err)
    }
}