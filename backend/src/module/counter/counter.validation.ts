import { Joi, validate } from "express-validation";

const counterValidation = {
    body: Joi.object({
        type: Joi.string().required().valid("Own_Counter", "Commission_Counter", "Head_Office"),
        name: Joi.string().required(),
        address: Joi.string().required(),
        landMark: Joi.string().optional(),
        locationUrl: Joi.string().optional(),
        phone: Joi.string().optional(),
        mobile: Joi.string().required(),
        fax: Joi.string().optional(),
        email: Joi.string().email().optional(),
        primaryContactPersonName: Joi.string().required(),
        country: Joi.string().optional(),
        stationId: Joi.number().required(),
        status: Joi.boolean().required(),
        commissionType: Joi.string().optional().valid("Fixed", "Percentage"),
        commission: Joi.number().optional(),
        bookingAllowStatus: Joi.string().optional().valid("Coach_Wish", "Route_Wish", "Total"),
        bookingAllowClass: Joi.string().optional().valid("B_Class", "E_Class", "Revolving", "Sleeper"),
        zone: Joi.string().optional(),
        isSmsSend: Joi.boolean().required(),
    })
}
export const verifyCounter = validate(counterValidation);

const counterUpdateValidation = {
    body: Joi.object({
        type: Joi.string().optional().valid("Own_Counter", "Commission_Counter", "Head_Office"),
        name: Joi.string().optional(),
        address: Joi.string().optional(),
        landMark: Joi.string().optional(),
        locationUrl: Joi.string().optional(),
        phone: Joi.string().optional(),
        mobile: Joi.string().optional(),
        fax: Joi.string().optional(),
        email: Joi.string().email().optional(),
        primaryContactPersonName: Joi.string().optional(),
        country: Joi.string().optional(),
        stationId: Joi.number().optional(),
        status: Joi.boolean().optional(),
        commissionType: Joi.string().optional().valid("Fixed", "Percentage"),
        commission: Joi.number().optional(),
        bookingAllowStatus: Joi.string().optional().valid("Coach_Wish", "Route_Wish", "Total"),
        bookingAllowClass: Joi.string().optional().valid("B_Class", "E_Class", "Revolving", "Sleeper"),
        zone: Joi.string().optional(),
        isSmsSend: Joi.boolean().optional(),
    })
}
export const verifyCounterUpdate = validate(counterUpdateValidation);
