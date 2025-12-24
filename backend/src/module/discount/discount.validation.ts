import { Joi, validate } from "express-validation";

const discountValidation = {
    body: Joi.object({
        title: Joi.string().required(),
        discountType: Joi.string().required().valid("Fixed", "Percentage"),
        discount: Joi.number().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
    })
}

export const verifyDiscount = validate(discountValidation);

const discountUpdateValidation = {
    body: Joi.object({
        title: Joi.string().optional(),
        discountType: Joi.string().optional().valid("Fixed", "Percentage"),
        discount: Joi.number().optional(),
        startDate: Joi.date().optional(),
        endDate: Joi.date().optional(),
    })
}

export const verifyDiscountUpdate = validate(discountUpdateValidation);