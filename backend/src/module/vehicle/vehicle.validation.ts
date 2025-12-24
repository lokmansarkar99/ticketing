import { Joi, validate } from "express-validation";

const vehicleValidation = {
    body: Joi.object({
        registrationNo: Joi.string().required(),
        registrationFile: Joi.string().required(),
        registrationExpiryDate: Joi.string().required(),
        fitnessExpiryDate: Joi.string().required(),
        routePermitExpiryDate: Joi.string().required(),
        taxTokenExpiryDate: Joi.string().required(),
        fitnessCertificate: Joi.string().required(),
        taxToken: Joi.string().required(),
        routePermit: Joi.string().required(),
        manufacturerCompany: Joi.string().optional(),
        model: Joi.string().optional(),
        chasisNo: Joi.string().optional(),
        engineNo: Joi.string().optional(),
        countryOfOrigin: Joi.string().optional(),
        lcCode: Joi.string().optional(),
        color: Joi.string().optional(),
        deliveryToDipo: Joi.string().optional(),
        deliveryDate: Joi.string().optional(),
        orderDate: Joi.string().optional(),
        seatPlan: Joi.string().optional(),
        isActive: Joi.boolean().optional(),
        coachType: Joi.string().optional(),
    })
}

export const verifyVehicle = validate(vehicleValidation);

const vehicleUpdateValidation = {
    body: Joi.object({
        registrationNo: Joi.string().optional(),
        registrationFile: Joi.string().optional(),
        fitnessCertificate: Joi.string().optional(),
        taxToken: Joi.string().optional(),
        routePermit: Joi.string().optional(),
        manufacturerCompany: Joi.string().optional(),
        registrationExpiryDate: Joi.string().optional(),
        fitnessExpiryDate: Joi.string().optional(),
        routePermitExpiryDate: Joi.string().optional(),
        taxTokenExpiryDate: Joi.string().optional(),
        model: Joi.string().optional(),
        chasisNo: Joi.string().optional(),
        engineNo: Joi.string().optional(),
        countryOfOrigin: Joi.string().optional(),
        lcCode: Joi.string().optional(),
        color: Joi.string().optional(),
        deliveryToDipo: Joi.string().optional(),
        deliveryDate: Joi.string().optional(),
        orderDate: Joi.string().optional(),
        active: Joi.boolean().optional(),
        seatPlan: Joi.string().optional(),
        isActive: Joi.boolean().optional(),
        coachType: Joi.string().optional(),
    })
}

export const verifyVehicleUpdate = validate(vehicleUpdateValidation);