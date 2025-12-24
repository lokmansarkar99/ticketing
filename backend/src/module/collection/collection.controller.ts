import { NextFunction, Request, Response } from "express"
import prisma from "../../utils/prisma"
import { Prisma } from "@prisma/client"

export const createCollection = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await prisma.collection.create({
            data: req.body
        })
        await prisma.coachConfig.update({
            where: {
                id: result.coachConfigId
            },
            data: {
                tokenAvailable: {
                    decrement: result.token,
                }
            }
        })

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Collection Created Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const getCollectionAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.user;
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.CollectionWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { file: { contains: search as string, } },
                    { coachConfig: { coachNo: { contains: search as string, } } },
                    { counter: { name: { contains: search as string, } } },
                ],
            });
        }
        const result = await prisma.collection.findMany({
            where: {
                supervisorId: id,
                AND: whereCondition
            },
            include: {
                supervisor: {
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
                coachConfig: {
                    select: {
                        coachNo: true,
                        registrationNo: true,
                    }
                },
                authorize: {
                    select: {
                        userName: true,
                    }
                }
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.collection.count({
            where: {
                supervisorId: id,
                AND: whereCondition
            },
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Collection retrieved Success',
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
export const getCollectionAccountsDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const whereCondition: Prisma.CollectionWhereInput[] = [];

        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { file: { contains: search as string, } },
                ],
            });
        }
        const result = await prisma.collection.findMany({
            where: {
                AND: whereCondition,
                authorizeStatus: false,
            },
            include: {
                supervisor: {
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
                coachConfig: {
                    select: {
                        coachNo: true,
                        registrationNo: true,
                    }
                }
            },
            skip: skip * take,
            take,
        })
        const total = await prisma.collection.count({
            where: {
                AND: whereCondition,
                authorizeStatus: false,
            },
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Collection retrieved Success',
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

export const getCollectionSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const result = await prisma.collection.findUnique({
            where: {
                id
            },
            include: {
                supervisor: {
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
                coachConfig: {
                    select: {
                        coachNo: true,
                        registrationNo: true,
                    }
                }
            },
        })
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Collection Not Found'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Collection retrieved Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const deleteCollection = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findCollection = await prisma.collection.findUnique({
            where: {
                id
            },
        })
        if (!findCollection) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Collection Not Found'
            })
        }
        const result = await prisma.collection.delete({
            where: {
                id
            }
        })
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Collection Not Deleted'
            })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Collection Delete Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const updateCollection = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        const findCollection = await prisma.collection.findUnique({
            where: {
                id
            }
        })
        if (!findCollection) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Collection Not Found'
            })
        }

        if (!findCollection.edit) {
            return res.status(403).send({
                success: false,
                statusCode: 403,
                message: 'Collection cannot be updated'
            })
        }

        const result = await prisma.collection.update({
            where: {
                id,
            },
            data: req.body
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Collection Updated Success',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const authorizeCollection = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const collectionId = Number(req.params.id)
        const { edit, accounts } = req.body;
        if (edit) {
            await prisma.collection.update({
                where: {
                    id: collectionId
                },
                data: {
                    edit: true
                }
            })
        } else {
            if (!accounts.length) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: 'Accounts is required'
                })
            }

            const { id } = req.user;
            const findCollection = await prisma.collection.findUnique({
                where: {
                    id: collectionId
                }
            })
            if (!findCollection) {
                return res.status(404).send({
                    success: false,
                    statusCode: 404,
                    message: 'Collection Not Found'
                })
            }



            const result = await prisma.collection.update({
                where: {
                    id: collectionId,
                },
                data: {
                    authorizeStatus: true,
                    authorizeBy: id
                }
            })



            for (let acc of accounts) {
                const findAccount = await prisma.account.findUnique({
                    where: {
                        id: acc.accountId
                    }
                })
                if (!findAccount) {
                    return res.status(400).send({
                        success: false,
                        statusCode: 400,
                        message: 'Account not found'
                    })
                }
                if (result.collectionType === "CounterCollection") {
                    await prisma.account.update({
                        where: {
                            id: findAccount.id
                        },
                        data: {
                            currentBalance: {
                                increment: acc.amount
                            }
                        }
                    })
                } else {
                    await prisma.account.update({
                        where: {
                            id: findAccount.id
                        },
                        data: {
                            currentBalance: {
                                decrement: acc.amount
                            }
                        }
                    })
                }

            }

        }

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Collection Authorize Success',
        })
    }
    catch (err) {
        next(err)
    }
}