import { Joi, validate } from "express-validation";

const OfferedValidation = {
    body: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        routeId: Joi.number().required(),
        couponCode: Joi.string().optional(),
    })
}

export const verifyOffered = validate(OfferedValidation);

const OfferedUpdateValidation = {
    body: Joi.object({
        title: Joi.string().optional(),
        description: Joi.string().optional(),
        image: Joi.string().optional(),
        startDate: Joi.date().optional(),
        endDate: Joi.date().optional(),
        routeId: Joi.number().optional(),
        couponCode: Joi.string().optional(),
    })
}

export const verifyOfferedUpdate = validate(OfferedUpdateValidation);