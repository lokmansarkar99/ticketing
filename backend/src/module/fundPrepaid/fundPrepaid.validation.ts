import { Joi, validate } from "express-validation";

const fundPrepaidValidation = {
    body: Joi.object({
        paymentType: Joi.string().valid("NAGAD", "CHEQUE", "CASH", "BKASH").required(),
        txId: Joi.string().required(),
        amount: Joi.number().required(),
        date: Joi.date().required()
    }),
};

export const verifyFundPrepaid = validate(fundPrepaidValidation, {}, {});


export const updateFundPrepaidStatusValidation = {
  body: Joi.object({
    status: Joi.string().valid("Verified", "Cancelled").required()
  }),
};

export const verifyFundPrepaidStatus = validate(updateFundPrepaidStatusValidation, {}, {});

