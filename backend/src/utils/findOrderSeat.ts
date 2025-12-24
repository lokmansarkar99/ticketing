import prisma from "./prisma";

export const findOrderSeat = async (coachConfigId: number, fromStationId: number, destinationStationId: number) => {

    const findOrderSeat = await prisma.orderSeat.findMany({
        where: {
            coachConfigId: coachConfigId,
            status: {
                in: ["Success", "Pending"]
            }
        },
        include: {
            segment: {
                include: {
                    fare:{
                        include:{
                            route: true
                        }
                    }
                }
            },
        }
    })
    let coachSeat = [];
    if (findOrderSeat.length) {
        for (const seat of findOrderSeat) {
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

    }



    return coachSeat;
};
export const findOrderSeatByBooking = async (coachConfigId: number,) => {

    const findOrderSeat = await prisma.orderSeat.findMany({
        where: {
            isSeatShare: false,
            coachConfigId: coachConfigId,
            status: {
                in: ["Success", "Pending"]
            }
        },
        include: {
            segment: {
                include: {
                    fare:{
                        include:{
                            route: true
                        }
                    }
                }
            },
        }
    })
    let coachSeat = [];
    if (findOrderSeat.length) {
        for (const seat of findOrderSeat) {
            coachSeat.push(seat.seat);
        }

    }



    return coachSeat;
};
export const findBookingSeat = async (coachConfigId: number, fromStationId: number, destinationStationId: number) => {

    const findOrderSeat = await prisma.counterBookedSeat.findMany({
        where: {
            coachConfigId: coachConfigId,

        },
        include: {
            segment: {
                include: {
                    fare: {
                        include:{
                            route: true,
                        }
                    },
                }
            },
        }
    })
    let coachSeat = [];
    if (findOrderSeat.length) {
        for (const seat of findOrderSeat) {
            if (!seat.isSeatShare) {
                coachSeat.push({ counterId: seat.counterId, seat: seat.seat });
            } else {
                if (Number(fromStationId) === seat.fromStationId && Number(destinationStationId) === seat.destinationStationId) {
                    coachSeat.push({ counterId: seat.counterId, seat: seat.seat });
                }
                if (seat.segment.fare.route.from === Number(fromStationId) && seat.segment.fare.route.to === Number(destinationStationId)) {
                    coachSeat.push({ counterId: seat.counterId, seat: seat.seat });
                }
            }
        }

    }



    return coachSeat;
};