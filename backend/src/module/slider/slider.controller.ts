import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client";

export const createSlider = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ...data } = req.body;
        const count = await prisma.slider.count()
        if (count >4) {
            return res.status(400).send({
                success: false,
                statusCode: 200,
                message: 'Slider  Added Maximum Number Of Five',
            })
        }
        const result = await prisma.slider.create({
            data
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Slider Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getSliderAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortSlider, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.SliderWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { image: { contains: search as string, } },
                ],
            });
        }
        const result = await prisma.slider.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.slider.count()
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Slider retrieved Success',
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

export const getSliderSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.slider.findUnique({
            where: {
                id
            },
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Slider Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Slider retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const deleteSlider = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findSlider = await prisma.slider.findUnique({
            where: {
                id
            },
        })
        if (!findSlider) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Slider Not Found'
            })
        }

        const result = await prisma.slider.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Slider Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense Slider Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const updateSlider = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ...data } = req.body;
        const id = Number(req.params.id)
        const findSlider = await prisma.slider.findUnique({
            where: {
                id
            }
        })
        if (!findSlider) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Slider Not Found'
            })
        }


        const result = await prisma.slider.update({
            where: {
                id,
            },
            data
        })


        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Slider Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}