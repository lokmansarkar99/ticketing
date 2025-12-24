import { Joi, validate } from "express-validation";

const SeatPlanValidation = {
    body: Joi.object({
        name: Joi.string().required(),
        noOfSeat: Joi.number().required(),
    })
}

export const verifySeatPlan = validate(SeatPlanValidation);

const SeatPlanUpdateValidation = {
    body: Joi.object({
        name: Joi.string().required(),
        noOfSeat: Joi.number().required(),
    })
}

export const verifySeatPlanUpdate = validate(SeatPlanUpdateValidation);