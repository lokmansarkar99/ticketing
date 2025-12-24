import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { Prisma } from "@prisma/client";

export const createCoach = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { routes = [], ...data } = req.body;
        const findRoute = await prisma.route.findUnique({
            where: {
                id: data.routeId
            },

        })
        const findCoachNo = await prisma.coach.findUnique({
            where: {
                coachNo: req.body.coachNo
            }
        })
        if (findCoachNo) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Coach Already Exists'
            })
        }
        if (!findRoute) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Route Not Found'
            })
        }
        const result = await prisma.coach.create({
            data: {
                ...data
            }
        })
        await prisma.coachViaRoute.createMany({
            data: routes.map((route: any) => ({
                coachId: result.id,
                ...route
            }))
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Coach Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}
export const getCoachAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search, coachNo, routeId, seatPlanId, fromCounterId, destinationCounterId, type, status, schedule } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
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
        if (coachNo) {
            whereCondition.push({
                coachNo: coachNo as string
            })
        }
        if (schedule) {
            whereCondition.push({
                schedule: schedule as string
            })
        }
        if (routeId) {
            whereCondition.push({
                routeId: Number(routeId)
            })
        }
        if (fromCounterId) {
            whereCondition.push({
                fromCounterId: Number(fromCounterId)
            })
        }
        if (fromCounterId) {
            whereCondition.push({
                fromCounterId: Number(fromCounterId)
            })
        }
        if (destinationCounterId) {
            whereCondition.push({
                destinationCounterId: Number(destinationCounterId)
            })
        }
        if (seatPlanId) {
            whereCondition.push({
                seatPlanId: Number(seatPlanId)
            })
        }
        if (type) {
            whereCondition.push({
                coachType: type as string
            })
        }
        if (status) {
            whereCondition.push({
                active: status === "true"
            })
        }
        const result = await prisma.coach.findMany({
            where: {
                AND: whereCondition,
            },
            include: {
                fromCounter: {
                    select: {
                        name: true,
                    }
                },
                destinationCounter: {
                    select: {
                        name: true,
                    }
                },
                route: {
                    select: {
                        routeName: true,
                        Segment: {
                            select: {
                                SegmentFare: {
                                    select: {
                                        b_class_amount: true,
                                        e_class_amount: true,
                                        sleeper_class_amount: true,
                                        fromStation: {
                                            select: {
                                                name: true,
                                            }
                                        },
                                        toStation: {
                                            select: {
                                                name: true,
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },


            },
            skip: skip * take,
            take,
        })
        const total = await prisma.coach.count({
            where: {
                AND: whereCondition,
            },
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Coach retrieved Success',
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
export const getCoachSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.coach.findUnique({
            where: {
                id
            },
            include: {
                fromCounter: {
                    select: {
                        name: true,
                    }
                },
                destinationCounter: {
                    select: {
                        name: true,
                    }
                },
                CoachViaRoute: {
                    include: {
                        counter: {
                            select: {
                                name: true,
                                id: true,
                            }
                        }
                    }
                },
                route: {
                    select: {
                        routeName: true,
                    }
                },

            },
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Coach Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Coach retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}
export const deleteCoach = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findCoach = await prisma.coach.findUnique({
            where: {
                id
            },
        })
        if (!findCoach) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Coach Not Found'
            })
        }

        const result = await prisma.coach.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Coach Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Coach Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const updateCoach = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        const { routes = [], ...data } = req.body;
        const findRoute = await prisma.route.findUnique({
            where: {
                id: data?.routeId
            },

        })
        const findCoachNo = await prisma.coach.findUnique({
            where: {
                coachNo: data?.coachNo
            }
        })
        if (findCoachNo && findCoachNo.id !== id) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Coach Already Exists'
            })
        }
        if (!findRoute) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Route Not Found'
            })
        }
        const result = await prisma.coach.update({
            where: {
                id
            },
            data: {
                ...data
            }
        })

        if (routes.length) {
            await prisma.coachViaRoute.deleteMany({
                where: {
                    coachId: result.id
                }
            })
            await prisma.coachViaRoute.createMany({
                data: routes.map((route: any) => ({
                    ...route,
                    coachId: result.id,
                }))
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: `Coach Updated ${result.active ? 'Activated' : 'Deactivated'} Success`,
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}
export const coachActiveInActive = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        const { ...data } = req.body;


        const result = await prisma.coach.update({
            where: {
                id
            },
            data: {
                ...data
            }
        })


        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Coach Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}