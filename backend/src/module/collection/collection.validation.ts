import { Joi, validate } from "express-validation";

const collectionValidation = {
    body: Joi.object({
        coachConfigId: Joi.number().required(),
        counterId: Joi.number().required(),
        supervisorId: Joi.number().required(),
        collectionType: Joi.string().required().valid("OthersIncome","CounterCollection", "OpeningBalance"),
        routeDirection: Joi.string().required().valid("Up_Way", "Down_Way"),
        noOfPassenger: Joi.number().required(),
        token: Joi.number().required(),
        amount: Joi.number().required(),
        date: Joi.string().required(),
        file: Joi.string().optional(),
    })
}

export const verifyCollection = validate(collectionValidation);

const collectionAuthorizeValidation = {
    body: Joi.object({
        edit: Joi.boolean().required(),
        accounts: Joi.array().optional().items(Joi.object({
            accountId: Joi.number().required(),
            amount: Joi.number().required(),
        })),
    })
}

export const verifyCollectionAuthorize = validate(collectionAuthorizeValidation);