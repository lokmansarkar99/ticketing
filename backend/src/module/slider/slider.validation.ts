import { Joi, validate } from "express-validation";

const SliderValidation = {
    body: Joi.object({
        image: Joi.string().required(),
    })
}

export const verifySlider = validate(SliderValidation);
