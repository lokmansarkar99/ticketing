import { Joi, validate } from "express-validation";

const customerRegisterValidation = {
    body: Joi.object({
        name: Joi.string().optional().allow(''),
        phone: Joi.string().required(),
        email: Joi.string().email().optional(),
        password: Joi.string().required().min(6).max(12),
    })
}

export const verifyCustomer = validate(customerRegisterValidation, {}, {})


const customerLoginValidation = {
    body: Joi.object({
        credential: Joi.string().required(),
        password: Joi.string().required().min(6).max(12),
    })
}

export const verifyCustomerLogin = validate(customerLoginValidation, {}, {})


const customerUpdateValidation = {
    body: Joi.object({
        name: Joi.string().optional(),
        email: Joi.string().optional(),
        address: Joi.string().optional(),
    })
}

export const verifyCustomerUpdate = validate(customerUpdateValidation, {}, {})

const requestOtpValidation = {
    body: Joi.object({
        phone: Joi.string().required(),
    })
}

export const verifyRequestOTP = validate(requestOtpValidation, {}, {})

const customerChangePasswordValidation = {
    body: Joi.object({
        newPassword: Joi.string().required(),
    })
}

export const verifyCustomerChangePassword = validate(customerChangePasswordValidation, {}, {})
