import { Joi, validate } from "express-validation";

const seatValidation = {
    body: Joi.object({
        name: Joi.string().required(),
    })
}

export const verifySeat = validate(seatValidation);

const seatUpdateValidation = {
    body: Joi.object({
        name: Joi.string().required(),
    })
}

export const verifySeatUpdate = validate(seatUpdateValidation);