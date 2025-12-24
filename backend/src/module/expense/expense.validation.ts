import { Joi, validate } from "express-validation";

const expenseValidation = {
    body: Joi.object({
        expenseType: Joi.string().required().valid("Fuel", "Others"),
        fuelCompanyId: Joi.number().optional(),
        coachConfigId: Joi.number().required(),
        supervisorId: Joi.number().required(),
        expenseCategoryId: Joi.number().required(),
        routeDirection: Joi.string().required().valid("Up_Way", "Down_Way"),
        amount: Joi.number().required(),
        paidAmount: Joi.number().required(),
        dueAmount: Joi.number().required(),
        fuelWeight: Joi.number().optional(),
        fuelPrice: Joi.number().optional(),
        date: Joi.string().required(),
        file: Joi.string().optional(),
    })
}

export const verifyExpense = validate(expenseValidation);


const expenseUpdateValidation = {
    body: Joi.object({
        fuelCompanyId: Joi.number().optional(),
        coachConfigId: Joi.number().optional(),
        supervisorId: Joi.number().optional(),
        expenseCategoryId: Joi.number().optional(),
        routeDirection: Joi.string().optional().valid("Up_Way", "Down_Way"),
        amount: Joi.number().optional(),
        paidAmount: Joi.number().optional(),
        dueAmount: Joi.number().optional(),
        fuelWeight: Joi.number().optional(),
        fuelPrice: Joi.number().optional(),
        date: Joi.optional().optional(),
        file: Joi.string().optional(),
    })
}

export const verifyExpenseUpdate = validate(expenseUpdateValidation);


const expenseAuthorizeValidation = {
    body: Joi.object({
        edit: Joi.boolean().required(),
        accounts: Joi.array().optional().items(Joi.object({
            accountId: Joi.number().required(),
            amount: Joi.number().required(),
        })),

    })
}

export const verifyExpenseAuthorize = validate(expenseAuthorizeValidation);