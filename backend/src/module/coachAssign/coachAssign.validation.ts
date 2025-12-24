import { Joi, validate } from "express-validation";

const coachAssignValidation = {
    body: Joi.object({
        userId: Joi.number().required(),
        counterId: Joi.number().required(),
        day: Joi.number().min(0).max(6).required(), // 0 = Sunday ... 6 = Saturday
        hour: Joi.number().min(0).max(23).required(),
        minute: Joi.number().min(0).max(59).required(),
        bookingRouteIds: Joi.array().items(Joi.number()).min(1).required(),
        sellingRouteIds: Joi.array().items(Joi.number()).min(1).required(),
    }),
};

export const verifyCoachAssign = validate(coachAssignValidation);

const coachAssignUpdateValidation = {
    body: Joi.object({
        counterId: Joi.number().optional(),
        userId: Joi.number().optional(),
        day: Joi.number().min(0).max(6).optional(),
        hour: Joi.number().min(0).max(23).optional(),
        minute: Joi.number().min(0).max(59).optional(),
        bookingRouteIds: Joi.array().items(Joi.number()).optional(),
        sellingRouteIds: Joi.array().items(Joi.number()).optional(),
    }),
};

export const verifyCoachAssignUpdate = validate(coachAssignUpdateValidation);
