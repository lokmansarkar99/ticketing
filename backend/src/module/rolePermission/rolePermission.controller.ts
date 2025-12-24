import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client";

export const createRolePermission = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {...data } = req.body;
       
        const result = await prisma.rolePermission.create({
            data
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Role Permission Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getRolePermissionAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.RolePermissionWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereCondition.push({
                OR: [
                    // { role: { contains: search as RolePermission, } },
                ],
            });
        }
        const result = await prisma.rolePermission.findMany({
            where: {
                AND: whereCondition
            },
            include:{
                permission: {
                    include:{
                        RolePermission: true
                    }
                }
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.rolePermission.count()
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Role Permission  retrieved Success',
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
export const getRolePermissionSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.rolePermission.findUnique({
            where: {
                id
            },
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Role Permission Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Role Permission retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const deleteRolePermission = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findOrder = await prisma.rolePermission.findUnique({
            where: {
                id
            },
        })
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Role Permission Not Found'
            })
        }
       
        const result = await prisma.rolePermission.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Role Permission Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Role Permission Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const updateRolePermission = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ...data } = req.body;
        const id = Number(req.params.id)
        const findOrder = await prisma.rolePermission.findUnique({
            where: {
                id
            }
        })
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Role Permission Not Found'
            })
        }


        const result = await prisma.rolePermission.update({
            where: {
                id,
            },
            data
        })


        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Role Permission Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}