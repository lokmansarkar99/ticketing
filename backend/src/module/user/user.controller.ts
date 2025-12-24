import { Collection } from './../../../node_modules/.prisma/client/index.d';
import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { Prisma, RouteDirection } from "@prisma/client";

export const getUserAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search, roleId, counterId, status, userName, contactNo, } = req.query;
        let skip = (parseInt(page as string) - 1) || 0;
        const take = (parseInt(size as string)) || 10;
        const order = (sortOrder as string)?.toLowerCase() === 'desc' ? 'desc' : 'asc';
        const whereCondition: Prisma.UserWhereInput[] = []
        if (skip < 0) {
            skip = 0
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { userName: { contains: search as string, } },
                    { email: { contains: search as string, } },
                    { contactNo: { contains: search as string, } },
                    { address: { contains: search as string, } },
                ],
            });
        }
        if (roleId) {
            whereCondition.push({
                roleId: Number(roleId)
            })
        }
        if (counterId) {
            whereCondition.push({
                counterId: Number(counterId)
            })
        }
        if (contactNo) {
            whereCondition.push({
                contactNo: contactNo as string
            })
        }
        if (userName) {
            whereCondition.push({
                userName: userName as string
            })
        }
        if (status) {
            whereCondition.push({
                active: status === "true"
            })
        }
        let total: number = 0;
        let result = await prisma.user.findMany({
            where: {
                role: {
                    name: {
                        not: "supervisor"
                    }
                },
                AND: whereCondition,
            },
            select: {
                id: true,
                userName: true,
                counterId: true,
                contactNo: true,
                active: true,
                role: true,
                avatar: true,
            },

            skip: skip * take,
            take,

        });

        total = await prisma.user.count({
            where: {
                AND: whereCondition,
            },
        });

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Get User All Successfully',
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
export const getGuideAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = (parseInt(page as string) - 1) || 0;
        const take = (parseInt(size as string)) || 10;
        const order = (sortOrder as string)?.toLowerCase() === 'desc' ? 'desc' : 'asc';
        const whereCondition: Prisma.UserWhereInput[] = []
        if (skip < 0) {
            skip = 0
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { userName: { contains: search as string, } },
                    { email: { contains: search as string, } },
                    { contactNo: { contains: search as string, } },
                    { address: { contains: search as string, } },
                ],
            });
        }
        [];
        let total: number = 0;
        let result = await prisma.user.findMany({
            where: {
                role: {
                    name: "supervisor"
                },
                AND: whereCondition,
            },
            select: {
                id: true,
                userName: true,
                counterId: true,
                contactNo: true,
                active: true,
                role: true,
                avatar: true,
            },

            skip: skip * take,
            take,

        });

        total = await prisma.user.count({
            where: {
                AND: whereCondition,
            },
        });

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Get User All Successfully',
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
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await prisma.user.findFirst({
            where: {
                id: Number(id)
            },
            select: {
                id: true,
                userName: true,
                email: true,
                role: true,
                contactNo: true,
                address: true,
                counter: true,
                active: true,
                avatar: true,
                dateOfBirth: true,
                maritalStatus: true,
                gender: true,
                bloodGroup: true,
                permission: true
            }
        })
        res.status(200).send({
            success: true,
            message: "Get User Success",
            statusCode: 200,
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const result = await prisma.user.delete({
            where: {
                id: Number(id)
            }
        })
        res.status(200).send({
            success: true,
            message: "User Delete Success",
            statusCode: 200,
        })
    }
    catch (err) {
        next(err)
    }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { permission, ...data } = req.body;
        const result = await prisma.user.update({
            where: {
                id: Number(id)
            },
            data: data,
            include: {
                permission: true
            }
        })
        if (permission) {
            if (result.permission) {
                await prisma.permissionUser.update({
                    where: {
                        id: result.permission.id
                    },
                    data: {
                        ...permission
                    }
                })
            } else {
                console.log({ permission })
                await prisma.permissionUser.create({
                    data: {
                        ...permission,
                        userId: result.id
                    }
                })
            }
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "User Updated Success",
        })
    }
    catch (err) {
        next(err)
    }
}

export const getBalance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { counterId } = req.user;
        const result = await prisma.counter.findFirst({
            where: {
                id: counterId
            },
            select: {
                balance: true,
            }
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Get Balance Success",
            data: result
        })
    }
    catch (err) {
        next(err)

    }
}
export const supervisorDashboardReport = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { upDate, downDate, supervisorId } = req.query;
        const upWayDate = upDate as string;
        const downWayDate = downDate as string;
        const supervisor = Number(supervisorId);
        const findUpWayCoach = await prisma.coachConfig.findFirst({
            where: {
                departureDate: upWayDate,
                supervisorId: supervisor,
            }
        })
        const findDownWayCoach = await prisma.coachConfig.findFirst({
            where: {
                departureDate: downWayDate,
                supervisorId: supervisor,
            }
        })
        if (!findUpWayCoach || !findDownWayCoach) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Coach Config Not found"
            })
        }
        let upWayCoachConfigId = findUpWayCoach.id;
        let downWayCoachConfigId = findDownWayCoach.id;
        let totalUpOpeningBalance = 0;
        let totalDownOpeningBalance = 0;
        let totalUpIncome = 0;
        let totalDownIncome = 0;
        let totalExpense = 0;
        let othersIncomeUpWay = 0;
        let othersIncomeDownWay = 0;
        const findOthersIncomeUpWay = await prisma.collection.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Up_Way",
                date: upWayDate,
                collectionType: "OthersIncome"
            },
            include: {
                counter: true,
            }
        })

        const findOthersIncomeDownWay = await prisma.collection.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Down_Way",
                date: downWayDate,
                collectionType: "OthersIncome"
            },
            include: {
                counter: true,
            }
        })
        console.log(findOthersIncomeDownWay)
        const findCollectionUpWay = await prisma.collection.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Up_Way",
                date: upWayDate,
                collectionType: "CounterCollection"
            },
            include: {
                counter: true,
            }
        })
        const findCollectionDownWay = await prisma.collection.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Down_Way",
                date: downWayDate,
                collectionType: "CounterCollection"
            },
            include: {
                counter: true,
            }
        })
        const findOpeningBalanceUpWay = await prisma.collection.findFirst({
            where: {
                supervisorId: supervisor,
                routeDirection: "Up_Way",
                date: upWayDate,
                collectionType: "OpeningBalance"
            },
            include: {
                counter: true,
            }
        })
        const findOpeningBalanceDownWay = await prisma.collection.findFirst({
            where: {
                supervisorId: supervisor,
                routeDirection: "Down_Way",
                date: downWayDate,
                collectionType: "OpeningBalance"
            },
            include: {
                counter: true,
            }
        })
        const findExpenseUpWay = await prisma.expense.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Up_Way",
                date: upWayDate,
            },
            include: {
                expenseCategory: true,
            }
        })
        const findExpenseDownWay = await prisma.expense.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Down_Way",
                date: downWayDate,
            },
            include: {
                expenseCategory: true,
            }
        })
        const upWayCollectionReport = findCollectionUpWay.map(col => {
            totalUpIncome += col.amount;
            return {
                counterName: col.counter?.address,
                amount: col.amount,
                routeDirection: col.routeDirection
            }
        })
        const upWayOthersIncomeReport = findOthersIncomeUpWay.map(col => {
            othersIncomeUpWay += col.amount;
            return {
                counterName: col.counter?.address,
                amount: col.amount,
                routeDirection: col.routeDirection,
                noOfPassenger: col.noOfPassenger,
            }
        })
        const downWayOthersIncomeReport = findOthersIncomeDownWay.map(col => {
            othersIncomeDownWay += col.amount;
            return {
                counterName: col.counter?.address,
                amount: col.amount,
                routeDirection: col.routeDirection,
                noOfPassenger: col.noOfPassenger,
            }
        })
        totalUpOpeningBalance += findOpeningBalanceUpWay?.amount || 0;
        const upWayOpeningBalanceReport = {

            counterName: findOpeningBalanceUpWay?.counter?.address,
            amount: findOpeningBalanceUpWay?.amount,
            routeDirection: findOpeningBalanceUpWay?.routeDirection

        }
        totalDownOpeningBalance += findOpeningBalanceDownWay?.amount || 0;
        const downWayOpeningBalanceReport =
        {
            counterName: findOpeningBalanceDownWay?.counter?.address,
            amount: findOpeningBalanceDownWay?.amount,
            routeDirection: findOpeningBalanceDownWay?.routeDirection
        }

        const downWayCollectionReport = findCollectionDownWay.map(col => {
            totalDownIncome += col.amount;
            return {
                counterName: col.counter?.address,
                amount: col.amount,
                routeDirection: col.routeDirection
            }
        })

        const expenseUpWayReport = findExpenseUpWay.map(ex => {
            upWayCoachConfigId = ex.coachConfigId;
            totalExpense += ex.amount;
            return {
                expenseCategory: ex.expenseCategory?.name,
                amount: ex.amount,
                routeDirection: ex.routeDirection
            }
        })
        const expenseDownWayReport = findExpenseDownWay.map(ex => {
            downWayCoachConfigId = ex.coachConfigId;
            totalExpense += ex.amount;
            return {
                expenseCategory: ex.expenseCategory?.name,
                amount: ex.amount,
                routeDirection: ex.routeDirection
            }
        })


        console.log(upWayCoachConfigId, downWayCoachConfigId)
        res.status(200).send({
            success: true,
            message: "Supervisor reported success!",
            statusCode: 200,
            data: {
                upDate,
                downDate,
                upWayCoachConfigId: upWayCoachConfigId,
                downWayCoachConfigId: downWayCoachConfigId,
                upWayTripNo: findUpWayCoach.tripNo,
                downWayTripNo: findDownWayCoach.tripNo,
                totalUpIncome,
                totalDownIncome,
                totalExpense,
                totalUpOpeningBalance,
                totalDownOpeningBalance,
                othersIncomeUpWay,
                othersIncomeDownWay,
                upWayCollectionReport,
                downWayCollectionReport,
                upWayOpeningBalanceReport,
                downWayOpeningBalanceReport,
                upWayOthersIncomeReport,
                downWayOthersIncomeReport,

                expenseReport: [...expenseUpWayReport, ...expenseDownWayReport]
            }
        })
    }
    catch (err) {
        next(err)
    }
}

export const createSupervisorReportSubmit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.user;
        const { ...data } = req.body;
        data.supervisorId = id;
        const findReport = await prisma.supervisorReportSubmit.findFirst({
            where: {
                supervisorId: id,
                upWayCoachConfigId: data.upWayCoachConfigId,
                downWayCoachConfigId: data.downWayCoachConfigId,
            }
        })
        // if (findReport) {
        //     return res.status(400).send({
        //         success: false,
        //         statusCode: 400,
        //         message: "Supervisor Report Already Submitted!"
        //     })
        // }
        const supervisorReport = await prisma.supervisorReportSubmit.create({ data });
        const findUpWayCoach = await prisma.coachConfig.findUnique({
            where: {
                id: supervisorReport.upWayCoachConfigId,
            }
        })
        const findDownWayCoach = await prisma.coachConfig.findUnique({
            where: {
                id: supervisorReport.upWayCoachConfigId,
            }
        })
        const totalCollectionUpWay = await prisma.collection.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                date: supervisorReport.upWayDate,
                coachConfigId: supervisorReport.upWayCoachConfigId,
            },
        });
        const totalExpenseUpWay = await prisma.expense.aggregate({
            _sum: {
                paidAmount: true,
            },
            where: {
                date: supervisorReport.upWayDate,
                coachConfigId: supervisorReport.upWayCoachConfigId,
            },
        });
        const totalCollectionDownWay = await prisma.collection.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                date: supervisorReport.upWayDate,
                coachConfigId: supervisorReport.upWayCoachConfigId,
            },
        });
        const totalExpenseDownWay = await prisma.expense.aggregate({
            _sum: {
                paidAmount: true,
            },
            where: {
                date: supervisorReport.upWayDate,
                coachConfigId: supervisorReport.upWayCoachConfigId,
            },
        });
        const totalUpWayIncome = totalCollectionUpWay._sum.amount
        const totalUpWayExpense = totalExpenseUpWay._sum.paidAmount
        const totalDownWayIncome = totalCollectionDownWay._sum.amount
        const totalDownWayExpense = totalExpenseDownWay._sum.paidAmount
        await prisma.trip.update({
            where: {
                id: findUpWayCoach?.tripNo as number
            },
            data: {
                totalIncome: {
                    increment: totalUpWayIncome || 0,
                },
                totalExpense: {
                    increment: totalUpWayExpense || 0,
                },
                cashOnHand: {
                    increment: (totalUpWayIncome || 0) - (totalUpWayExpense || 0),
                },
                tripStatus: "Close"
            }
        })
        await prisma.trip.update({
            where: {
                id: findDownWayCoach?.tripNo as number
            },
            data: {
                totalIncome: {
                    increment: totalDownWayIncome || 0,
                },
                totalExpense: {
                    increment: totalDownWayExpense || 0,
                },
                cashOnHand: {
                    increment: (totalDownWayIncome || 0) - (totalDownWayExpense || 0),
                },
                tripStatus: "Close"
            }
        })
        res.status(200).send({
            success: true,
            message: "Supervisor Report Submit Success!",
            statusCode: 200,
            data: supervisorReport
        })
    }
    catch (err) {
        next(err)
    }
}
export const authorizeSupervisorReportSubmit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.user;
        const reportId = Number(req.params.id);
        const { ...data } = req.body;
        let cashOnHand = 0
        for (const payment of data.accounts) {
            cashOnHand += payment.amount;
        }

        const findReport = await prisma.supervisorReportSubmit.findUnique({
            where: {
                id: reportId
            }
        })
        if (!findReport) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Report Not Found!"
            })
        }
        if (cashOnHand !== findReport.cashOnHand) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "cash on hand not match!"
            })
        }

        const supervisorReport = await prisma.supervisorReportSubmit.update({
            where: {
                id: reportId
            },
            data: {
                authorize: id,
                authorizeStatus: true,
            }
        });

        for (const payment of data.accounts) {
            await prisma.account.update({
                where: {
                    id: payment.accountId
                },
                data: {
                    currentBalance: {
                        increment: payment.amount
                    }
                }
            })
        }

        await prisma.collection.updateMany({
            where: {
                coachConfigId: findReport.upWayCoachConfigId,
            },
            data: {
                authorizeBy: id,
                authorizeStatus: true,
                edit: false
            }
        })
        await prisma.collection.updateMany({
            where: {
                coachConfigId: findReport.downWayCoachConfigId,
            },
            data: {
                authorizeBy: id,
                authorizeStatus: true,
                edit: false
            }
        })
        for (const pay of data.accounts) {
            await prisma.paymentAccounts.create({
                data: {
                    userId: id,
                    accountId: pay.accountId,
                    paymentAmount: pay.amount,
                    paymentType: "Supervisor",
                    paymentInOut: "IN",
                }
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Authorize Supervisor Report Success!",
        })
    }
    catch (err) {
        next(err)
    }
}

export const getSupervisorReportSubmit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fromDate = req.query.fromDate || new Date();
        const toDate = req.query.toDate || new Date();

        const startDate = new Date(fromDate.toString());
        const endDate = new Date(toDate.toString());
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        const result = await prisma.supervisorReportSubmit.findMany({
            where: {
                AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }],
            },
            include: {
                supervisor: {
                    select: {
                        userName: true,
                    },
                },
                upWayCoach: {
                    select: {
                        coach: true,
                        registrationNo: true,
                    }
                },
                downWayCoach: {
                    select: {
                        coach: true,
                        registrationNo: true,
                    }
                }

            },
            orderBy: {
                createdAt: 'desc',
            },
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "All Supervisor Report Submit retrieved Success",
            data: result,
        })
    }
    catch (err) {
        next(err)
    }
}
export const detailsSupervisorReportSubmit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findReport = await prisma.supervisorReportSubmit.findUnique({
            where: {
                id: id,
            },
            include: {
                authorizeBy: {
                    select: {
                        userName: true,
                    }
                }
            }
        })
        if (!findReport) {
            return res.status(404).send({
                success: false,
                message: "Supervisor Report not found",
                statusCode: 404,
            })
        }



        const upWayDate = findReport.upWayDate as string;
        const downWayDate = findReport.downWayDate as string;
        const supervisor = findReport.supervisorId;

        let totalUpOpeningBalance = 0;
        let totalDownOpeningBalance = 0;
        let totalUpIncome = 0;
        let totalDownIncome = 0;
        let totalExpense = 0;
        let othersIncomeUpWay = 0;
        let othersIncomeDownWay = 0;
        const findOthersIncomeUpWay = await prisma.collection.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Up_Way",
                date: upWayDate,
                collectionType: "OthersIncome"
            },
            include: {
                counter: true,
            }
        })
        const findOthersIncomeDownWay = await prisma.collection.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Down_Way",
                date: upWayDate,
                collectionType: "OthersIncome"
            },
            include: {
                counter: true,
            }
        })
        const findCollectionUpWay = await prisma.collection.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Up_Way",
                date: upWayDate,
                collectionType: "CounterCollection"
            },
            include: {
                counter: true,
            }
        })
        const findCollectionDownWay = await prisma.collection.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Down_Way",
                date: downWayDate,
                collectionType: "CounterCollection"
            },
            include: {
                counter: true,
            }
        })
        const findOpeningBalanceUpWay = await prisma.collection.findFirst({
            where: {
                supervisorId: supervisor,
                routeDirection: "Up_Way",
                date: upWayDate,
                collectionType: "OpeningBalance"
            },
            include: {
                counter: true,
            }
        })
        const findOpeningBalanceDownWay = await prisma.collection.findFirst({
            where: {
                supervisorId: supervisor,
                routeDirection: "Down_Way",
                date: downWayDate,
                collectionType: "OpeningBalance"
            },
            include: {
                counter: true,
            }
        })
        const findExpenseUpWay = await prisma.expense.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Up_Way",
                date: upWayDate,
            },
            include: {
                expenseCategory: true,
            }
        })
        const findExpenseDownWay = await prisma.expense.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Down_Way",
                date: downWayDate,
            },
            include: {
                expenseCategory: true,
            }
        })
        const upWayCollectionReport = findCollectionUpWay.map(col => {
            totalUpIncome += col.amount;
            return {
                counterName: col.counter?.address,
                amount: col.amount,
                routeDirection: col.routeDirection,
                file: col.file,
            }
        })
        const upWayOthersIncomeReport = findOthersIncomeUpWay.map(col => {
            othersIncomeUpWay += col.amount;
            return {
                counterName: col.counter?.address,
                amount: col.amount,
                routeDirection: col.routeDirection,
                noOfPassenger: col.noOfPassenger,
                file: col.file,
            }
        })
        const downWayOthersIncomeReport = findOthersIncomeDownWay.map(col => {
            othersIncomeDownWay += col.amount;
            return {
                counterName: col.counter?.address,
                amount: col.amount,
                routeDirection: col.routeDirection,
                noOfPassenger: col.noOfPassenger,
                file: col.file,
            }
        })
        totalUpOpeningBalance += findOpeningBalanceUpWay?.amount || 0;
        const upWayOpeningBalanceReport = {

            counterName: findOpeningBalanceUpWay?.counter?.address,
            amount: findOpeningBalanceUpWay?.amount,
            routeDirection: findOpeningBalanceUpWay?.routeDirection

        }
        totalDownOpeningBalance += findOpeningBalanceDownWay?.amount || 0;
        const downWayOpeningBalanceReport =
        {
            counterName: findOpeningBalanceDownWay?.counter?.address,
            amount: findOpeningBalanceDownWay?.amount,
            routeDirection: findOpeningBalanceDownWay?.routeDirection
        }

        const downWayCollectionReport = findCollectionDownWay.map(col => {
            totalDownIncome += col.amount;
            return {
                counterName: col.counter?.address,
                amount: col.amount,
                routeDirection: col.routeDirection,
                file: col.file,
            }
        })

        const expenseUpWayReport = findExpenseUpWay.map(ex => {
            totalExpense += ex.amount;
            return {
                expenseCategory: ex.expenseCategory?.name,
                amount: ex.amount,
                routeDirection: ex.routeDirection,
                file: ex.file,
            }
        })
        const expenseDownWayReport = findExpenseDownWay.map(ex => {
            totalExpense += ex.amount;
            return {
                expenseCategory: ex.expenseCategory?.name,
                amount: ex.amount,
                routeDirection: ex.routeDirection,
                file: ex.file,
            }
        })



        res.status(200).send({
            success: true,
            message: "Supervisor reported success!",
            statusCode: 200,
            data: {
                report: findReport,
                upWayCoachConfigId: findCollectionUpWay.length ? findCollectionUpWay[0]?.coachConfigId : null,
                downWayCoachConfigId: findCollectionDownWay.length ? findCollectionDownWay[0]?.coachConfigId : null,
                totalUpIncome,
                totalDownIncome,
                totalExpense,
                totalUpOpeningBalance,
                totalDownOpeningBalance,
                othersIncomeUpWay,
                othersIncomeDownWay,
                upWayCollectionReport,
                downWayCollectionReport,
                upWayOpeningBalanceReport,
                downWayOpeningBalanceReport,
                upWayOthersIncomeReport,
                downWayOthersIncomeReport,

                expenseReport: [...expenseUpWayReport, ...expenseDownWayReport]
            }
        })
    }
    catch (err) {
        next(err)
    }
}

export const counterReportSubmit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, counterId } = req.user;
        const { coachConfigId } = req.body;
        const findCoachConfig = await prisma.coachConfig.findUnique({
            where: {
                id: coachConfigId
            }
        })
        const findCounterReportSubmit = await prisma.counterReportSubmit.findFirst({
            where: {
                coachConfigId: coachConfigId,
                counterId,
            }
        })
        if (!findCoachConfig) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Coach Config Not Found'
            })
        }
        if (findCounterReportSubmit) {
            return res.status(404).send({
                success: false,
                statusCode: 400,
                message: 'This Counter Report Already Submitted!'
            })
        }
        if (!findCoachConfig.tripNo) {
            return res.status(400).send({
                success: false,
                statusCode: 404,
                message: 'This Coach Not Assign To Any Trip'
            })
        }
        const report = await prisma.order.aggregate({
            _sum: {
                noOfSeat: true,
                amount: true,
            },
            where: {
                coachConfigId: findCoachConfig.id,
                counterId: counterId,
            }
        })
        await prisma.counterReportSubmit.create({
            data: {
                userId: id,
                counterId: counterId,
                tripNo: findCoachConfig.tripNo as number,
                coachConfigId: findCoachConfig.id,
                date: findCoachConfig.departureDate,
                totalPassenger: report._sum.noOfSeat || 0,
                amount: report._sum.amount || 0,
            }
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Counter Report Submit Success'
        })
    }
    catch (err) {
        next(err)
    }
}


export const getCounterReportSubmit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fromDate = req.query.fromDate || new Date();
        const toDate = req.query.toDate || new Date();

        const startDate = new Date(fromDate.toString());
        const endDate = new Date(toDate.toString());
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        const result = await prisma.counterReportSubmit.findMany({
            where: {
                AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }],
            },
            include: {
                authorizeBy: {
                    select: {
                        userName: true,
                    },
                },
                coachConfig: {
                    select: {
                        coach: true,
                        registrationNo: true,
                    }
                },

            },
            orderBy: {
                createdAt: 'desc',
            },
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "All Counter Report Submit retrieved Success",
            data: result,
        })
    }
    catch (err) {
        next(err)
    }
}

export const authorizeCounterReportSubmit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.user;
        const reportId = Number(req.params.id);
        const { ...data } = req.body;
        let totalAmount = 0
        for (const payment of data.accounts) {
            totalAmount += payment.amount;
        }

        const findReport = await prisma.counterReportSubmit.findUnique({
            where: {
                id: reportId
            }
        })
        if (!findReport) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Report Not Found!"
            })
        }
        // if (findReport.authorizeStatus) {
        //     return res.status(400).send({
        //         success: false,
        //         statusCode: 400,
        //         message: "Already This Report Authorized!"
        //     })
        // }
        if (totalAmount !== findReport.amount) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Total Amount not match!"
            })
        }

        const supervisorReport = await prisma.counterReportSubmit.update({
            where: {
                id: reportId
            },
            data: {
                authorize: id,
                authorizeStatus: true,
            }
        });

        for (const payment of data.accounts) {
            await prisma.account.update({
                where: {
                    id: payment.accountId
                },
                data: {
                    currentBalance: {
                        increment: payment.amount
                    }
                }
            })
        }

        for (const pay of data.accounts) {
            await prisma.paymentAccounts.create({
                data: {
                    userId: id,
                    accountId: pay.accountId,
                    paymentAmount: pay.amount,
                    paymentType: "Counter",
                    paymentInOut: "IN",
                }
            })
        }

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Authorize Counter Report Success!",
        })
    }
    catch (err) {
        next(err)
    }
}