import { Joi, validate } from "express-validation";

const reserveValidation = {
    body: Joi.object({
        registrationNo: Joi.string().optional(),
        routeId: Joi.number().optional(),
        fromStationId: Joi.number().required(),
        destinationStationId: Joi.number().required(),
        noOfSeat: Joi.number().required(),
        coachClass: Joi.string().optional().valid("E_Class", "B_Class", "S_Class", "Sleeper"),
        fromDate: Joi.string().required(),
        fromDateTime: Joi.string().optional(),
        toDate: Joi.string().required(),
        toDateTime: Joi.string().optional(),
        passengerName: Joi.string().required(),
        contactNo: Joi.string().required(),
        address: Joi.string().required(),
        amount: Joi.number().optional(),
        isConfirm: Joi.boolean().optional(),
        paidAmount: Joi.number().optional(),
        dueAmount: Joi.number().optional(),
        remarks: Joi.string().optional(),
    })
}

export const verifyReserve = validate(reserveValidation);

const reserveUpdateValidation = {
    body: Joi.object({
        registrationNo: Joi.string().optional(),
        routeId: Joi.number().optional(),
        fromStationId: Joi.number().optional(),
        destinationStationId: Joi.number().optional(),
        noOfSeat: Joi.number().optional(),
        coachClass: Joi.string().optional().valid("E_Class", "B_Class", "S_Class", "Sleeper"),
        fromDate: Joi.string().optional(),
        fromDateTime: Joi.string().optional(),
        toDate: Joi.string().optional(),
        toDateTime: Joi.string().optional(),
        from: Joi.string().optional(),
        to: Joi.string().optional(),
        passengerName: Joi.string().optional(),
        contactNo: Joi.string().optional(),
        address: Joi.string().optional(),
        amount: Joi.number().optional(),
        paidAmount: Joi.number().optional(),
        dueAmount: Joi.number().optional(),
        remarks: Joi.string().optional(),
    })
}

export const verifyReserveUpdate = validate(reserveUpdateValidation);