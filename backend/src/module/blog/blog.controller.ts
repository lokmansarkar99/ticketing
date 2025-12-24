import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { Prisma, ProductType } from "@prisma/client";

// create Blog variation
export const createBlog = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {


        const findBlog = await prisma.blog.findFirst({
            where: {
                title: req.body.title,
            }
        })
        if (findBlog) {
            return res.status(400).send({
                success: false,
                message: "Blog  Already Exist"
            })
        }
        const slug = req.body.title.toLowerCase().replace(/ /g, "-");
        // Create Blog
        const result = await prisma.blog.create({
            data: { ...req.body, slug: slug },
        });

        res.status(201).json({
            success: true,
            statusCode: 201,
            message: "Blog Created Successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

export const getBlogAll = async (
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

        const whereBlog: Prisma.BlogWhereInput[] = [];
        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereBlog.push({
                OR: [{ title: { contains: search as string } }],
            });
        }

        const result = await prisma.blog.findMany({
            where: {
                status: status as ProductType,
                AND: whereBlog,
            },
            skip: skip * take,
            take,
            orderBy: {
                title: "desc"
            }
        });
        const total = await prisma.blog.count()

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Blog  retrieved successfully",
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

// get Blog by id
export const getBlogById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const BlogId = req.params.id;


        const result = await prisma.blog.findFirst({
            where: {
                slug: BlogId,
            },
        });

        if (!result) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Blog not found",
            });
        }

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Blog retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

// update Blog
export const updateBlog = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const BlogId = Number(req.params.id);
        const { ...data } = req.body;
        if (isNaN(BlogId)) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "Invalid Blog  id",
            });
        }

        const existingBlog = await prisma.blog.findUnique({
            where: {
                id: BlogId,
            },
        });

        if (!existingBlog) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Blog not found",
            });
        }
        const slug = req.body.title.toLowerCase().replace(/ /g, "-");

        const result = await prisma.blog.update({
            where: {
                id: BlogId,
            },
            data: { ...data, slug, },
        });

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Blog updated successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// delete Blog Product
export const deleteBlog = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const BlogId = Number(req.params.id);
        if (isNaN(BlogId)) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "Invalid Blog  id",
            });
        }

        const existingBlog = await prisma.blog.findUnique({
            where: {
                id: BlogId,
            },
        });

        if (!existingBlog) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Blog not found",
            });
        }

        const result = await prisma.blog.delete({
            where: {
                id: BlogId,
            },
        });
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Blog  deleted successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
