import { Joi, validate } from "express-validation";

const rolePermissionValidation = {
    body: Joi.object({
        role: Joi.string().required().valid("Partner", "Admin", "Guest", ),
        permissionId: Joi.number().required()
    })
}

export const verifyRolePermission = validate(rolePermissionValidation)

const rolePermissionUpdateValidation = {
    body: Joi.object({
        role: Joi.string().optional().valid("Manager", "SuperVisor", "Accounts", ),
        permissionId: Joi.number().optional()
    })
}

export const verifyRolePermissionUpdate = validate(rolePermissionUpdateValidation)
