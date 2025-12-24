import { Joi, validate } from "express-validation";

const BlogValidation = {
    body: Joi.object({
        title: Joi.string().required(),
        author: Joi.string().required(),
        categoryId: Joi.number().required(),
        content: Joi.string().required(),
        image: Joi.string().required(),
        seoTitle: Joi.string().optional().allow(""),
        seoDescription: Joi.string().optional().allow(""),
        status: Joi.string().required().valid("Draft", "Trust", "Published"),
    })
}

export const verifyBlog = validate(BlogValidation)


const BlogUpdateValidation = {
    body: Joi.object({
        title: Joi.string().optional(),
        author: Joi.string().optional(),
        categoryId: Joi.number().optional(),
        content: Joi.string().optional(),
        image: Joi.string().optional(),
        seoTitle: Joi.string().optional().allow(""),
        seoDescription: Joi.string().optional().allow(""),
        status: Joi.string().optional().valid("Draft", "Trust", "Published"),
    })
}

export const verifyBlogUpdate = validate(BlogUpdateValidation)