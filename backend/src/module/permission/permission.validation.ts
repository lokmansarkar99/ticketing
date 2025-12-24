import { Joi, validate } from "express-validation";

const PermissionValidation = {
    body: Joi.object({
        name: Joi.string().required(),
        permissionTypeId: Joi.number().required(),
    })
}

export const verifyPermission = validate(PermissionValidation);

const PermissionUpdateValidation = {
    body: Joi.object({
        name: Joi.string().optional(),
        permissionTypeId: Joi.number().optional(),
    })
}

export const verifyPermissionUpdate = validate(PermissionUpdateValidation);