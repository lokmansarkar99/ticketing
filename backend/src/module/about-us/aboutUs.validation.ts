import { Joi, validate } from "express-validation";

const aboutUsValidation = {
    body: Joi.object({
        image: Joi.string().required(),
    })
}

export const verifyAboutUs = validate(aboutUsValidation,{},{});

const aboutUsUpdateValidation = {
    body: Joi.object({
        image: Joi.string().optional(),
    })
}

export const verifyAboutUsUpdate = validate(aboutUsUpdateValidation,{},{});