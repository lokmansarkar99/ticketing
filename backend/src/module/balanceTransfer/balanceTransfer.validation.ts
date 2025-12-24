import { Joi, validate } from "express-validation";

const balanceTransferValidation = {
    body: Joi.object({
        fromAccountId: Joi.number().required(),
        toAccountId: Joi.number().required(),
        amount: Joi.number().required(),
    })
}

export const verifyBalanceTransfer = validate(balanceTransferValidation);
