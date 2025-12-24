import { Joi, validate } from "express-validation";

const ReviewCreateValidation = {
  body: Joi.object({
    customerId: Joi.number().required(),
    orderId: Joi.number().required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required(),
  }),
};

export const verifyReview = validate(ReviewCreateValidation);

const ReviewUpdateValidation = {
  body: Joi.object({
    rating: Joi.number().min(1).max(5).optional(),
    comment: Joi.string().optional(),
    status: Joi.string().valid("Pending", "Approved", "Rejected").optional(),
  }),
};

export const verifyReviewUpdate = validate(ReviewUpdateValidation);
