import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { CounterType, Prisma } from "@prisma/client"
import bcrypt from 'bcrypt'

export const createCounter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { mobile, type, commissionType, commission } = req.body;
        const findCounterMobile = await prisma.counter.findUnique({
            where: {
                mobile: mobile,
            }
        })


        if (findCounterMobile) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Mobile Number Already Exists'
            })
        }

        if (type === "Commission_Counter") {
            if (!commissionType || !commission) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: 'Commission Type and commission field required because counter type Commission_Counter'
                })
            }

        }
        if (type === "Own_Counter" || type === "Head_Office") {
            req.body.commissionType = "Fixed";
            req.body.commission = 0;
        }
        const result = await prisma.counter.create({
            data: req.body
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Counter Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getCounterAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search, name, address, stationId, status, type } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.CounterWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { name: { contains: search as string, } },
                    { primaryContactPersonName: { contains: search as string, } },
                ],
            });
        }
        if (name) {
            whereCondition.push({
                name: name as string,
            })
        }
        if (address) {
            whereCondition.push({
                address: address as string,
            })
        }
        if (stationId) {
            whereCondition.push({
                stationId: Number(stationId),
            })
        }
        if (type) {
            whereCondition.push({
                type: type as CounterType,
            })
        }
        if (status) {
            whereCondition.push({
                status: status === "true",
            })
        }
        const result = await prisma.counter.findMany({
            where: {
                AND: whereCondition,
            },
            skip: skip * take,
            take,
            select: {
                id: true,
                mobile: true,
                name: true,
                station: true,
                status: true,
                address: true,
                type: true,
                primaryContactPersonName: true
            },
        })
        const total = await prisma.counter.count()
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Counter retrieved Success',
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
export const getCounterAllByStation = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const result = await prisma.station.findMany({
            where: {
                Counter: {
                    some: {}
                }
            },
            include: {
                Counter: {
                    select: {
                        name: true,
                        address: true,
                        phone: true,
                        mobile: true,
                        locationUrl: true,
                    }
                }
            }

        })

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Counter retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getCounterSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.counter.findUnique({
            where: {
                id
            },
            include: {
                station: true
            }
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Counter Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Counter retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}
export const getCounterViaRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const findRoute = await prisma.route.findUnique({
            where: {
                id: Number(req.params.id)
            },
            include: {
                viaRoute: true
            }
        });
        if (!findRoute) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Route Not Found'
            })
        }

        const fromCounter = await prisma.counter.findMany({
            where: {
                stationId: findRoute.from
            },
            select: {
                name: true,
                id: true,
            }
        });
        const toCounter = await prisma.counter.findMany({
            where: {
                stationId: findRoute.to
            },
            select: {
                name: true,
                id: true,
            }
        });
        const viaCounter = await prisma.counter.findMany({
            where: {
                stationId: { in: findRoute.viaRoute.map(via => via.stationId) }
            },
            select: {
                name: true,
                id: true,
            }
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Counter retrieved Success',
            data: {
                fromCounter,
                toCounter,
                viaCounter
            }
        });
    }
    catch (err) {
        next(err)
    }
}

export const deleteCounter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findCounter = await prisma.counter.findUnique({
            where: {
                id
            },
        })
        if (!findCounter) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Counter Not Found'
            })
        }
        const result = await prisma.counter.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Counter Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Counter Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const updateCounter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        const findCounter = await prisma.counter.findUnique({
            where: {
                id
            }
        })

        if (!findCounter) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Counter Not Found'
            })
        }
        if (req.body.mobile) {
            const findCounterMobile = await prisma.counter.findUnique({
                where: {
                    mobile: req.body.mobile
                }
            })
            if (findCounterMobile && findCounter.id !== findCounterMobile.id) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: 'Mobile Number Already Exists'
                })
            }
        }


        if (req.body.type === "Commission_Counter") {
            if (!req.body.commissionType || !req.body.commission) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: 'Commission Type and commission field required because counter type Commission_Counter'
                })
            }

        }
        if (req.body.type === "Own_Counter" || req.body.type === "Head_Office") {
            req.body.commissionType = "Fixed";
            req.body.commission = 0;
        }

        const result = await prisma.counter.update({
            where: {
                id,
            },
            data: req.body
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Counter Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}