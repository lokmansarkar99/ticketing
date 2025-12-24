import { Request, Response, NextFunction } from "express";
import prisma from "../../utils/prisma";

// CREATE
export const createCoachAssignWithPermissions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, counterId, day, hour, minute, bookingRouteIds, sellingRouteIds } = req.body;

        // Prevent duplicate coach assign
        const exists = await prisma.coachAssignToCounterMaster.findUnique({
            where: { userId },
        });

        if (exists) {
            return res.status(409).send({
                success: false,
                statusCode: 409,
                message: "Coach already assigned for this user",
            });
        }

        const result = await prisma.coachAssignToCounterMaster.create({
            data: {
                userId,
                counterId,
                day,
                hour,
                minute,
                BookingRoutePermission: {
                    create: bookingRouteIds?.map((routeId: number) => ({ routeId })),
                },
                SellingRoutePermission: {
                    create: sellingRouteIds?.map((routeId: number) => ({ routeId })),
                },
            },
        });

        res.status(201).send({
            success: true,
            statusCode: 201,
            message: "Coach assign created successfully",
        });
    } catch (err) {
        next(err);
    }
};

// GET ALL
export const getAllCoachAssigns = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await prisma.coachAssignToCounterMaster.findMany({
            include: {
                user: {
                    select: {
                        userName: true,
                    }
                },
                counter: {
                    select: {
                        name: true,
                        address: true,
                    }
                },
                BookingRoutePermission: true,
                SellingRoutePermission: true,
            },
        });

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Coach assign list fetched successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

// GET SINGLE
export const getCoachAssignById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const result = await prisma.coachAssignToCounterMaster.findUnique({
            where: { id: Number(id) },
            include: {
                BookingRoutePermission: true,
                SellingRoutePermission: true,
            },
        });

        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: "Coach assign not found",
            });
        }

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Coach assign fetched successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

// UPDATE
export const updateCoachAssignWithPermissions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const {userId, counterId, day, hour, minute, bookingRouteIds, sellingRouteIds } = req.body;

        // Delete old permissions before inserting new
        await prisma.bookingRoutePermission.deleteMany({ where: { coachAssignId: Number(id) } });
        await prisma.sellingRoutePermission.deleteMany({ where: { coachAssignId: Number(id) } });

        const result = await prisma.coachAssignToCounterMaster.update({
            where: { id: Number(id) },
            data: {
                userId,
                counterId,
                day,
                hour,
                minute,
                BookingRoutePermission: {
                    create: bookingRouteIds?.map((routeId: number) => ({ routeId })),
                },
                SellingRoutePermission: {
                    create: sellingRouteIds?.map((routeId: number) => ({ routeId })),
                },
            },
            include: {
                user: true,
                counter: true,
                BookingRoutePermission: { include: { route: true } },
                SellingRoutePermission: { include: { route: true } },
            },
        });

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Coach assign updated successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

// DELETE
export const deleteCoachAssign = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        await prisma.bookingRoutePermission.deleteMany({ where: { coachAssignId: Number(id) } });
        await prisma.sellingRoutePermission.deleteMany({ where: { coachAssignId: Number(id) } });

        const result = await prisma.coachAssignToCounterMaster.delete({
            where: { id: Number(id) },
        });

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Coach assign deleted successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};
