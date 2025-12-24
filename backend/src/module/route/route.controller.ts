import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client";

export const createRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { viaStations, ...data } = req.body;
        const result = await prisma.route.create({
            data
        })
        await prisma.viaRoute.createMany({
            data: viaStations.map((stationId: number) => ({
                routeId: result.id,
                stationId
            }))
        })

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Route Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getRouteAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.RouteWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { via: { contains: search as string, } },
                    { routeName: { contains: search as string, } },
                ],
            });
        }
        const result = await prisma.route.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
            select: {
                routeName: true,
                id: true,
                from: true,
                to: true,
                viaRoute: {
                    select: {
                        id: true,
                        station: true,
                        schedule: true,
                    }
                }
            },
        })
        const total = await prisma.route.count()
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Route retrieved Success',
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


export const getRouteSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.route.findUnique({
            where: {
                id
            },
            include: {
                fromStation: true,
                toStation: true,
                Segment: {
                    include: {
                        SegmentFare: {
                            include: {
                                fromStation: true,
                                toStation: true
                            }
                        }
                    }
                },
                viaRoute: {
                    include: {
                        route: true,
                        station: true
                    }
                },

            }
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Route Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Route retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const deleteRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findRoute = await prisma.route.findUnique({
            where: {
                id
            },
        })
        if (!findRoute) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Route Not Found'
            })
        }
        await prisma.viaRoute.deleteMany({
            where: {
                routeId: findRoute.id
            }
        })
        await prisma.viaRoute.deleteMany({
            where: {
                routeId: findRoute.id
            }
        })
        const result = await prisma.route.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Route Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Route Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const updateRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { viaStations, ...data } = req.body;
        const id = Number(req.params.id)
        const findRoute = await prisma.route.findUnique({
            where: {
                id
            }
        })
        if (!findRoute) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Route Not Found'
            })
        }


        const result = await prisma.route.update({
            where: {
                id,
            },
            data
        })

        await prisma.viaRoute.deleteMany({
            where: {
                routeId: id
            }
        })


        await prisma.viaRoute.createMany({
            data: viaStations.map((stationId: number) => ({
                routeId: result.id,
                stationId
            }))
        })


        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Route Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}