import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { InvestType, Person } from "@prisma/client";

export const createInvestingIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { interest, note, investorId, investingBalances, investingType, payments } = req.body;
        const transaction = await prisma.$transaction(async (prisma) => {
            const findInvestor = await prisma.investor.findFirst({
                where: {
                    id: investorId
                }
            })
            if (!findInvestor) {
                return res.status(400).send({
                    success: false,
                    message: "Investor Not Found"
                })
            }

            const result = await prisma.investing.create({
                data: {
                    investorId,
                    investingBalances,
                    investingType,
                    type: "In",
                    interest,
                    note
                }
            })

            if (payments) {
                for (const payment of payments) {
                    await prisma.internalPayment.create({
                        data: {
                            investingId: result.id,
                            investorId: investorId,
                            accountId: payment.accountId,
                            paymentAmount: payment.paymentAmount,
                            type: "Credit",
                            subject: "Invest",
                            person: Person.Investor,
                        },
                    });
                    const findAccount = await prisma.account.findUnique({
                        where: {
                            id: payment.accountId
                        }
                    })
                    if (findAccount) {
                        let newBalance = findAccount?.currentBalance + payment.paymentAmount;
                        await prisma.account.update({
                            where: {
                                id: payment.accountId
                            },
                            data: {
                                currentBalance: newBalance
                            }
                        })
                    }
                }
            }

            if (result && investingBalances) {

                if (findInvestor.dueAmount && !findInvestor.advanceAmount) {
                    if (investingBalances <= findInvestor.dueAmount) {

                        await prisma.investor.update({
                            where: {
                                id: findInvestor.id
                            },
                            data: {
                                dueAmount: findInvestor.dueAmount - investingBalances
                            }
                        })
                    } else {
                        await prisma.investor.update({
                            where: {
                                id: findInvestor.id
                            },
                            data: {
                                dueAmount: 0,
                                advanceAmount: investingBalances - findInvestor.dueAmount
                            }
                        })
                    }
                } else if (!findInvestor.dueAmount && findInvestor.advanceAmount) {
                    await prisma.investor.update({
                        where: {
                            id: findInvestor.id
                        },
                        data: {
                            advanceAmount: findInvestor.advanceAmount + investingBalances
                        }
                    })


                } else if (!findInvestor.dueAmount && !findInvestor.advanceAmount) {

                    await prisma.investor.update({
                        where: {
                            id: findInvestor.id
                        },
                        data: {
                            advanceAmount: investingBalances
                        }
                    })
                }

            }
            return result;
        },
            {
                maxWait: 500000,
                timeout: 1000000,
            }
        )

        res.status(201).send({
            success: true,
            statusCode: 201,
            message: 'Investing In Created Done',
            data: transaction
        })
    }
    catch (err) {
        next(err)
    }
}



export const createInvestingOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { investorId, investingBalances, investingType, payments } = req.body;
        const transaction = await prisma.$transaction(async (prisma) => {
            const findInvestor = await prisma.investor.findFirst({
                where: {
                    id: investorId
                }
            })
            if (!findInvestor) {
                return res.status(400).send({
                    success: false,
                    message: "Investor Not Found"
                })
            }

            const result = await prisma.investing.create({
                data: {
                    investorId,
                    investingBalances,
                    investingType,
                    type: "Out"
                }
            })

            if (payments) {
                for (const payment of payments) {
                    const paymentResult = await prisma.internalPayment.create({
                        data: {
                            investingId: result.id,
                            investorId: investorId,
                            accountId: payment.accountId,
                            paymentAmount: payment.paymentAmount,
                            type: "Debit",
                            subject: "InvestOut",
                            person: Person.Investor,
                        },
                    });
                    const findAccount = await prisma.account.findUnique({
                        where: {
                            id: payment.accountId
                        }
                    })
                    if (findAccount) {
                        let newBalance = findAccount?.currentBalance - payment.paymentAmount;
                        await prisma.account.update({
                            where: {
                                id: payment.accountId
                            },
                            data: {
                                currentBalance: newBalance
                            }
                        })
                    }
                }
            }

            if (result && investingBalances) {








                if (findInvestor.dueAmount && !findInvestor.advanceAmount) {
                    await prisma.investor.update({
                        where: {
                            id: findInvestor.id
                        },
                        data: {
                            dueAmount: findInvestor.dueAmount + investingBalances
                        }
                    })
                } else if (!findInvestor.dueAmount && findInvestor.advanceAmount) {
                    if (investingBalances <= findInvestor.advanceAmount) {
                        await prisma.investor.update({
                            where: {
                                id: findInvestor.id
                            },
                            data: {
                                advanceAmount: findInvestor.advanceAmount - investingBalances
                            }
                        })
                    } else {
                        await prisma.investor.update({
                            where: {
                                id: findInvestor.id
                            },
                            data: {
                                advanceAmount: 0,
                                dueAmount: investingBalances - findInvestor.advanceAmount
                            }
                        })
                    }




                } else if (!findInvestor.dueAmount && !findInvestor.advanceAmount) {
                    await prisma.investor.update({
                        where: {
                            id: findInvestor.id
                        },
                        data: {
                            dueAmount: investingBalances
                        }
                    })
                }

            }
            return result;

        },
            {
                maxWait: 500000,
                timeout: 1000000,
            }
        )
        res.status(201).send({
            success: true,
            statusCode: 200,
            message: 'Investing out Created Done',
            data: transaction
        })
    }
    catch (err) {
        next(err)
    }
}


export const deleteInvesting = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const findInvesting = await prisma.investing.findFirst({
            where: {
                id: id
            }
        })
        const findInvestor = await prisma.investor.findFirst({
            where: {
                id: findInvesting?.investorId
            }
        })
        if (!findInvesting) {
            return res.status(404).send({
                success: false,
                message: 'Investing not fount',

            })
        }
        if (!findInvestor) {
            return res.status(404).send({
                success: false,
                message: 'Investor not fount',

            })
        }
        const investingBalances = findInvesting.investingBalances;
        if (findInvesting.type === "Out") {
            if (findInvestor.dueAmount && !findInvestor.advanceAmount) {
                if (investingBalances <= findInvestor.dueAmount) {
                    await prisma.investor.update({
                        where: {
                            id: findInvestor.id
                        },
                        data: {
                            dueAmount: findInvestor.dueAmount - investingBalances
                        }
                    })
                } else {
                    await prisma.investor.update({
                        where: {
                            id: findInvestor.id
                        },
                        data: {
                            dueAmount: 0,
                            advanceAmount: investingBalances - findInvestor.dueAmount
                        }
                    })
                }
            } else if (!findInvestor.dueAmount && findInvestor.advanceAmount) {
                await prisma.investor.update({
                    where: {
                        id: findInvestor.id
                    },
                    data: {
                        advanceAmount: findInvestor.advanceAmount + investingBalances
                    }
                })




            } else if (!findInvestor.dueAmount && !findInvestor.advanceAmount) {
                await prisma.investor.update({
                    where: {
                        id: findInvestor.id
                    },
                    data: {
                        advanceAmount: investingBalances
                    }
                })
            }
        } else {
            if (findInvestor.dueAmount && !findInvestor.advanceAmount) {
                await prisma.investor.update({
                    where: {
                        id: findInvestor.id
                    },
                    data: {
                        dueAmount: findInvestor.dueAmount + investingBalances
                    }
                })

            } else if (!findInvestor.dueAmount && findInvestor.advanceAmount) {
                if (investingBalances <= findInvestor.advanceAmount) {
                    await prisma.investor.update({
                        where: {
                            id: findInvestor.id
                        },
                        data: {
                            dueAmount: 0,
                            advanceAmount: findInvestor.advanceAmount - investingBalances
                        }
                    })
                } else {
                    await prisma.investor.update({
                        where: {
                            id: findInvestor.id
                        },
                        data: {
                            advanceAmount: 0,
                            dueAmount: investingBalances - findInvestor.advanceAmount
                        }
                    })
                }
            } else if (!findInvestor.dueAmount && !findInvestor.advanceAmount) {
                await prisma.investor.update({
                    where: {
                        id: findInvestor.id
                    },
                    data: {
                        dueAmount: investingBalances
                    }
                })
            }
        }
        const payments = await prisma.internalPayment.findMany({
            where: {
                investingId: id
            }
        })
        if (payments.length > 0) {
            for (const payment of payments) {
                const findAccount = await prisma.account.findFirst({
                    where: {
                        id: payment.accountId
                    }
                })
                if (!findAccount) {
                    return res.status(404).send({
                        success: false,
                        message: 'Account not fount',

                    })
                }
                if (findInvesting.type === 'In') {
                    await prisma.account.update({
                        where: {
                            id: findAccount.id
                        },
                        data: {
                            currentBalance: findAccount.currentBalance - payment.paymentAmount
                        }
                    })
                } else {
                    await prisma.account.update({
                        where: {
                            id: findAccount.id
                        },
                        data: {
                            currentBalance: findAccount.currentBalance + payment.paymentAmount
                        }
                    })
                }
            }
        }
        await prisma.internalPayment.deleteMany({
            where: {
                investingId: id
            }
        })
        const result = await prisma.investing.delete({ where: { id } })
        res.status(201).send({
            success: true,
            message: 'Investing delete Done',
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}


export const getInvesting = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { page, size, sortOrder, search, type } = req.query;
        let findType = type || InvestType.In

        if (typeof type === 'string') {
            findType = type
        } else {
            findType = InvestType.In
        }
        let skip = parseInt(page as string) - 1 || 0;
        const take = parseInt(size as string) || 10;
        const order =
            (sortOrder as string)?.toLowerCase() === "desc" ? "desc" : "asc";


        let result = await prisma.investing.findMany({
            where: {
                //@ts-ignore
                type: findType,
            },
            include: {
                investor: {
                    select: {
                        name: true,
                    }
                },
                InternalPayment: {
                    select: {
                        account: {
                            select: {
                                accountName: true,
                            }
                        }
                    }

                }
            },
            skip: skip * take,
            take,
        })
       let total = await prisma.investing.count()
        res.status(201).send({
            success: true,
            message: 'Investing get Done',
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