import { Joi, validate } from "express-validation";

const accountRegistration = {
    body: Joi.object({
        bankName: Joi.string().required(),
        accountHolderName: Joi.string().required(),
        accountName: Joi.string().required(),
        accountNumber: Joi.string().required(),
        accountType: Joi.string().required().valid('MobileBanking', 'Bank', 'Cash'),
        openingBalance: Joi.number().required(),
    })
}

export const verifyAccount = validate(accountRegistration, {}, {})

const accountUpdate = {
    body: Joi.object({
        bankName: Joi.string().optional().allow(''),
        accountHolderName: Joi.string().optional().allow(''),
        accountName: Joi.string().optional(),
        accountNumber: Joi.string().optional(),
        accountType: Joi.string().optional().valid('MobileBanking', 'Bank', 'Cash'),
    })
}

export const verifyUpdateAccount = validate(accountUpdate, {}, {})

const accountQuery = {
    query: Joi.object({
        type: Joi.string().required().valid('MobileBanking', 'Bank', 'Cash', 'All'),
    })
}

export const verifyAccountQuery = validate(accountQuery, {}, {})