import { Joi, validate } from "express-validation";

const fareValidation = {
    body: Joi.object({
        routeId: Joi.number().required(),
        type: Joi.string().required().valid("AC", "NON AC"),
        seatPlanId: Joi.number().required(),
        fromDate: Joi.date().optional(),
        toDate: Joi.date().optional(),
        segmentFare: Joi.array().items(
            Joi.object({
                fromStationId: Joi.number().required(),
                toStationId: Joi.number().required(),
                amount: Joi.number().required(),
                sleeper_class_amount: Joi.number().required(),
                b_class_amount: Joi.number().required(),
                e_class_amount: Joi.number().required(),
                isActive: Joi.boolean().optional(),
            })
        ).required(),
    })
}

export const verifyFare = validate(fareValidation);

const fareUpdateValidation = {
    body: Joi.object({
        routeId: Joi.number().optional(),
        type: Joi.string().optional().valid("AC", "NON AC"),
        seatPlanId: Joi.number().optional(),
        fromDate: Joi.date().optional(),
        toDate: Joi.date().optional(),
        segmentFare: Joi.array().items(
            Joi.object({
                id: Joi.number().required(),
                fromStationId: Joi.number().required(),
                toStationId: Joi.number().required(),
                amount: Joi.number().required(),
                sleeper_class_amount: Joi.number().required(),
                b_class_amount: Joi.number().required(),
                e_class_amount: Joi.number().required(),
                isActive: Joi.boolean().optional(),

            })
        ).optional(),
    })
}

export const verifyFareUpdate = validate(fareUpdateValidation);