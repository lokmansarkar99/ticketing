import { Joi, validate } from "express-validation";

const BlogCategoryValidation = {
    body: Joi.object({
        name: Joi.string().required()
    })
}

export const verifyBlogCategory = validate(BlogCategoryValidation)


const BlogCategoryUpdateValidation = {
    body: Joi.object({
        name: Joi.string().optional()
    })
}

export const verifyBlogCategoryUpdate = validate(BlogCategoryUpdateValidation)