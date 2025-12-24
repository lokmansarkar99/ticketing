import { Joi, validate } from "express-validation";

const expenseAccountsValidation = {
    body: Joi.object({
        expenseCategoryId: Joi.number().required(),
        expenseSubCategoryId: Joi.number().required(),
        totalAmount: Joi.number().required(),
        date: Joi.date().required(),
        file: Joi.string().optional(),
        note: Joi.string().optional(),
        payments: Joi.array().items(Joi.object({
            accountId: Joi.number().required(),
            paymentAmount: Joi.number().required(),
        })),
    })
}

export const verifyExpenseAccounts = validate(expenseAccountsValidation)

