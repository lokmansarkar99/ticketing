import { Joi, validate } from "express-validation";

const validationParams = {
    params: Joi.object({
        id: Joi.string().required(),
      }),
     
}
export const verifyParams = validate(validationParams);