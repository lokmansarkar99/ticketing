import { Joi, validate } from "express-validation";

const coreValueValidation = {
    body: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required(),
    })
}

export const verifyCoreValue = validate (coreValueValidation);

const coreValueUpdateValidation = {
    body: Joi.object({
        title: Joi.string().optional(),
        description: Joi.string().optional(),
        image: Joi.string().optional(),
    })
}

export const verifyCoreValueUpdate = validate(coreValueUpdateValidation);