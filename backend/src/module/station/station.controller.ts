import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client"

export const createStation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const findStation = await prisma.station.findFirst({
            where: {
                name: req.body.name
            }
        })
        if (findStation) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Station Already Exists'
            })
        }
        const result = await prisma.station.create({
            data: req.body
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Station Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getStationAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.StationWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            skip = 0
            whereCondition.push({
                OR: [
                    { name: { contains: search as string, } },
                ],
            });
        }
        const result = await prisma.station.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.station.count({
            where: {
                AND: whereCondition
            },
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Station retrieved Success',
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

export const getStationSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.station.findUnique({
            where: {
                id
            },
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Station Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Station retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const deleteStation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findStation = await prisma.station.findUnique({
            where: {
                id
            },
        })
        if (!findStation) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Station Not Found'
            })
        }
        const result = await prisma.station.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Station Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Station Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const updateStation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        const findStation = await prisma.station.findUnique({
            where: {
                id
            }
        })
        if (!findStation) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Station Not Found'
            })
        }
        if (req.body.name) {
            const findName = await prisma.station.findFirst({
                where: {
                    name: req.body.name
                }
            })
            if (findName && findStation.id !== findName.id) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: 'Name Already Exists'
                })
            }
        }


        const result = await prisma.station.update({
            where: {
                id,
            },
            data: req.body
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Station Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}