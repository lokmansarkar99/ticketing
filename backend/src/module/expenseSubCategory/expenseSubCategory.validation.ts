import { Joi, validate } from "express-validation";

const expenseSubCategoryValidation = {
    body: Joi.object({
        name: Joi.string().required(),
        expenseCategoryId: Joi.number().required(),
    })
}

export const verifyExpenseSubCategory = validate(expenseSubCategoryValidation);

const expenseSubCategoryUpdateValidation = {
    body: Joi.object({
        name: Joi.string().required(),
        expenseCategoryId: Joi.number().required(),
    })
}

export const verifyExpenseSubCategoryUpdate = validate(expenseSubCategoryUpdateValidation);