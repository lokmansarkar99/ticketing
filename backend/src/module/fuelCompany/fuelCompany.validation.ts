import { Joi, validate } from "express-validation";

const fuelCompanyValidation = {
    body: Joi.object({
        name: Joi.string().required(),
        address: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string().optional().email(),
        website: Joi.string().optional(),
    })
}

export const verifyFuelCompany = validate(fuelCompanyValidation,{},{});

const fuelCompanyUpdateValidation = {
    body: Joi.object({
        name: Joi.string().optional(),
        address: Joi.string().optional(),
        phone: Joi.string().optional(),
        email: Joi.string().optional().email(),
        website: Joi.string().optional(),
    })
}

export const verifyFuelCompanyUpdate = validate(fuelCompanyUpdateValidation,{},{});