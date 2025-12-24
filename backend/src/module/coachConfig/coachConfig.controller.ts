import { viaRoute } from './../../../node_modules/.prisma/client/index.d';
import { counterReportSubmit } from './../user/user.controller';
import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client";
import { deleteOldBookings } from "../order/order.controller";
import { addHours, parse, format } from 'date-fns';
import moment from "moment-timezone";


// async function deleteCounterBookedSeatsLessThan2Hours(coachConfigId: number) {
//     try {
//         const coachConfig = await prisma.coachConfig.findUnique({
//             where: { id: coachConfigId },
//             select: {
//                 departureDate: true,
//             },
//         });

//         if (!coachConfig) {
//             console.log("CoachConfig not found");
//             return;
//         }

//         // Parse CoachConfig departureDate and schedule
//         const departureDateTime = parse(
//             `${coachConfig.departureDate} ${coachConfig.schedule}`,
//             'yyyy-MM-dd hh:mm a',
//             new Date()
//         );

//         // Calculate the threshold time, 2 hours before departure
//         const thresholdTime = addHours(departureDateTime, -2);

//         // Convert thresholdTime to a string in "hh:mm a" format
//         const thresholdTimeString = format(thresholdTime, 'hh:mm a');

//         // Delete CounterBookedSeat records within 2 hours of CoachConfig departure
//         const deletedSeats = await prisma.counterBookedSeat.deleteMany({
//             where: {
//                 coachConfigId,
//                 AND: [
//                     {
//                         date: coachConfig.departureDate,
//                     },
//                     {
//                         schedule: {
//                             lte: coachConfig.schedule,
//                         },
//                     },
//                     {
//                         schedule: {
//                             gte: thresholdTimeString,
//                         },
//                     },
//                 ],
//             },
//         });

//         console.log(`Deleted ${deletedSeats.count} CounterBookedSeat records`);
//     } catch (error) {
//         console.error("Error deleting CounterBookedSeats:", error);
//     } finally {
//         await prisma.$disconnect();
//     }
// }


// deleteCounterBookedSeatsLessThan2Hours(1);



export const createCoachConfig = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const { permission } = req.user;
        // if (!permission || !permission?.coachActiveInActive) {
        //     return res.status(400).send({
        //         success: false,
        //         statusCode: 400,
        //         message: 'You have no permission to create Coach Config'
        //     })
        // }
        const { departureDates, ...data } = req.body;
        const findCoach = await prisma.coach.findUnique({
            where: {
                coachNo: data.coachNo
            },
            include: {
                seatPlan: true,
            }
        })
        if (!findCoach) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Coach Not Found'
            })
        }
        let dataArray = [];

        for (const departureDate of departureDates) {
            const newData = {
                ...data,
                seatAvailable: findCoach.seatPlan.noOfSeat,
                departureDate,
            };
            const findCoachConfig = await prisma.coachConfig.findFirst({
                where: {
                    coachNo: data.coachNo,
                    departureDate,
                }
            })
            if (!findCoachConfig) {
                dataArray.push(newData);
            } else {
                console.log(findCoachConfig.active, data.active)
                if (findCoachConfig.active !== data.active) {
                    const update = await prisma.coachConfig.update({
                        where: {
                            id: findCoachConfig.id
                        },
                        data: {
                            active: data.active
                        }
                    })
                    console.log(update)
                }
            }
        }

        const result = await prisma.coachConfig.createMany({
            data: dataArray,
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Coach Config Created Success',
        })
    }
    catch (err) {
        next(err)
    }
}


export const getCoachConfigAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { coach, route, active, date, page, size, sortOrder, search } = req.query;
        if (!date) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Please Select Date',
            })
        }
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 50;
        const whereCondition: Prisma.CoachWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { coachNo: { contains: search as string, } },
                ],
            });
        }
        if (coach) {
            whereCondition.push({
                coachNo: { contains: search as string, },
            });
        }
        if (route) {
            whereCondition.push({

                route: {
                    routeName: route as string
                }

            });
        }
        if (active) {
            whereCondition.push({
                active: active === "true" ? true : false,
            });
        }
        const result = await prisma.coach.findMany({
            where: {
                AND: whereCondition,
            },
            select: {

                coachNo: true,
                schedule: true,

                fromCounter: {
                    select: {
                        name: true,
                    }
                },
                route: {
                    select: {
                        routeName: true,
                    }
                },
                coachType: true,
                destinationCounter: {
                    select: {
                        name: true,
                    }
                },

            },
            skip: skip * take,
            take,
            orderBy: {
                createdAt: 'desc'
            }
        })
        const findCoachConfig = await prisma.coachConfig.findMany({
            where: {
                departureDate: date as string,
                coachNo: {
                    in: result.map((coach: any) => coach.coachNo)
                },
            },
        })

        let finalData = result.map((coach: any) => {
            const findCoachConfigData = findCoachConfig.find((config: any) => config.coachNo === coach.coachNo)
            return {
                ...coach,
                active: findCoachConfigData?.active || false
            }
        })
        // const total = await prisma.coachConfig.count({
        //     where: {
        //         departureDate: date as string,
        //         AND: whereCondition,
        //     },
        // })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Coach Config retrieved Success',
            // meta: {
            //     page: skip,
            //     size: take,
            //     total,
            //     totalPage: Math.ceil(total / take)
            // },
            data: finalData
        })
    }
    catch (err) {
        next(err)
    }
}
export const getCoachConfigUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.CoachConfigWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { coachNo: { contains: search as string, } },
                    { registrationNo: { contains: search as string, } },
                ],
            });
        }
        const result = await prisma.coachConfig.findMany({
            where: {
                AND: whereCondition,
                supervisorId: {
                    not: null,
                }
            },
            include: {
                coach: {
                    include: {
                        route: {
                            include: {
                                fromStation: true,
                                toStation: true,
                                Segment: true,
                            }
                        },
                    }
                }

            },
            skip: skip * take,
            take,

        })
        const total = await prisma.coachConfig.count({
            where: {
                AND: whereCondition,
                supervisorId: {
                    not: null,
                }
            },
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Coach Config Update retrieved Success',
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


// station position বের করা
const getStationPos = (stationId: number, viaRoute: any) => {
    const found = viaRoute.find((v: any) => v.stationId === stationId);
    return found ? found.id : null;
};

// helper for normalization
const normalize = (a: any, b: any) => a < b ? [a, b] : [b, a];

// overlap check
export const isOverlap = (soldFrom: any, soldTo: any, searchFrom: any, searchTo: any, viaRoute: any) => {
    const [soldStart, soldEnd] = normalize(getStationPos(soldFrom, viaRoute), getStationPos(soldTo, viaRoute));
    const [searchStart, searchEnd] = normalize(getStationPos(searchFrom, viaRoute), getStationPos(searchTo, viaRoute));
    return !(soldEnd <= searchStart || soldStart >= searchEnd);
};


export const getCoachList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await deleteOldBookings();
        const { orderType, returnDate, fromStationId, destinationStationId, coachNo, schedule, date, coachType = "AC" } = req.query;
        if (orderType === "Round_Trip" && !returnDate) {
            return res.status(400).send({
                status: false,
                statusCode: 400,
                message: 'Return Date is required for Round Trip Order'
            })
        }





        let returnData: any[] = [];

        const result = await prisma.coachConfig.findMany({
            where: {
                departureDate: date as string,

                active: true,
                coach: {
                    coachType: coachType as string,
                    ...(schedule ? { schedule: schedule as string } : {}),
                    ...(coachNo ? { coachNo: coachNo as string } : {}),
                    route: {
                        Segment: {
                            some: {
                                SegmentFare: {

                                    some: {
                                        isActive: true,
                                        fromStationId: Number(fromStationId),
                                        toStationId: Number(destinationStationId)
                                    }
                                }
                            }
                        }
                    }
                },
            },
            include: {
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
                        emergencyNumber: true,
                    }
                },
                helper: {
                    select: {
                        name: true,
                        contactNo: true,
                        emergencyNumber: true,
                    }
                },
                CoachArrivedDepart: {
                    select: {
                        counter: {
                            select: {
                                id: true,
                                name: true,
                                stationId: true,
                            }
                        },
                        user: {
                            select: {
                                userName: true,
                            }
                        },
                        arrivedDate: true,
                        departDate: true,
                    },
                    orderBy: {
                        arrivedDate: "desc"
                    },
                },
                bookingSeat: {
                    select: {
                        counter: {
                            select: {
                                name: true,
                                address: true,
                                phone: true
                            }
                        },
                        seat: true,
                    }
                },
                orderSeat: {
                    where: {
                        status: {
                            in: ["Success", "Cancelled", "Migrate"]
                        }
                    },
                    select: {
                        id: true,
                        seat: true,
                        orderId: true,
                        fromStation: true,
                        toStation: true,
                        unitPrice: true,
                        fare: true,
                        status: true,
                        createdAt: true,
                        discount: true,
                        cancelByUser: {
                            select: {
                                userName: true,
                            }
                        },
                        migrateSeat: {
                            select: {
                                seat: true,
                                createdAt: true,
                                order: {
                                    select: {
                                        coachConfig: {
                                            select: {
                                                departureDate: true,
                                                coach: true,
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        order: {
                            select: {
                                counterId: true,
                                counter: {
                                    select: {
                                        commissionType: true,
                                        commission: true,
                                        name: true,
                                    }
                                },
                                user: {
                                    select: {
                                        userName: true,
                                        contactNo: true,
                                    }
                                },
                                ticketNo: true,
                                customerName: true,
                                phone: true,
                                gender: true,
                                email: true,
                            }
                        },
                        coachConfigId: true,
                    }
                },
                CounterBookedSeat: {
                    include: {
                        user: true,
                        counter: true,
                    }
                },
                coach: {
                    include: {
                        seatPlan: true,
                        CoachViaRoute: {
                            include: {
                                counter: {
                                    select: {
                                        name: true,
                                        address: true,
                                        id: true,
                                        stationId: true,
                                    }
                                }
                            }
                        },
                        route: {
                            include: {
                                fromStation: true,
                                toStation: true,
                                Segment: {
                                    include: {
                                        SegmentFare: {
                                            include: {
                                                fromStation: true,
                                                toStation: true,
                                            }
                                        }
                                    }
                                },
                                viaRoute: {
                                    include: {
                                        station: true,
                                    }
                                }
                            }
                        },
                    }
                }
            },
        })
        let bookedSeat = [];
        if (result.length) {
            const findOrderSeat = await prisma.orderSeat.findMany({
                where: {
                    status: {
                        in: ["Success", "CancelRequest", "Pending"]
                    },
                    coachConfigId: {
                        in: result.map((item) => item.id)
                    },

                },
                include: {
                    segment: {
                        include: {
                            fare: {
                                include: {
                                    route: true,
                                }
                            }
                        }
                    },
                }
            })
            if (findOrderSeat.length) {
                for (const coach of result) {


                    const viaRoute = coach.coach.route.viaRoute;


                    const seats = findOrderSeat.filter((item: any) => item.coachConfigId === coach.id);
                    let coachSeat = [];
                    for (const seat of seats) {
                        if (!seat.isSeatShare) {
                            coachSeat.push(seat.seat);
                        } else {
                            const overlap = isOverlap(seat.fromStationId, seat.destinationStationId, Number(fromStationId), Number(destinationStationId), viaRoute);

                            if (overlap) {
                                coachSeat.push(seat.seat);
                            }
                        }
                    }
                    bookedSeat.push({
                        coachConfigId: coach.id,
                        seat: coachSeat
                    })
                }
            }
        }
        if (orderType === "Round_Trip") {
            returnData = await prisma.coachConfig.findMany({
                where: {
                    departureDate: date as string,

                    active: true,
                    coach: {
                        ...(schedule ? { schedule: schedule as string } : {}),
                        ...(coachNo ? { coachNo: coachNo as string } : {}),
                        coachType: coachType as string,
                        route: {
                            Segment: {
                                some: {
                                    SegmentFare: {
                                        some: {
                                            fromStationId: Number(destinationStationId),
                                            toStationId: Number(fromStationId)
                                        }
                                    }

                                }
                            }
                        }
                    },
                },
                include: {
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
                            emergencyNumber: true,
                        }
                    },
                    helper: {
                        select: {
                            name: true,
                            contactNo: true,
                            emergencyNumber: true,
                        }
                    },

                    CoachArrivedDepart: {
                        select: {
                            counter: {
                                select: {
                                    id: true,
                                    name: true,
                                    stationId: true,
                                }
                            },
                            user: {
                                select: {
                                    userName: true,
                                }
                            },
                            arrivedDate: true,
                            departDate: true,
                        },
                        orderBy: {
                            arrivedDate: "desc"
                        },
                    },


                    bookingSeat: {
                        select: {
                            seat: true,
                        }
                    },
                    orderSeat: {
                        where: {
                            status: {
                                in: ["Success", "Cancelled", "Migrate"]
                            }
                        },
                        select: {
                            id: true,
                            seat: true,
                            orderId: true,
                            fromStation: true,
                            toStation: true,
                            unitPrice: true,
                            fare: true,
                            createdAt: true,
                            discount: true,
                            cancelByUser: {
                                select: {
                                    userName: true,
                                }
                            },
                            migrateSeat: {
                                select: {
                                    seat: true,
                                    createdAt: true,
                                    order: {
                                        select: {
                                            coachConfig: {
                                                select: {
                                                    departureDate: true,
                                                    coach: true,
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            order: {
                                select: {
                                    counterId: true,
                                    counter: {
                                        select: {
                                            commissionType: true,
                                            commission: true,
                                            name: true,
                                        }
                                    },
                                    user: {
                                        select: {
                                            userName: true,
                                            contactNo: true,
                                        }
                                    },
                                    ticketNo: true,
                                    customerName: true,
                                    phone: true,
                                    gender: true,
                                    email: true,
                                }
                            },
                            coachConfigId: true,
                        }
                    },
                    CounterBookedSeat: {
                        select: {
                            seat: true,
                            counter: true,
                            user: true,
                        }
                    },
                    coach: {

                        include: {
                            CoachViaRoute: {
                                include: {
                                    counter: {
                                        select: {
                                            name: true,
                                            address: true,
                                            id: true,
                                            stationId: true,
                                        }
                                    }
                                }
                            },
                            route: {
                                include: {
                                    fromStation: true,
                                    toStation: true,
                                    Segment: {
                                        include: {
                                            SegmentFare: {
                                                include: {
                                                    fromStation: true,
                                                    toStation: true,
                                                }
                                            }
                                        }
                                    },
                                    viaRoute: {
                                        include: {
                                            station: true,
                                        }
                                    }
                                }
                            },
                        }
                    }
                },
            })
            if (returnData.length) {
                const findOrderSeat = await prisma.orderSeat.findMany({
                    where: {
                        status: {
                            in: ["Success", "CancelRequest", "Pending"]
                        },
                        coachConfigId: {
                            in: returnData.map((item) => item.id)
                        },

                    },
                    include: {
                        segment: {
                            include: {
                                fare: {
                                    include: {
                                        route: true
                                    }
                                }
                            }
                        },
                    }
                })
                if (findOrderSeat.length) {
                    for (const coach of returnData) {
                        const seats = findOrderSeat.filter((item: any) => item.coachConfigId === coach.id);
                        let coachSeat = [];
                        for (const seat of seats) {
                            if (!seat.isSeatShare) {
                                coachSeat.push(seat.seat);
                            } else {
                                if (Number(fromStationId) === seat.fromStationId && Number(destinationStationId) === seat.destinationStationId) {
                                    coachSeat.push(seat.seat);
                                }
                                if (seat.segment.fare.route.from === Number(fromStationId) && seat.segment.fare.route.to === Number(destinationStationId)) {
                                    coachSeat.push(seat.seat);
                                }
                            }
                        }
                        bookedSeat.push({
                            coachConfigId: coach.id,
                            seat: coachSeat
                        })
                    }
                }
            }
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Coach List retrieved Success',
            data: result,
            returnData,
            bookedSeat,
            // testConfig,
        })
    }
    catch (err) {
        next(err)
    }
}
export const getCoachListCounter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await deleteOldBookings();
        const { id } = req.user;
        const findCoachAssign = await prisma.coachAssignToCounterMaster.findUnique({
            where: {
                userId: id
            },
            include: {
                SellingRoutePermission: true,
            }
        })
        if (!findCoachAssign) {
            return res.status(400).send({
                status: false,
                statusCode: 400,
                message: 'Coach Assign not found'
            })
        }
        const { orderType, coachNo, returnDate, fromStationId, destinationStationId, schedule, date, coachType = "NON AC" } = req.query;
        if (orderType === "Round_Trip" && !returnDate) {
            return res.status(400).send({
                status: false,
                statusCode: 400,
                message: 'Return Date is required for Round Trip Order'
            })
        }





        let returnData: any[] = [];

        const result = await prisma.coachConfig.findMany({
            where: {
                departureDate: date as string,

                active: true,

                coach: {
                    ...(schedule ? { schedule: schedule as string } : {}),
                    ...(coachNo ? { coachNo: coachNo as string } : {}),
                    coachType: coachType as string,
                    route: {
                        id: {
                            in: findCoachAssign.SellingRoutePermission.map((item: any) => item.routeId)
                        },
                        Segment: {
                            some: {
                                SegmentFare: {
                                    some: {
                                        isActive: true,
                                        fromStationId: Number(fromStationId),
                                        toStationId: Number(destinationStationId)
                                    }
                                }
                            }
                        }
                    }
                },
            },
            include: {
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
                        emergencyNumber: true,
                    }
                },
                helper: {
                    select: {
                        name: true,
                        contactNo: true,
                        emergencyNumber: true,
                    }
                },
                CoachArrivedDepart: {
                    select: {
                        counter: {
                            select: {
                                id: true,
                                name: true,
                                stationId: true,
                            }
                        },
                        user: {
                            select: {
                                userName: true,
                            }
                        },
                        arrivedDate: true,
                        departDate: true,
                    },
                    orderBy: {
                        arrivedDate: "desc"
                    },
                },
                bookingSeat: {
                    select: {
                        counter: {
                            select: {
                                name: true,
                                address: true,
                                phone: true
                            }
                        },
                        seat: true,
                    }
                },
                orderSeat: {
                    where: {
                        status: {
                            in: ["Success", "Cancelled", "Migrate"]
                        }
                    },
                    select: {
                        id: true,
                        seat: true,
                        orderId: true,
                        fromStation: true,
                        toStation: true,
                        unitPrice: true,
                        fare: true,
                        createdAt: true,
                        discount: true,
                        cancelByUser: {
                            select: {
                                userName: true,
                            }
                        },
                        migrateSeat: {
                            select: {
                                seat: true,
                                createdAt: true,
                                order: {
                                    select: {
                                        coachConfig: {
                                            select: {
                                                departureDate: true,
                                                coach: true,
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        order: {
                            select: {
                                counterId: true,
                                counter: {
                                    select: {
                                        commissionType: true,
                                        commission: true,
                                        name: true,
                                    }
                                },
                                user: {
                                    select: {
                                        userName: true,
                                        contactNo: true,
                                    }
                                },
                                ticketNo: true,
                                customerName: true,
                                phone: true,
                                gender: true,
                                email: true,
                            }
                        },
                        coachConfigId: true,
                    }
                },
                CounterBookedSeat: {
                    include: {
                        counter: true,
                        user: true,
                    }
                },
                coach: {

                    include: {
                        seatPlan: true,
                        route: {
                            include: {
                                fromStation: true,
                                toStation: true,
                                Segment: {
                                    include: {
                                        SegmentFare: {
                                            include: {
                                                fromStation: true,
                                                toStation: true,
                                            }
                                        }
                                    }
                                },
                                viaRoute: {
                                    include: {
                                        station: true,
                                    }
                                }
                            }
                        },
                    }
                }
            },
        })
        let bookedSeat = [];
        if (result.length) {
            const findOrderSeat = await prisma.orderSeat.findMany({
                where: {
                    status: {
                        in: ["Success", "CancelRequest", "Pending"]
                    },
                    coachConfigId: {
                        in: result.map((item: any) => item.id)
                    },

                },
                include: {
                    segment: {
                        include: {
                            fare: {
                                include: {
                                    route: true
                                }
                            }
                        }
                    },
                }
            })
            if (findOrderSeat.length) {
                for (const coach of result) {
                    const seats = findOrderSeat.filter((item: any) => item.coachConfigId === coach.id);
                    let coachSeat = [];
                    for (const seat of seats) {
                        if (!seat.isSeatShare) {
                            coachSeat.push(seat.seat);
                        } else {
                            if (Number(fromStationId) === seat.fromStationId && Number(destinationStationId) === seat.destinationStationId) {
                                coachSeat.push(seat.seat);
                            }
                            if (seat.segment.fare.route.from === Number(fromStationId) && seat.segment.fare.route.to === Number(destinationStationId)) {
                                coachSeat.push(seat.seat);
                            }
                        }
                    }
                    bookedSeat.push({
                        coachConfigId: coach.id,
                        seat: coachSeat
                    })
                }
            }
        }
        if (orderType === "Round_Trip") {
            returnData = await prisma.coachConfig.findMany({
                where: {
                    departureDate: date as string,

                    active: true,
                    coach: {
                        ...(schedule ? { schedule: schedule as string } : {}),
                        ...(coachNo ? { coachNo: coachNo as string } : {}),
                        coachType: coachType as string,
                        route: {
                            id: {
                                in: findCoachAssign.SellingRoutePermission.map((item: any) => item.routeId)
                            },
                            Segment: {
                                some: {

                                    SegmentFare: {
                                        some: {
                                            fromStationId: Number(destinationStationId),
                                            toStationId: Number(fromStationId)
                                        }
                                    }
                                }
                            }
                        }
                    },
                },
                include: {
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
                            emergencyNumber: true,
                        }
                    },
                    helper: {
                        select: {
                            name: true,
                            contactNo: true,
                            emergencyNumber: true,
                        }
                    },

                    CoachArrivedDepart: {
                        select: {
                            counter: {
                                select: {
                                    id: true,
                                    name: true,
                                    stationId: true,
                                }
                            },
                            user: {
                                select: {
                                    userName: true,
                                }
                            },
                            arrivedDate: true,
                            departDate: true,
                        },
                        orderBy: {
                            arrivedDate: "desc"
                        },
                    },


                    bookingSeat: {
                        select: {
                            seat: true,
                        }
                    },
                    orderSeat: {
                        where: {
                            status: {
                                in: ["Success", "Cancelled", "Migrate"]
                            }
                        },
                        select: {
                            id: true,
                            seat: true,
                            orderId: true,
                            fromStation: true,
                            toStation: true,
                            unitPrice: true,
                            fare: true,
                            createdAt: true,
                            discount: true,
                            cancelByUser: {
                                select: {
                                    userName: true,
                                }
                            },
                            migrateSeat: {
                                select: {
                                    seat: true,
                                    createdAt: true,
                                    order: {
                                        select: {
                                            coachConfig: {
                                                select: {
                                                    departureDate: true,
                                                    coach: true,
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            order: {
                                select: {
                                    counterId: true,
                                    counter: {
                                        select: {
                                            commissionType: true,
                                            commission: true,
                                            name: true,
                                        }
                                    },
                                    user: {
                                        select: {
                                            userName: true,
                                            contactNo: true,
                                        }
                                    },
                                    ticketNo: true,
                                    customerName: true,
                                    phone: true,
                                    gender: true,
                                    email: true,
                                }
                            },
                            coachConfigId: true,
                        }
                    },
                    CounterBookedSeat: {
                        select: {
                            seat: true,
                            counter: true,
                            user: true,
                        }
                    },
                    coach: {
                        include: {

                            route: {
                                include: {
                                    fromStation: true,
                                    toStation: true,
                                    Segment: {
                                        include: {
                                            SegmentFare: {
                                                include: {
                                                    fromStation: true,
                                                    toStation: true,
                                                }
                                            }
                                        }
                                    },
                                    viaRoute: {
                                        include: {
                                            station: true,
                                        }
                                    }
                                }
                            },
                        }
                    }
                },
            })
            if (returnData.length) {
                const findOrderSeat = await prisma.orderSeat.findMany({
                    where: {
                        status: {
                            in: ["Success", "CancelRequest", "Pending"]
                        },
                        coachConfigId: {
                            in: returnData.map((item) => item.id)
                        },

                    },
                    include: {
                        segment: {
                            include: {
                                fare: {
                                    include: {
                                        route: true
                                    }
                                }
                            }
                        },
                    }
                })
                if (findOrderSeat.length) {
                    for (const coach of returnData) {
                        const seats = findOrderSeat.filter((item: any) => item.coachConfigId === coach.id);
                        let coachSeat = [];
                        for (const seat of seats) {
                            if (!seat.isSeatShare) {
                                coachSeat.push(seat.seat);
                            } else {
                                if (Number(fromStationId) === seat.fromStationId && Number(destinationStationId) === seat.destinationStationId) {
                                    coachSeat.push(seat.seat);
                                }
                                if (seat.segment.fare.route.from === Number(fromStationId) && seat.segment.fare.route.to === Number(destinationStationId)) {
                                    coachSeat.push(seat.seat);
                                }
                            }
                        }
                        bookedSeat.push({
                            coachConfigId: coach.id,
                            seat: coachSeat
                        })
                    }
                }
            }
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Coach List retrieved Success',
            data: result,
            returnData,
            bookedSeat,
            // testConfig,
        })
    }
    catch (err) {
        next(err)
    }
}

export const coachArrivedDepart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type, coachConfigId } = req.body;
        const { id, counterId } = req.user;
        const findCoachArrived = await prisma.coachArrivedDepart.findFirst({
            where: {
                counterId: counterId,
                coachConfigId
            }
        })
        if (type === "Arrived") {

            if (findCoachArrived) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: 'This Coach Already Arrived',
                })
            } else {
                await prisma.coachArrivedDepart.create({
                    data: {
                        userId: id,
                        counterId,
                        coachConfigId
                    }
                })
            }
        } else {
            if (!findCoachArrived) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: 'This Coach Not Arrived',
                })
            } else {
                await prisma.coachArrivedDepart.update({
                    where: {
                        id: findCoachArrived.id
                    },
                    data: {
                        isDepart: true,
                        departDate: new Date()
                    }
                })
            }
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: `Coach ${type} Success`,
        })
    }
    catch (err) {
        next(err)
    }
}
export const getCoachConfigByCoach = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { coachNo, date, fromStationId, destinationStationId } = req.query;
        if (!coachNo || !date || !fromStationId || !destinationStationId) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Please Select Coach No, Date, From Station, Destination Station",
            });
        }
        const result = await prisma.coachConfig.findFirst({
            where: {
                coachNo: coachNo as string,
                departureDate: date as string,
                active: true,
                coach: {
                    route: {
                        Segment: {
                            some: {
                                SegmentFare: {
                                    some: {
                                        fromStationId: Number(fromStationId),
                                        toStationId: Number(destinationStationId)
                                    }
                                }
                            }
                        }
                    }
                },
            },
            include: {
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
                        emergencyNumber: true,
                    }
                },
                helper: {
                    select: {
                        name: true,
                        contactNo: true,
                        emergencyNumber: true,
                    }
                },




                bookingSeat: {
                    select: {
                        seat: true,
                    }
                },
                orderSeat: {
                    where: {
                        status: "Success"
                    },
                    select: {
                        id: true,
                        seat: true,
                        orderId: true,
                        fromStation: true,
                        toStation: true,
                        unitPrice: true,
                        fare: true,
                        order: {
                            select: {
                                counterId: true,
                                counter: {
                                    select: {
                                        name: true,
                                    }
                                },
                                user: {
                                    select: {
                                        userName: true,
                                        contactNo: true,
                                    }
                                },
                                ticketNo: true,
                                customerName: true,
                                phone: true,
                                gender: true,
                                email: true,
                            }
                        },
                        coachConfigId: true,
                    }
                },
                CounterBookedSeat: {
                    select: {
                        seat: true,
                        counter: true,
                        user: true,
                    }
                },
                coach: {

                    include: {

                        route: {
                            include: {
                                fromStation: true,
                                toStation: true,
                                Segment: {
                                    include: {
                                        SegmentFare: {
                                            include: {
                                                fromStation: true,
                                                toStation: true,
                                            }
                                        }
                                    }
                                },
                                viaRoute: {
                                    include: {
                                        station: true,
                                    }
                                }
                            }
                        },
                    }
                }
            },
        })
        let bookedSeat = [];
        if (result) {
            const findOrderSeat = await prisma.orderSeat.findMany({
                where: {
                    status: {
                        in: ["Success", "Pending"]
                    },
                    coachConfigId: result.id,

                },
                include: {
                    segment: {
                        include: {
                            fare: {
                                include: {
                                    route: true
                                }
                            }
                        }
                    },
                }
            })
            if (findOrderSeat.length) {
                const viaRoute = result.coach.route.viaRoute;
                const seats = findOrderSeat.filter((item: any) => item.coachConfigId === result.id);
                let coachSeat = [];
                for (const seat of seats) {
                    if (!seat.isSeatShare) {
                        coachSeat.push(seat.seat);
                    } else {
                        const overlap = isOverlap(seat.fromStationId, seat.destinationStationId, Number(fromStationId), Number(destinationStationId), viaRoute);

                        if (overlap) {
                            coachSeat.push(seat.seat);
                        }
                    }
                }
                bookedSeat.push({
                    coachConfigId: result.id,
                    seat: coachSeat
                })
            }
        }

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Coach List retrieved Success',
            data: result,
            bookedSeat,
            // testConfig,
        })
    }
    catch (err) {
        next(err)
    }
}





export const getTodayCoachList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.user;
        let date = req.query.date;
        const supervisor = req.query.supervisor ? true : false;
        if (!date) {
            date = moment().tz('Asia/Dhaka').format('YYYY-MM-DD');
        }
        const search = {
            departureDate: date as string,
        }
        if (supervisor) {
            //@ts-ignore
            search.supervisorId = id;
        }
        const result = await prisma.coachConfig.findMany({
            where: search,
            include: {
                vehicle: {
                    select: {
                        fitnessCertificate: true,
                        registrationFile: true,
                        routePermit: true,
                        taxToken: true,
                        registrationExpiryDate: true,
                        fitnessExpiryDate: true,
                        routePermitExpiryDate: true,
                        taxTokenExpiryDate: true
                    }
                },
                supervisor: {
                    select: {
                        userName: true,
                        contactNo: true,
                    },
                },
                driver: {
                    select: {
                        name: true,
                        contactNo: true,
                    },
                },
                helper: {
                    select: {
                        name: true,
                        contactNo: true,
                    },
                },

                coach: {
                    include: {
                        route: {
                            include: {
                                fromStation: true,
                                toStation: true,
                                Segment: true,
                            }
                        },
                    }
                },
            },
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Coach List retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getCoachConfigSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.coachConfig.findUnique({
            where: {
                id
            },
            include: {
                coach: {
                    include: {
                        route: {
                            include: {
                                fromStation: true,
                                toStation: true,
                                Segment: true,
                            }
                        },
                    }
                },


                driver: {
                    select: {
                        name: true,
                        address: true,
                        contactNo: true,
                    },
                },
                helper: {
                    select: {
                        name: true,
                        address: true,
                        contactNo: true,
                    },
                },
                supervisor: {
                    select: {
                        userName: true,
                        address: true,
                        contactNo: true,
                    },
                },
            }
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Coach Config Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Coach Config retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}



export const deleteCoachConfig = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findCoachConfig = await prisma.coachConfig.findUnique({
            where: {
                id
            },
        })
        if (!findCoachConfig) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Coach Config Not Found'
            })
        }
        await prisma.coachConfigSeats.deleteMany({
            where: {
                coachConfigId: id
            }
        })
        const result = await prisma.coachConfig.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Coach Config Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Coach Config Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const updateCoachConfig = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { permission } = req.user;
        if (!permission || !permission.coachActiveInActive) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'You have no permission to update Coach Config'
            })
        }
        const transaction = await prisma.$transaction(async (prisma) => {
            const { ...data } = req.body;
            const id = Number(req.params.id)
            const findCoachConfig = await prisma.coachConfig.findUnique({
                where: {
                    id
                },
                include: {
                    coach: true,
                }
            })
            if (!findCoachConfig) {
                return res.status(404).send({
                    success: false,
                    statusCode: 404,
                    message: 'Coach Config Not Found'
                })
            }

            if (data.registrationNo && findCoachConfig.tripNo) {
                if (data.registrationNo !== findCoachConfig.registrationNo) {
                    const findTripNo = await prisma.trip.findUnique({
                        where: {
                            id: findCoachConfig.tripNo,
                        }
                    });
                    if (findTripNo && findTripNo.coachConfigIdDownWay) {
                        await prisma.trip.update({
                            where: {
                                id: findTripNo.id
                            },
                            data: {
                                coachConfigIdDownWay: null,
                                downDate: null,
                            }
                        })
                    } else {
                        await prisma.trip.delete({
                            where: {
                                id: findTripNo?.id
                            }
                        })
                    }
                }
            }
            else if (data.registrationNo && data.registrationNo !== findCoachConfig.registrationNo) {
                const findTrip = await prisma.trip.findFirst({
                    where: {
                        registrationNo: data.registrationNo
                    },
                    include: {
                        coachConfig: {
                            select: {
                                coach: true,
                                seatAvailable: true,
                            }
                        },
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                })

                if (!findTrip) {
                    const tripNo = await prisma.trip.create({
                        data: {
                            registrationNo: data.registrationNo,
                            coachConfigIdUpWay: id,
                            upDate: findCoachConfig.departureDate,
                        }
                    })
                    data.tripNo = tripNo.id;
                } else {
                    if (!findTrip.coachConfigIdDownWay) {
                        console.log(findTrip.coachConfig.seatAvailable, findCoachConfig.coach.routeId)
                        if (findTrip.coachConfig.coach.routeId === findCoachConfig.coach.routeId) {
                            return res.send({
                                success: false,
                                statusCode: 400,
                                message: 'This Vehicle Already Assigned To Another Trip'
                            })
                        }

                        await prisma.trip.update({
                            where: {
                                id: findTrip.id
                            },
                            data: {
                                coachConfigIdDownWay: id,
                                downDate: findCoachConfig.departureDate,
                            }
                        })
                        data.tripNo = findTrip.id;

                    } else {
                        const tripNo = await prisma.trip.create({
                            data: {
                                registrationNo: data.registrationNo,
                                coachConfigIdUpWay: id,
                                upDate: findCoachConfig.departureDate,
                            }
                        })
                        data.tripNo = tripNo.id;
                    }

                }
            }


            const result = await prisma.coachConfig.update({
                where: {
                    id,
                },
                data
            })

            return result
        },
            {
                maxWait: 500000,
                timeout: 1000000,
            }
        )
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Coach Config Updated Success',
            data: transaction
        })
    }
    catch (err) {
        next(err)
    }
}
export const coachReportSuperVisor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        let date = moment().tz('Asia/Dhaka').format('YYYY-MM-DD');
        console.log(date)
        const transaction = await prisma.$transaction(async (prisma) => {
            const findCoachConfig = await prisma.coachConfig.findUnique({
                where: {
                    id,
                },
                include: {
                    coach: {
                        include: {
                            route: {
                                include: {
                                    fromStation: true,
                                    toStation: true,
                                    Segment: true,
                                }
                            },
                        }
                    }

                },
            })

            const groupedByCounter = await prisma.order.groupBy({
                by: ['counterId'],
                where: {
                    coachConfigId: id,
                    counterId: { not: null },
                    date: date,

                },
                _sum: {
                    amount: true,
                    noOfSeat: true,
                },

            });

            const counters = await prisma.counter.findMany({
                where: {
                    //@ts-ignore
                    id: { in: groupedByCounter.map((entry) => entry.counterId) },
                },


            });

            const formattedCounterReport: any = [];

            for (const entry of groupedByCounter) {
                const counter = counters.find((c) => c.id === entry.counterId);
                let commission = 0;
                let commissionType = "Fixed"
                //@ts-ignore
                if (counter && counter.type === "Commission_Counter") {
                    //@ts-ignore
                    if (counter.commissionType === "Fixed") {
                        //@ts-ignore
                        commission = counter.commission * entry._sum.noOfSeat
                    } else {
                        //@ts-ignore
                        commission = (entry._sum.amount || 0) * (counter.commission / 100)
                        commissionType = "Percentage"
                    }
                }
                const totalAmountWithoutCommission =
                    commissionType === "Fixed"
                        ? (entry._sum.amount || 0) - commission
                        : (entry._sum.amount || 0) - commission;
                const findSeat = await prisma.orderSeat.findMany({
                    where: {
                        coachConfigId: id,
                        order: {
                            counterId: entry?.counterId,
                        },
                    },
                    select: {
                        seat: true,
                    }
                })
                const findOrder = await prisma.order.findMany({
                    where: {
                        coachConfigId: id,
                        counterId: entry?.counterId,
                    },
                    select: {
                        id: true,
                        customerName: true,
                        phone: true,
                        orderSeat: {
                            select: {
                                seat: true,
                            }
                        },
                        user: {
                            select: {
                                userName: true,
                            }
                        }
                    }
                })
                const findReportSubmitCounter = await prisma.counterReportSubmit.findFirst({
                    where: {
                        counterId: counter?.id,
                        coachConfigId: id,
                    }
                })
                const data = {
                    counterId: counter?.id,
                    counterType: counter?.type,
                    reportSubmitStatus: findReportSubmitCounter ? true : false,
                    totalAmountWithoutCommission,
                    commission: commission,
                    commissionType,
                    //@ts-ignore
                    counterName: counter ? counter.name : 'Unknown',
                    counterAddress: counter ? counter.address : 'Unknown',
                    counterPhone: counter?.mobile || 'Unknown',
                    totalAmount: entry._sum.amount || 0,
                    totalSeat: entry._sum.noOfSeat || 0,
                    seatNumbers: findSeat,
                    orderDetails: findOrder,
                };
                formattedCounterReport.push(data)
            }


            const onlineOrdersTotal = await prisma.order.aggregate({
                _sum: {
                    amount: true,
                    noOfSeat: true,
                },
                where: {
                    // coachConfigId: id,
                    date,
                    counterId: null,
                },
            });
            let soled = 0;
            let available = findCoachConfig?.seatAvailable || 0;
            formattedCounterReport.forEach((item: any) => {
                //@ts-ignore
                soled += item.totalSeat;
            })
            soled += onlineOrdersTotal._sum.noOfSeat || 0

            return {


                soled,
                available,
                coachInfo: findCoachConfig,
                counterWiseReport: formattedCounterReport,
                onlineOrders: {
                    totalAmount: onlineOrdersTotal._sum.amount || 0,
                    totalSeat: onlineOrdersTotal._sum.noOfSeat || 0,
                },

            };
        },
            {
                maxWait: 500000,
                timeout: 1000000,
            }
        )
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Coach Config Report',
            data: transaction
        })
    }
    catch (err) {
        next(err)
    }
}


