import { NextFunction, Request, Response } from "express";
import { findBookingSeat, findOrderSeat } from "../utils/findOrderSeat";
import prisma from "../utils/prisma";
import { isOverlap } from "../module/coachConfig/coachConfig.controller";

export const VerifySeatCheck = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { seats, fromStationId, destinationStationId, returnCoachConfigId=0, coachConfigId, ...data } = req.body;
        let available = true;
        let seatNo = null;
        const findCoach = await prisma.coachConfig.findUnique({
            where: {
                id: coachConfigId,
            },
            include: {
                orderSeat: true,
                coach: {
                    include: {
                        route: {
                            include: {
                                viaRoute: true,
                            }
                        }
                    }
                },
            }
        })
        const findReturnCoach = await prisma.coachConfig.findUnique({
            where: {
                id: returnCoachConfigId,
            },
            include: {
                orderSeat: true,
                coach: {
                    include: {
                        route: {
                            include: {
                                viaRoute: true,
                            }
                        }
                    }
                },
            }
        })
        if (!findCoach) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Coach Not Found'
            })
        }
        if (data.orderType !== "One_Trip" && !findReturnCoach) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Return Coach Not Found'
            })
        }
        let coachSeat = [];
        if (data.orderType === "One_Trip") {
            const viaRoute = findCoach.coach.route.viaRoute;
            for (const seat of findCoach.orderSeat) {
                const overlap = isOverlap(seat.fromStationId, seat.destinationStationId, Number(fromStationId), Number(destinationStationId), viaRoute);
                if (overlap) {
                    coachSeat.push(seat.seat);
                }

            }
            for (const seat of seats) {
                const findSeat = coachSeat.find(s => s === seat?.seat);
                if (findSeat) {
                    available = false;
                    seatNo = findSeat;
                    break;
                }
            }

        } else {
            const findCoachSeat = seats.filter((seat: any) => seat.coachConfigId === coachConfigId)
            const findReturnCoachSeat = seats.filter((seat: any) => seat.coachConfigId === returnCoachConfigId);
            const viaRoute = findCoach.coach.route.viaRoute;
            for (const seat of findCoach.orderSeat) {
                const overlap = isOverlap(seat.fromStationId, seat.destinationStationId, Number(fromStationId), Number(destinationStationId), viaRoute);
                if (overlap) {
                    coachSeat.push(seat.seat);
                }

            }
            for (const seat of findCoachSeat) {
                const findSeat = coachSeat.find(s => s === seat?.seat);
                if (findSeat) {
                    available = false;
                    seatNo = findSeat;
                    break;
                }
            }
            const returnViaRoute = findReturnCoach?.coach?.route?.viaRoute;
            for (const seat of (findReturnCoach?.orderSeat || [])) {
                const overlap = isOverlap(seat.fromStationId, seat.destinationStationId, Number(fromStationId), Number(destinationStationId), returnViaRoute);
                if (overlap) {
                    coachSeat.push(seat.seat);
                }

            }
            for (const seat of findReturnCoachSeat) {
                const findSeat = coachSeat.find(s => s === seat?.seat);
                if (findSeat) {
                    available = false;
                    seatNo = findSeat;
                    break;
                }
            }


        }
        if (available) {
            next();
        } else {
            return res.status(400).send({
                success: true,
                statusCode: 400,
                message: available ? 'Seats Available' : `${seatNo} Seats Not Available`,
                data: { available }
            })
        }


    }
    catch (err) {
        next(err)
    }
}
export const VerifyBookingCheck = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { counterId } = req.user;
        const { seats, fromStationId, destinationStationId, returnCoachConfigId, coachConfigId, ...data } = req.body;
        let available = true;
        let seatNo = null;
        if (data.orderType === "One_Trip") {
            const result = await findBookingSeat(coachConfigId, fromStationId, destinationStationId);
            for (const seat of seats) {
                const findSeat = result.find(s => s.seat === seat?.seat);
                if (findSeat && findSeat.counterId !== counterId) {
                    available = false;
                    seatNo = findSeat.seat;
                    break;
                }
            }

        }
        if (available) {
            next();
        } else {
            return res.status(200).send({
                success: false,
                statusCode: 200,
                message: available ? 'Seats Available' : `${seatNo} Seats Not Available`,
                data: { available }
            })
        }


    }
    catch (err) {
        next(err)
    }
}