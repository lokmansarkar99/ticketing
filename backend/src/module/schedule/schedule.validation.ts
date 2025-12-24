import { Joi, validate } from "express-validation";

const scheduleValidation = {
    body: Joi.object({
        time: Joi.string().required(),
    })
}

export const verifySchedule = validate(scheduleValidation);

const scheduleUpdateValidation = {
    body: Joi.object({
        time: Joi.string().required(),
    })
}

export const verifyScheduleUpdate = validate(scheduleUpdateValidation);