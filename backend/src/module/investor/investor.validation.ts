import { Joi, validate } from "express-validation";

const investorValidation = {
    body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().optional(),
        phone: Joi.string().required(),
        address: Joi.string().optional(),
        city: Joi.string().optional(),
        postalCode: Joi.string().optional(),
        country: Joi.string().optional(),
    })
}

export const verifyInvestor = validate(investorValidation, {}, {})


const updateInvestorValidation = {
    body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().optional(),
        phone: Joi.string().required(),
        address: Joi.string().optional(),
        city: Joi.string().optional(),
        postalCode: Joi.string().optional(),
        country: Joi.string().optional(),
    })
}

export const verifyUpdateInvestor = validate(updateInvestorValidation)