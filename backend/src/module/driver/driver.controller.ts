import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { Prisma } from "@prisma/client";

export const createDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { contactNo="null", } = req.body;
        const isExistingPhone = await prisma.driver.findUnique({ where: { contactNo } })
        if (isExistingPhone) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Driver Phone Already Exist"
            })
        }
        const result = await prisma.driver.create({
            data: req.body,
        })
        res.status(201).send({
            success: true,
            statusCode: 201,
            message: 'Driver Created Successfully',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getDriverAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = (parseInt(page as string) - 1) || 0;
        const take = (parseInt(size as string)) || 10;
        const order = (sortOrder as string)?.toLowerCase() === 'desc' ? 'desc' : 'asc';
        const whereCondition: Prisma.DriverWhereInput[] = []
        if (skip < 0) {
            skip = 0
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { name: { contains: search as string, } },
                    { email: { contains: search as string, } },
                    { contactNo: { contains: search as string, } },
                    { address: { contains: search as string, } },
                ],
            });
        }
        [];
        let result = await prisma.driver.findMany({
            where: {
                AND: whereCondition,
            },
            select: {
                id:true,
                name: true,
                contactNo: true,
                address: true,
                active: true,
                avatar: true,
                licensePhoto: true,
                referenceBy: true,
            },

            skip: skip * take,
            take,

        });

        let total = await prisma.driver.count();

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Get Driver All Successfully',
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
export const getDriverSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await prisma.driver.findUnique({
            where: {
                id: Number(id)
            },
            select: {
                id: true,
                name: true,
                email: true,
                contactNo: true,
                address: true,
                active: true,
                avatar: true,
                dateOfBirth: true,
                maritalStatus: true,
                gender: true,
                bloodGroup: true,
                emergencyNumber: true,
                licenseExpDate: true,
                licenseIssueDate: true,
                licenseNumber: true,
                referenceBy: true,
                licensePhoto: true,
            }
        })
        res.status(200).send({
            success: true,
            message: "Get Driver Success",
            statusCode: 200,
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const deleteDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const result = await prisma.driver.delete({
            where: {
                id: Number(id)
            }
        })
        res.status(200).send({
            success: true,
            message: "Driver Delete Success",
            statusCode: 200,
        })
    }
    catch (err) {
        next(err)
    }
}

export const updateDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await prisma.driver.update({
            where: {
                id: Number(id)
            },
            data: req.body
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Driver Updated Success",
        })
    }
    catch (err) {
        next(err)
    }
}
