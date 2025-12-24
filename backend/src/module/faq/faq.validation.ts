import { Joi, validate } from "express-validation";

const FaqValidation = {
    body: Joi.object({
        question: Joi.string().required(),
        answer: Joi.string().required(),
    })
}

export const verifyFaq = validate(FaqValidation);

const FaqUpdateValidation = {
    body: Joi.object({
        question: Joi.string().optional(),
        answer: Joi.string().optional(),
    })
}

export const verifyFaqUpdate = validate(FaqUpdateValidation);