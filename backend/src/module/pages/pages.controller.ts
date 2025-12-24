import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { Prisma, ProductType } from "@prisma/client";

// create Pages variation
export const createPages = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {


        const findPages = await prisma.pages.findFirst({
            where: {
                title: req.body.title,
            }
        })
        if (findPages) {
            return res.status(400).send({
                success: false,
                message: "Pages  Already Exist"
            })
        }

        // Create Pages
        const result = await prisma.pages.create({
            data: req.body,
        });

        res.status(201).json({
            success: true,
            statusCode: 201,
            message: "Pages Created Successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

export const getPagesAll = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { page, size, sortOrder, search, status = "Published" } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const order =
            (sortOrder as string)?.toLowerCase() === "desc" ? "desc" : "asc";

        const wherePages: Prisma.PagesWhereInput[] = [];
        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            wherePages.push({
                OR: [{ title: { contains: search as string } }],
            });
        }

        const result = await prisma.pages.findMany({
            where: {
                status: status as ProductType,
                AND: wherePages,
            },
            skip: skip * take,
            take,
            orderBy: {
                title: "asc"
            }
        });
        const total = await prisma.pages.count()

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Pages  retrieved successfully",
            meta: {
                page: skip,
                size: take,
                total,
                totalPage: Math.ceil(total / take)
            },
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// get Pages by id
export const getPagesById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const PagesId = req.params.id;

        if (!PagesId) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "Invalid Pages  id",
            });
        }

        const result = await prisma.pages.findFirst({
            where: {
                slug: PagesId,
            },
        });

        if (!result) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Pages not found",
            });
        }

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Pages retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

// update Pages
export const updatePages = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const PagesId = Number(req.params.id);
        const { ...data } = req.body;
        if (isNaN(PagesId)) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "Invalid Pages  id",
            });
        }

        const existingPages = await prisma.pages.findUnique({
            where: {
                id: PagesId,
            },
        });

        if (!existingPages) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Pages not found",
            });
        }

        const result = await prisma.pages.update({
            where: {
                id: PagesId,
            },
            data: data,
        });

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Pages updated successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// delete Pages Product
export const deletePages = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const PagesId = Number(req.params.id);
        if (isNaN(PagesId)) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "Invalid Pages  id",
            });
        }

        const existingPages = await prisma.pages.findUnique({
            where: {
                id: PagesId,
            },
        });

        if (!existingPages) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Pages not found",
            });
        }

        const result = await prisma.pages.delete({
            where: {
                id: PagesId,
            },
        });
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Pages deleted successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
