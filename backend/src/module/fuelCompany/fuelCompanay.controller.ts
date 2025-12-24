import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { Prisma } from "@prisma/client";

export const createFuelCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { phone="null", } = req.body;
        const isExistingPhone = await prisma.fuelCompany.findFirst({ where: { phone } })
        if (isExistingPhone) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Fuel Company Phone Already Exist"
            })
        }
        const result = await prisma.fuelCompany.create({
            data: req.body,
        })
        res.status(201).send({
            success: true,
            statusCode: 201,
            message: 'Fuel Company Created Successfully',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getFuelCompanyAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = (parseInt(page as string) - 1) || 0;
        const take = (parseInt(size as string)) || 10;
        const order = (sortOrder as string)?.toLowerCase() === 'desc' ? 'desc' : 'asc';
        const whereCondition: Prisma.FuelCompanyWhereInput[] = []
        if (skip < 0) {
            skip = 0
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { name: { contains: search as string, } },
                    { email: { contains: search as string, } },
                    { phone: { contains: search as string, } },
                    { address: { contains: search as string, } },
                ],
            });
        }
        [];
        let result = await prisma.fuelCompany.findMany({
            where: {
                AND: whereCondition,
                
            },
            select: {
                id:true,
                name: true,
                phone: true,
                address: true,
                
            },

            skip: skip * take,
            take,

        });

        let total = await prisma.fuelCompany.count();

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Get FuelCompany All Successfully',
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
export const getFuelCompanySingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await prisma.fuelCompany.findUnique({
            where: {
                id: Number(id)
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                website: true,
                
            }
        })
        res.status(200).send({
            success: true,
            message: "Get FuelCompany Success",
            statusCode: 200,
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const deleteFuelCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const result = await prisma.fuelCompany.delete({
            where: {
                id: Number(id)
            }
        })
        res.status(200).send({
            success: true,
            message: "Fuel Company Delete Success",
            statusCode: 200,
        })
    }
    catch (err) {
        next(err)
    }
}

export const updateFuelCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await prisma.fuelCompany.update({
            where: {
                id: Number(id)
            },
            data: req.body
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Fuel Company Updated Success",
        })
    }
    catch (err) {
        next(err)
    }
}
