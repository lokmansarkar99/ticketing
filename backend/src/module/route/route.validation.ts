import { Joi, validate } from "express-validation";

const routeValidation = {
    body: Joi.object({
        routeType: Joi.string().optional().valid("Local", "International"),
        routeDirection: Joi.string().optional().valid("Up_Way", "Down_Way"),
        kilo: Joi.number().optional(),
        isPassengerInfoRequired: Joi.boolean().optional(),
        via: Joi.string().optional(),
        from: Joi.number().required(),
        middle: Joi.number().optional(),
        to: Joi.number().required(),
        routeName: Joi.string().required(),
        viaStations: Joi.array().items(Joi.number().required(),).required(),
    })
}

export const verifyRoute = validate(routeValidation);


const routeUpdateValidation = {
    body: Joi.object({
        routeType: Joi.string().optional().valid("Local", "International"),
        routeDirection: Joi.string().optional().valid("Up_Way", "Down_Way"),
        kilo: Joi.number().optional(),
        isPassengerInfoRequired: Joi.boolean().optional(),
        via: Joi.string().optional(),
        from: Joi.number().optional(),
        middle: Joi.number().optional(),
        to: Joi.number().optional(),
        routeName: Joi.string().optional(),
        viaStations: Joi.array().items(Joi.number().optional(),).optional(),
    })
}

export const verifyRouteUpdate = validate(routeUpdateValidation);