import { Joi, validate } from "express-validation";

const stationValidation = {
    body: Joi.object({
        name: Joi.string().required(),
        isSegment: Joi.boolean().optional(),
        isActive: Joi.boolean().optional(),
    })
}

export const verifyStation = validate(stationValidation);

const stationUpdateValidation = {
    body: Joi.object({
        name: Joi.string().optional(),
        isSegment: Joi.boolean().optional(),
        isActive: Joi.boolean().optional(),
    })
}

export const verifyStationUpdate = validate(stationUpdateValidation);