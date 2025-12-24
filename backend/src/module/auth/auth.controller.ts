import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import bcrypt from 'bcrypt'
import { createToken } from "../../utils/token.utils";
import sendEmailAndSms from "../../utils/SendEmailAndSms";
import sendMail from "../../utils/sendEmail";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { permission, ...data } = req.body;
        const isExistingUser = await prisma.user.findFirst({ where: { userName: req.body.userName } })
        const isExistingPhone = await prisma.user.findFirst({ where: { contactNo: (req.body.contactNo || "null") } })
        if (isExistingUser) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "User Already Exist"
            })
        }
        if (isExistingPhone) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "User Phone Already Exist"
            })
        }
        const bcryptPassword = await bcrypt.hash(req.body.password, 12)
        const userInfo = await prisma.user.create({
            data: { ...data, password: bcryptPassword },
            select: {
                id: true,
                userName: true,
                email: true,
                contactNo: true,
                address: true,
                role: true,
                avatar: true
            }
        });
        const permissionResult = await prisma.permissionUser.create({
            data: {
                ...permission,
                userId: userInfo.id
            }
        })

        const accessToken = createToken({ ...userInfo, ...permission }, "ACCESS")
        const refreshToken = createToken({ ...userInfo, ...permission }, "REFRESH")

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            path: '/'
        })
        res.status(201).send({
            success: true,
            statusCode: 201,
            message: 'User Created Successfully',
            accessToken
        })
    }
    catch (err) {
        next(err)
    }
}
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userName, password } = req.body;
        let findUser;
        findUser = await prisma.user.findFirst({ where: { userName, active: true }, include: { role: true, counter: true, permission: true, } })
        if (!findUser) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "User Not Found"
            })

        }
        if (findUser.blockDate) {
            //@ts-ignore
            const diffInMillis = new Date() - findUser.blockDate;

            const diffInMinutes = diffInMillis / (1000 * 60);
            const minute = parseInt(diffInMinutes.toString())
            if (minute < 15) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: `User Blocked Please Try Again After ${15 - minute} minutes`
                })
            }
        }
        const isPasswordCorrect = await bcrypt.compare(password, findUser.password)

        if (!isPasswordCorrect) {
            findUser = await prisma.user.update({
                where: {
                    id: findUser.id
                },
                data: {
                    count: findUser.count + 1
                }
            })
            if (findUser.count > 2) {
                findUser = await prisma.user.update({
                    where: {
                        id: findUser.id
                    },
                    data: {
                        blockDate: new Date()
                    }
                })
            }

            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Password Incorrect"
            })
        }



        const userInfo = {
            id: findUser.id,
            counterId: findUser.counterId,
            name: findUser.userName,
            email: findUser.email,
            address: findUser.address,
            counter: findUser.counter,
            contactNo: findUser.contactNo,
            role: findUser?.role.name,
            avatar: findUser.avatar || null,
            permission: findUser.permission
        }


        const accessToken = createToken(userInfo, "ACCESS")
        const refreshToken = createToken(userInfo, "REFRESH")

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            path: '/'
        })
        await prisma.user.update({
            where: {
                id: findUser.id
            },
            data: {
                count: 0,
                blockDate: null
            }
        })
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'User Login Successfully',
            accessToken
        })
    }
    catch (err) {
        next(err)
    }
}
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { newPassword, oldPassword } = req.body;
        const { id } = req.user;


        const user = await prisma.user.findFirst({ where: { id } })

        if (!user) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "User Not Found"
            })
        }
        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password)

        if (!isPasswordCorrect) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Password Incorrect"
            })
        }
        const bcryptPassword = await bcrypt.hash(newPassword, 12)

        await prisma.user.update({
            where: {
                id
            },
            data: {
                password: bcryptPassword
            }
        })


        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Password Change Successfully',
        })
    }
    catch (err) {

    }
}

const maskEmail = (email: string) => {
    const [localPart, domain] = email.split("@");
    const visiblePart = localPart.slice(0, 2);
    return `${visiblePart}***@${domain}`;
}

export default maskEmail

export const forgetPasswordRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userName } = req.body;
        const findUser = await prisma.user.findFirst({
            where: {
                userName
            }
        })
        if (!findUser) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "User Not Found"
            })
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const userInfo = {
            id: findUser.id,
            counterId: findUser.counterId,
            name: findUser.userName,
            email: findUser.email,
            address: findUser.address,
            contactNo: findUser.contactNo,
            avatar: findUser.avatar || null,
            otp,
        }
        const otpToken = createToken(userInfo, "OTP")
        await prisma.forgetOTP.deleteMany({
            where: {
                userName: findUser.userName
            }
        })
        await prisma.forgetOTP.create({
            data: {
                userName: findUser.userName,
                otp,
                token: otpToken as string,
            }
        })
        if (findUser.email) {
            await sendMail({ email: findUser.email, subject: "Forget Password Verification", message: `Your OTP is ${otp}` })
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'OTP Send Successfully',
            email: findUser.email ? maskEmail(findUser.email) : null,
            data: {
                otpToken
            }
        })
    } catch (err) {
        next(err)
    }
}
export const forgetOTPVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { otp, otpToken } = req.body;
        const findOtp = await prisma.forgetOTP.findFirst({
            where: {
                token: otpToken
            }
        })
        if (!findOtp) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "token invalid",
            })
        }
        if (otp !== findOtp.otp) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "OTP does not match",
            })
        }

        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'OTP Match Successfully',
        })
    } catch (err) {
        next(err)
    }
}
export const changePasswordInForgetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { otp, otpToken, newPassword } = req.body;
        const findOtp = await prisma.forgetOTP.findFirst({
            where: {
                token: otpToken
            }
        })
        if (!findOtp) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "token invalid",
            })
        }
        if (otp !== findOtp.otp) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "OTP does not match",
            })
        }


        await prisma.forgetOTP.delete({
            where: {
                id: findOtp.id,
            }
        })

        const user = await prisma.user.findFirst({ where: { userName: findOtp.userName } })

        if (!user) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "User Not Found"
            })
        }

        const bcryptPassword = await bcrypt.hash(newPassword, 12)

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                password: bcryptPassword
            }
        })


        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Password Change Successfully',
        })

    } catch (err) {
        next(err)
    }
}



