import { Joi, validate } from "express-validation";

const userStaticsValidation = {
    body: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required(),
    })
}

export const verifyUserStatics = validate(userStaticsValidation);

const userStaticsUpdateValidation = {
    body: Joi.object({
        title: Joi.string().optional(),
        description: Joi.string().optional(),
        image: Joi.string().optional(),
    })
}

export const verifyUserStaticsUpdate = validate(userStaticsUpdateValidation);