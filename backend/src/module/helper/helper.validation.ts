import { Joi, validate } from "express-validation";

const HelperRegisterValidation = {
    body: Joi.object({
        referenceBy: Joi.string().optional(),
        name: Joi.string().required(),
        email: Joi.string().email().optional(),
        contactNo: Joi.string().required(),
        emergencyNumber: Joi.string().required(),
        dateOfBirth: Joi.string().optional(),
        gender: Joi.string().optional().valid('Male', 'Female',),
        maritalStatus: Joi.string().optional().valid('Married', 'Unmarried'),
        bloodGroup: Joi.string().optional(),
        address: Joi.string().optional(),
        avatar: Joi.string().optional(),
    })
}

export const verifyHelperReg = validate(HelperRegisterValidation, {}, {})


const HelperUpdateValidation = {
    body: Joi.object({
        referenceBy: Joi.string().optional(),
        name: Joi.string().optional(),
        email: Joi.string().email().optional().allow(''),
        contactNo: Joi.string().optional(),
        emergencyNumber: Joi.string().optional(),
        dateOfBirth: Joi.string().optional().allow(''),
        gender: Joi.string().optional().valid('Male', 'Female',),
        maritalStatus: Joi.string().optional().valid('Married', 'Unmarried'),
        bloodGroup: Joi.string().optional().allow(''),
        address: Joi.string().optional().allow(''),
        avatar: Joi.string().optional(),
        active: Joi.boolean().optional(),
    })
}

export const verifyHelperUpdate = validate(HelperUpdateValidation, {}, {})
