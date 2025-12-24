import { Joi, validate } from "express-validation";

const sisterConcernValidation = {
    body: Joi.object({
        image: Joi.string().required(),
    })
}

export const verifySisterConcern = validate(sisterConcernValidation);

const sisterUpdateValidation = {
    body: Joi.object({
        image: Joi.string().required(),
    })
}

export const verifySisterConcernUpdate = validate(sisterUpdateValidation);