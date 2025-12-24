import { Joi, validate } from "express-validation";

const PermissionTypeValidation = {
    body: Joi.object({
        name: Joi.string().required(),
    })
}

export const verifyPermissionType = validate(PermissionTypeValidation);

const PermissionTypeUpdateValidation = {
    body: Joi.object({
        name: Joi.string().required(),
    })
}

export const verifyPermissionTypeUpdate = validate(PermissionTypeUpdateValidation);