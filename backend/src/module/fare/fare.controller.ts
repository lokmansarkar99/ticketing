import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client"

export const createFare = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { segmentFare = [], ...data } = req.body;
        const findRoute = await prisma.route.findUnique({
            where: {
                id: data.routeId
            }
        })
        if (!findRoute) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Route Not Found'
            })
        }
        const findMainSegment = segmentFare.find((item: { fromStationId: number; toStationId: number }) => item.fromStationId === findRoute.from && item.toStationId === findRoute.to);
        if (!findMainSegment) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Main Segment Not Found'
            })
        }
        console.log({ data })
        const result = await prisma.fare.create({
            data: data
        })
        await prisma.segmentFare.createMany({
            data: segmentFare.map((item: { fromStationId: number; toStationId: number; amount: number }) => ({
                ...item,
                fareId: result.id
            }))
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Fare Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getFareAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.FareWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { route: { routeName: { contains: search as string, } } },
                ],
            });
        }
        const result = await prisma.fare.findMany({
            where: {
                AND: whereCondition
            },
            include: {
                route: {
                    select: {
                        routeName: true,
                    }
                },
                seatPlan: {
                    select: {
                        name: true,
                    }
                }
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.fare.count()
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Fare retrieved Success',
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

export const getFareSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.fare.findUnique({
            where: {
                id
            },
            include: {
                route: {
                    select: {
                        routeName: true,
                    }
                },
                seatPlan: {
                    select: {
                        name: true,
                    }
                },
                SegmentFare: {
                    select: {
                        fromStation: {
                            select: {
                                name: true,
                            }
                        },
                        toStation: {
                            select: {
                                name: true,
                            }
                        },
                        fromStationId: true,
                        toStationId: true,
                        amount: true,
                        b_class_amount: true,
                        e_class_amount: true,
                        sleeper_class_amount: true,
                        id: true,
                        isActive: true,
                    }
                }
            }
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Fare Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Fare retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const deleteFare = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);

        const findFare = await prisma.fare.findUnique({
            where: {
                id
            },
        })
        if (!findFare) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Fare Not Found'
            })
        }
        await prisma.segmentFare.deleteMany({
            where: {
                fareId: id
            }
        })
        const result = await prisma.fare.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Fare Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Fare Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const updateFare = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { segmentFare, ...data } = req.body;
        const id = Number(req.params.id)
        const findFare = await prisma.fare.findUnique({
            where: {
                id
            }
        })
        if (!findFare) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Fare Not Found'
            })
        }



        const result = await prisma.fare.update({
            where: {
                id,
            },
            data: data
        })



        if (segmentFare && segmentFare.length) {

            const createSegmentFare = segmentFare.filter((item: any) => !item.id);
            const updateSegmentFare = segmentFare.filter((item: any) => item.id);
            if (createSegmentFare.length) {
                await prisma.segmentFare.createMany({
                    data: createSegmentFare.map((item: { fromStationId: number; toStationId: number; amount: number }) => ({
                        ...item,
                        fareId: result.id
                    }))
                });
            }
            if (updateSegmentFare.length) {
                await Promise.all(
                    updateSegmentFare.map((item: any) =>
                        prisma.segmentFare.update({
                            where: { id: item.id },
                            data: item
                        })
                    )
                );
            }

        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Fare Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}