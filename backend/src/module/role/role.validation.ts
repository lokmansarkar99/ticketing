import { Joi, validate } from "express-validation";

const RoleValidation = {
    body: Joi.object({
        name: Joi.string().required(),
    })
}

export const verifyRole = validate(RoleValidation);

const RoleUpdateValidation = {
    body: Joi.object({
        name: Joi.string().required(),
    })
}

export const verifyRoleUpdate = validate(RoleUpdateValidation);