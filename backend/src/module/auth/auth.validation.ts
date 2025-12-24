import { Joi, validate } from "express-validation";

const userRegisterValidation = {
    body: Joi.object({
        userName: Joi.string().required(),
        email: Joi.string().email().optional(),
        password: Joi.string().required().min(6).max(12),
        contactNo: Joi.string().optional(),
        roleId: Joi.number().required(),
        counterId: Joi.number().required(),
        dateOfBirth: Joi.string().optional(),
        gender: Joi.string().optional().valid('Male', 'Female',),
        maritalStatus: Joi.string().optional().valid('Married', 'Unmarried'),
        bloodGroup: Joi.string().optional(),
        address: Joi.string().optional(),
        avatar: Joi.string().optional(),
        permission: Joi.object({
            aifs: Joi.boolean().required(),
            board: Joi.boolean().required(),
            canViewAllCoachInvoice: Joi.boolean().required(),
            bookingPermission: Joi.boolean().required(),
            ticketCancel: Joi.boolean().required(),
            seatTransfer: Joi.boolean().required(),
            coachActiveInActive: Joi.boolean().required(),
            blockDiscount: Joi.boolean().required(),
            showDiscountMenu: Joi.boolean().required(),
            showDiscountFromDate: Joi.date().required(),
            showDiscountEndDate: Joi.date().required(),
            isPrepaid: Joi.boolean().required(),
            vipSeatAllowToSale: Joi.boolean().required(),
            showOwnCounterBoardingPoint: Joi.boolean().required(),
            showOwnCounterSalesInTripSheet: Joi.boolean().required(),
        }).required(),
    })
}

export const verifyUserReg = validate(userRegisterValidation, {}, {})

const userLoginValidation = {
    body: Joi.object({
        userName: Joi.string().required(),
        password: Joi.string().required().min(6).max(12)
    })
}

export const verifyUserLogin = validate(userLoginValidation, {}, {})

const forgetValidation = {
    body: Joi.object({
        userName: Joi.string().required(),
    })
}

export const verifyForget = validate(forgetValidation, {}, {})

const otpValidation = {
    body: Joi.object({
        otp: Joi.number().required(),
        otpToken: Joi.string().required(),
    })
}

export const verifyOtpVerify = validate(otpValidation, {}, {})

const forgetChangePasswordValidation = {
    body: Joi.object({
        otp: Joi.number().required(),
        otpToken: Joi.string().required(),
        newPassword: Joi.string().required().min(6).max(12),
        confirmPassword: Joi.any()
            .equal(Joi.ref("newPassword"))
            .required()
            .label("Confirm password")
            .options({ messages: { "any.only": "{{#label}} does not match" } }),
    })
}

export const verifyForgetChangePassword = validate(forgetChangePasswordValidation, {}, {})

const changePasswordValidation = {
    body: Joi.object({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required().min(6).max(12),
        confirmPassword: Joi.any()
            .equal(Joi.ref("newPassword"))
            .required()
            .label("Confirm password")
            .options({ messages: { "any.only": "{{#label}} does not match" } }),
    })
}

export const verifyChangePassword = validate(changePasswordValidation, {}, {})