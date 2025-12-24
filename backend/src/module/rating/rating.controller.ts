import { Request, Response, NextFunction } from "express";
import prisma from "../../utils/prisma";
import { Prisma, ReviewStatus } from "@prisma/client";

// create review
export const createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { customerId, orderId } = req.body;

        // check order already reviewed
        const existingReview = await prisma.review.findUnique({
            where: { orderId },
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "This order already reviewed",
            });
        }

        const result = await prisma.review.create({
            data: req.body,
        });

        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// get all reviews (admin)
export const getReviewAll = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { page, size, status, search } = req.query;

        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;

        const whereReview: Prisma.ReviewWhereInput[] = [];
        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereReview.push({
                OR: [
                    { customer: { name: { contains: search as string, } } },
                    { customer: { phone: { contains: search as string, } } },
                ],
            });
        }

        const result = await prisma.review.findMany({
            where: {
                AND: whereReview,
            },
            skip: skip * take,
            take,
            include: {
                customer: true,
                order: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const total = await prisma.review.count({
            where: {
                AND: whereReview,
            },
        });

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Reviews retrieved successfully",
            meta: {
                page: skip + 1,
                size: take,
                total,
                totalPage: Math.ceil(total / take),
            },
            data: result,
        });
    } catch (error) {
        next(error);
    }
};


// update review (admin)
export const updateReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviewId = Number(req.params.id);

        const existing = await prisma.review.findUnique({
            where: { id: reviewId },
        });

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
            });
        }

        const result = await prisma.review.update({
            where: { id: reviewId },
            data: req.body,
        });

        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// delete review
export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviewId = Number(req.params.id);

        const result = await prisma.review.delete({
            where: { id: reviewId },
        });

        res.status(200).json({
            success: true,
            message: "Review deleted successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
