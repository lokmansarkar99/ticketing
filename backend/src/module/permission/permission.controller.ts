import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client";

export const createPermission = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {...data } = req.body;
       
        const result = await prisma.permission.create({
            data
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Permission  Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getPermissionAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.PermissionWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { name: { contains: search as string, } },
                ],
            });
        }
        const result = await prisma.permission.findMany({
            where: {
                AND: whereCondition
            },
            include:{
                permissionType: true
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.permission.count()
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Permission  retrieved Success',
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

export const getPermissionSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.permission.findUnique({
            where: {
                id
            },
            include:{
                permissionType: true
            }
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Permission  Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Permission  retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const deletePermission = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findOrder = await prisma.permission.findUnique({
            where: {
                id
            },
        })
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Permission  Not Found'
            })
        }
       
        const result = await prisma.permission.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Permission  Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Permission  Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const updatePermission = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ...data } = req.body;
        const id = Number(req.params.id)
        const findOrder = await prisma.permission.findUnique({
            where: {
                id
            }
        })
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Permission  Not Found'
            })
        }


        const result = await prisma.permission.update({
            where: {
                id,
            },
            data
        })


        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Permission  Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}