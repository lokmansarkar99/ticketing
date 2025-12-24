import { Joi, validate } from "express-validation";

const investingValidation = {
    body: Joi.object({
        investorId: Joi.number().required(),
        investingBalances: Joi.number().required(),
        investingType: Joi.string().required().valid('Investing','BankLoan','KarzeHasana'),
        interest: Joi.number().optional(),
        note: Joi.string().optional(),
        payments: Joi.array().items(
            Joi.object({
                accountId: Joi.number().required(),
                paymentAmount: Joi.number().required(),
            })
        ).required(),
    })
}

export const verifyInvesting= validate(investingValidation, {}, {})
