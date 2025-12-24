import { query } from "express";
import { Joi, validate } from "express-validation";

const paymentValidation = {
    body: Joi.object({
        registrationNo: Joi.string().required(),
        fuelCompanyId: Joi.number().required(),
        amount: Joi.number().required(),
        payments: Joi.array().items(Joi.object({
            accountId: Joi.number().required(),
            paymentAmount: Joi.number().required(),
        })),
    })
}

export const verifyPayment = validate(paymentValidation, {}, {})

const tripReportValidation = {
    query: Joi.object({
        fromDate: Joi.string().required(),
        toDate: Joi.string().required(),
        registrationNo: Joi.string().required(),
    })
}

export const verifyTripReport = validate(tripReportValidation, {}, {})