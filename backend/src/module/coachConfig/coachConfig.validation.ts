import { query } from "express";
import { Joi, validate } from "express-validation";

const coachConfigValidation = {
    body: Joi.object({
        active: Joi.boolean().required(),
        coachNo: Joi.string().required(),
        departureDates: Joi.array().items(Joi.string().required()).required(), // date format Ex: yyyy-MM-dd
    })
}

export const verifyCoachConfig = validate(coachConfigValidation);

const coachConfigUpdateValidation = {
    body: Joi.object({
        coachNo: Joi.string().optional(),
        registrationNo: Joi.string().optional(),
        supervisorId: Joi.number().optional(),
        driverId: Joi.number().optional(),
        helperId: Joi.number().optional(),
        discount: Joi.number().optional(),
        discountType: Joi.string().optional().valid("Fixed", "Percentage"),
        tokenAvailable: Joi.number().optional(),
        coachType: Joi.string().optional().valid("AC", "NON AC"),
        coachClass: Joi.string().optional().valid("E_Class", "B_Class", "S_Class", "Sleeper"),
        supervisorStatus: Joi.string().optional().valid("Accepted", "Cancelled"),
        driverStatus: Joi.string().optional().valid("Accepted", "Cancelled"),
        helperStatus: Joi.string().optional().valid("Accepted", "Cancelled"),
        departureDate: Joi.string().optional(), // date format Ex: yyyy-MM-dd
        holdingTime: Joi.string().optional(),
        note: Joi.string().optional(),
        active: Joi.boolean().optional(),
    })
}

export const verifyCoachConfigUpdate = validate(coachConfigUpdateValidation);

const coachListValidation = {
    query: Joi.object({
        coachNo: Joi.string().optional().allow(""),
        schedule: Joi.string().optional().allow(""),
        fromStationId: Joi.string().required(),
        destinationStationId: Joi.string().required(),
        orderType: Joi.string().required().valid("One_Trip", "Round_Trip"),
        coachType: Joi.string().optional().valid("AC", "NON AC"),
        date: Joi.string().required(), // date format Ex: yyyy-MM-dd
        returnDate: Joi.string().optional(), // date format Ex: yyyy-MM-dd
    })
}

export const verifyCoachListGet = validate(coachListValidation);
const coachArrivedValidation = {
    body: Joi.object({
        coachConfigId: Joi.number().required(),
        type: Joi.string().required().valid("Arrived", "Departed")
    })
}

export const verifyCoachArrived = validate(coachArrivedValidation);