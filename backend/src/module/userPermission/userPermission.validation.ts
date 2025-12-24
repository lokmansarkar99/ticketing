import { Joi, validate } from "express-validation";

const userPermissionValidation = {
    body: Joi.object({
        userId: Joi.number().required(),
        permissionId: Joi.number().required()
    })
}

export const verifyUserPermission = validate(userPermissionValidation)

const userPermissionUpdateValidation = {
    body: Joi.object({
        userId: Joi.number().optional(),
        permissionId: Joi.number().optional()
    })
}

export const verifyUserPermissionUpdate = validate(userPermissionUpdateValidation)
