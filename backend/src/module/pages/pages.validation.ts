import { Joi, validate } from "express-validation";

const PagesValidation = {
    body: Joi.object({
        title: Joi.string().required(),
        slug: Joi.string().required(),
        content: Joi.string().required(),
        seoTitle: Joi.string().optional().allow(""),
        seoDescription: Joi.string().optional().allow(""),
        status: Joi.string().required().valid("Draft", "Trust", "Published"),
        type: Joi.string().required().valid("Policy", "Navigation"),
    })
}

export const verifyPages = validate(PagesValidation)


const PagesUpdateValidation = {
    body: Joi.object({
        title: Joi.string().optional(),
        slug: Joi.string().optional(),
        content: Joi.string().optional(),
        seoTitle: Joi.string().optional().allow(""),
        seoDescription: Joi.string().optional().allow(""),
        type: Joi.string().optional().valid("Policy", "Navigation"),
        status: Joi.string().optional().valid("Draft", "Trust", "Published"),
    })
}

export const verifyPagesUpdate = validate(PagesUpdateValidation)