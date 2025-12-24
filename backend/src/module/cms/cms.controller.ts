import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client";

export const createCMS = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ...data } = req.body;
        const findCms = await prisma.cMS.findFirst();
        if (findCms) {
            return res.status(409).send({
                success: false,
                statusCode: 409,
                message: 'CMS already exists'
            })
        }
        const result = await prisma.cMS.create({
            data
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'CMS Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getCMS = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const result = await prisma.cMS.findFirst();
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'CMS retrieved Success',

            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const deleteCMS = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findCms = await prisma.cMS.findUnique({
            where: {
                id
            },
        })
        if (!findCms) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'CMS Not Found'
            })
        }

        const result = await prisma.cMS.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'CMS Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'CMS Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const updateCMS = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ...data } = req.body;
        const id = Number(req.params.id)
        const findCms = await prisma.cMS.findUnique({
            where: {
                id
            }
        })
        if (!findCms) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'CMS Not Found'
            })
        }


        const result = await prisma.cMS.update({
            where: {
                id,
            },
            data
        })


        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'CMS Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}
