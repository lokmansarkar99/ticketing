import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client";

export const createVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ...data } = req.body;
        const findReg = await prisma.vehicle.findUnique({
            where: {
                registrationNo: data.registrationNo
            }
        });
        if (findReg) {
            return res.status(409).send({
                success: false,
                statusCode: 409,
                message: 'Vehicle with same registration number already exists'
            });
        }

        const result = await prisma.vehicle.create({
            data
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Vehicle Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const getVehicleAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, registrationNo, search, coachType, isActive, seatPlan } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.VehicleWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { registrationNo: { contains: search as string, } },
                ],
            });
        };
        if (coachType) {
            whereCondition.push({

                coachType: { contains: coachType as string, }

            });
        };
        if (registrationNo) {
            whereCondition.push({
                registrationNo: { contains: registrationNo as string, }
            });
        };
        if (seatPlan) {
            whereCondition.push({

                seatPlan: { contains: seatPlan as string, }

            });
        };
        if (isActive) {
            whereCondition.push({
                isActive: isActive === "true"
            });
        };
        const result = await prisma.vehicle.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.vehicle.count({
            where: {
                AND: whereCondition
            },
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Vehicle Category retrieved Success',
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

export const getVehicleSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.vehicle.findUnique({
            where: {
                id
            },
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Vehicle Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Vehicle retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const deleteVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findVehicle = await prisma.vehicle.findUnique({
            where: {
                id
            },
        })
        if (!findVehicle) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Vehicle Not Found'
            })
        }

        const result = await prisma.vehicle.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Vehicle Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Vehicle Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const updateVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ...data } = req.body;
        const id = Number(req.params.id)
        const findVehicle = await prisma.vehicle.findUnique({
            where: {
                id
            }
        })
        if (!findVehicle) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Vehicle Not Found'
            })
        }


        const result = await prisma.vehicle.update({
            where: {
                id,
            },
            data
        })


        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Vehicle Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}