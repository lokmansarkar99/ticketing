import { Joi, validate } from "express-validation";

const expenseCategoryValidation = {
    body: Joi.object({
        name: Joi.string().required(),
    })
}

export const verifyExpenseCategory = validate(expenseCategoryValidation);

const expenseCategoryUpdateValidation = {
    body: Joi.object({
        name: Joi.string().required(),
    })
}

export const verifyExpenseCategoryUpdate = validate(expenseCategoryUpdateValidation);