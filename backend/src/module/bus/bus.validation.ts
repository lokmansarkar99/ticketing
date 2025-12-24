import { Joi, validate } from "express-validation";

const BusValidation = {
    body: Joi.object({
        image: Joi.string().required(),
    })
}

export const verifyBus = validate(BusValidation);

const BusUpdateValidation = {
    body: Joi.object({
        image: Joi.string().required(),
    })
}

export const verifyBusUpdate = validate(BusUpdateValidation);