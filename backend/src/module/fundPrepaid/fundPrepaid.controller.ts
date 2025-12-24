import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { Prisma } from "@prisma/client";

export const createFundPrepaid = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { paymentType, status, txId, amount, date } = req.body;
        const { id, permission } = req.user;
        if (!permission || !permission.isPrepaid) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'You have no permission to create Fund Prepaid'
            })
        }
        const newFundPrepaid = await prisma.fundPrepaid.create({
            data: {
                userId: id,
                paymentType,
                status,
                txId,
                amount,
                date,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Fund prepaid created successfully",
            data: newFundPrepaid,
        });
    } catch (error: any) {
        console.error("Error creating fund prepaid:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const getFundPrepaidAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.FundPrepaidWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { txId: { contains: search as string, } },
                ],
            });
        }
        const result = await prisma.fundPrepaid.findMany({
            where: {
                AND: whereCondition
            },
            include: {
                user: {
                    select: {
                        userName: true,
                        counter: {
                            select: {
                                name: true,
                            }
                        }
                    }
                }
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.fundPrepaid.count({
            where: {
                AND: whereCondition
            }
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Discount retrieved Success',
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
export const getFundPrepaidByCounterId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, counterId } = req.user;
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.FundPrepaidWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { txId: { contains: search as string, } },
                ],
            });
        }
        const result = await prisma.fundPrepaid.findMany({
            where: {
                user: {
                    counterId: counterId
                },
                AND: whereCondition
            },
            include: {
                user: {
                    select: {
                        userName: true,
                        counter: {
                            select: {
                                name: true,
                            }
                        }
                    }
                }
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.fundPrepaid.count({
            where: {
                userId: id,
                AND: whereCondition
            }
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Discount retrieved Success',
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



export const updateFundPrepaidStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Check if record exists
        const fundPrepaid = await prisma.fundPrepaid.findUnique({
            where: { id: Number(id) },
            include: {
                user: {
                    select: {
                        id: true,
                        counterId: true,
                    }
                }
            }
        });

        if (!fundPrepaid) {
            return res.status(404).json({
                success: false,
                message: "Fund prepaid not found",
            });
        }

        // Update status
        const updatedFundPrepaid = await prisma.fundPrepaid.update({
            where: { id: Number(id) },
            data: { status },
        });

        if (updatedFundPrepaid.status === "Verified") {
            const findCounter = await prisma.counter.findUnique({
                where: {
                    id: fundPrepaid.user.counterId
                }
            });
            if (findCounter) {
                findCounter.balance += updatedFundPrepaid.amount;
                await prisma.counter.update({
                    where: {
                        id: findCounter.id
                    },
                    data: {
                        balance: {
                            increment: updatedFundPrepaid.amount
                        }
                    }
                })
            }
        }

        return res.status(200).json({
            success: true,
            message: `Fund prepaid ${status.toLowerCase()} successfully`,
            data: updatedFundPrepaid,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const deleteFundPrepaid = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const fundPrepaid = await prisma.fundPrepaid.findUnique({
            where: { id: Number(id) },
        });

        if (!fundPrepaid) {
            return res.status(404).json({
                success: false,
                message: "Fund prepaid not found",
            });
        }

        // Delete record
        await prisma.fundPrepaid.delete({
            where: { id: Number(id) },
        });

        return res.status(200).json({
            success: true,
            message: "Fund prepaid deleted successfully",
        });
    } catch (error: any) {
        console.error("Error deleting fund prepaid:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};
