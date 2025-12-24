import { Joi, validate } from "express-validation";

const SubCategoryValidation = {
    body: Joi.object({
        name: Joi.string().required(),
    })
}

export const verifySubCategory = validate(SubCategoryValidation);

const SubCategoryUpdateValidation = {
    body: Joi.object({
        name: Joi.string().required(),
    })
}

export const verifySubCategoryUpdate = validate(SubCategoryUpdateValidation);