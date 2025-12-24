import { findCustomer } from './../order/order.controller';
import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { Prisma } from "@prisma/client";
import { sendSMS } from "../../utils/sendSMS";
import { createToken } from "../../utils/token.utils";
import bcrypt from "bcrypt";

function maskPhone(phone: string) {
    return `${phone.slice(0, 3)}******${phone.slice(phone.length - 2)}`;
}

export const customerChangePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { id } = req.user;
        const { newPassword } = req.body;
        const findCustomer = await prisma.customer.findUnique({ where: { id } })
        if (!findCustomer) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Customer Not Found"
            })
        }


        await prisma.customer.update({
            where: {
                id
            },
            data: {
                password: await bcrypt.hash(newPassword, 10)
            }
        })


        res.status(201).send({
            success: true,
            statusCode: 200,
            message: "Password Change Successfully",
        })
    }
    catch (err) {
        next(err)
    }
}

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { password, name, phone, email = "null" } = req.body;
        const isExistingPhone = await prisma.customer.findUnique({ where: { phone } })
        if (isExistingPhone) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Customer Phone Already Exist"
            })
        }
        const isExistingEmail = await prisma.customer.findFirst({
            where: {
                email: email
            }
        })
        if (isExistingEmail) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Customer Email Already Exist"
            })
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpToken = createToken({ otp, name, email, phone, password: await bcrypt.hash(password, 10) }, "OTP")
        await sendSMS(phone, `Your OTP is ${otp}`)

        res.status(201).send({
            success: true,
            statusCode: 200,
            message: maskPhone(phone),
            otpToken
        })
    }
    catch (err) {
        next(err)
    }
}
export const createCustomerWithOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { otp } = req.body;
        const { otp: setOtp, password, name, phone, email } = req.user;
        if (otp != setOtp) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "OTP does not match",
            })
        }
        const result = await prisma.customer.create({
            data: {
                name,
                phone,
                email,
                password
            }
        })

        const userInfo = {
            id: result.id,
            name,
            email,
            phone,
        }


        const accessToken = createToken(userInfo, "ACCESS")
        const refreshToken = createToken(userInfo, "REFRESH")

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            path: '/'
        })
        res.status(201).send({
            success: true,
            statusCode: 200,
            message: "Customer Create Success",
            accessToken
        })
    }
    catch (err) {
        next(err)
    }
}
export const loginWithOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { otp: setOtp, phone } = req.user;
        const { otp } = req.body;
        if (otp != setOtp) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "OTP does not match",
            })
        }
        let result = await prisma.customer.findFirst({
            where: {
                phone,
            }
        })
        if (!result) {
            result = await prisma.customer.create({
                data: {
                    phone,
                }
            })
        }

        const userInfo = {
            id: result.id,
            phone,
        }


        const accessToken = createToken(userInfo, "ACCESS")
        const refreshToken = createToken(userInfo, "REFRESH")

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            path: '/'
        })
        res.status(201).send({
            success: true,
            statusCode: 200,
            message: "Customer Login Success",
            accessToken
        })
    }
    catch (err) {
        next(err)
    }
}

export const requestOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { phone } = req.body;
        if (!phone) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Phone Number Required"
            })
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpToken = createToken({ otp, phone }, "OTP")
        await sendSMS(phone, `Your OTP is ${otp}`)

        res.status(201).send({
            success: true,
            statusCode: 200,
            message: maskPhone(phone),
            otpToken
        })
    }
    catch (err) {
        next(err)
    }
}


export const loginCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { credential, password } = req.body;
        let findUser = await prisma.customer.findFirst({ where: { phone: credential, isActive: true } })
        if (!findUser) {
            findUser = await prisma.customer.findFirst({ where: { email: credential, isActive: true } })
        }
        if (!findUser) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Customer Not Found"
            })
        }
        if (!findUser.password) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Please OTP Login First"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, findUser.password)


        if (!isPasswordCorrect) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Password Incorrect"
            })
        }


        const userInfo = {
            id: findUser.id,
            name: findUser.name,
            email: findUser.email,
            phone: findUser.phone,
        }


        const accessToken = createToken(userInfo, "ACCESS")
        const refreshToken = createToken(userInfo, "REFRESH")

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            path: '/'
        })

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Customer Login Successfully',
            accessToken
        })
    }
    catch (err) {
        next(err)
    }
}



export const getCustomerAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = (parseInt(page as string) - 1) || 0;
        const take = (parseInt(size as string)) || 10;
        const order = (sortOrder as string)?.toLowerCase() === 'desc' ? 'desc' : 'asc';
        const whereCondition: Prisma.CustomerWhereInput[] = []
        if (skip < 0) {
            skip = 0
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { name: { contains: search as string, } },
                    { phone: { contains: search as string, } },
                    { address: { contains: search as string, } },
                ],
            });
        }
        [];
        let result = await prisma.customer.findMany({
            where: {
                AND: whereCondition
            },
            select: {
                id: true,
                name: true,
                phone: true,
                address: true,
            },

            skip: skip * take,
            take,

        });

        let total = await prisma.customer.count();

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Get Customer All Successfully',
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
export const getCustomerOrderList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, size, sortOrder, search } = req.query;
        const { phone } = req.user;
        let skip = (parseInt(page as string) - 1) || 0;
        const take = (parseInt(size as string)) || 10;
        const order = (sortOrder as string)?.toLowerCase() === 'desc' ? 'desc' : 'asc';
        const whereCondition: Prisma.OrderWhereInput[] = []
        if (skip < 0) {
            skip = 0
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { customerName: { contains: search as string, } },
                    { phone: { contains: search as string, } },
                    { address: { contains: search as string, } },
                ],
            });
        }
        [];
        let result = await prisma.order.findMany({
            where: {
                phone,
                AND: whereCondition
            },
            include: {
                coachConfig: {
                    select: {
                        coach: true,
                    },

                },
                orderSeat: true,
            },

            skip: skip * take,
            take,

        });

        let total = await prisma.order.count({
            where: {
                phone,
                AND: whereCondition
            },
        });

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Get Customer Order All Successfully',
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


export const getCustomerSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await prisma.customer.findUnique({
            where: {
                id: Number(id)
            },

        })
        res.status(200).send({
            success: true,
            message: "Get Customer Success",
            statusCode: 200,
            data: result
        })
    }
    catch (err) {
        next(err)
    }
}

export const deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const result = await prisma.customer.delete({
            where: {
                id: Number(id)
            }
        })
        res.status(200).send({
            success: true,
            message: "Customer Delete Success",
            statusCode: 200,
        })
    }
    catch (err) {
        next(err)
    }
}

export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const findCustomer = await prisma.customer.findUnique({
            where: {
                id: Number(id)
            }
        })
        if (!findCustomer) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Customer Not Found'
            })
        }

        if (req.body.phone) {
            const findCustomerPhone = await prisma.customer.findUnique({
                where: {
                    phone: req.body.phone
                }
            })
            if (findCustomerPhone && findCustomer.id !== findCustomerPhone.id) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: 'Phone Number Already Exists'
                })
            }
        }
        const result = await prisma.customer.update({
            where: {
                id: Number(id)
            },
            data: req.body
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Customer Updated Success",
        })
    }
    catch (err) {
        next(err)
    }
}