import { Joi, validate } from "express-validation";

const cmsValidation = {
    body: Joi.object({
        googleMap: Joi.string().optional(),
        loginPageImage: Joi.string().optional(),
        aboutUsContent: Joi.string().optional(),
        contactUsImage: Joi.string().optional(),
        locationImage: Joi.string().optional(),
        faqImage: Joi.string().optional(),
        policyImage: Joi.string().optional(),
        companyName: Joi.string().optional(),
        email: Joi.string().optional(),
        companyNameBangla: Joi.string().optional(),
        companyLogo: Joi.string().optional(),
        companyLogoBangla: Joi.string().optional(),
        footerLogo: Joi.string().optional(),
        footerLogoBangla: Joi.string().optional(),
        address: Joi.string().optional(),
        addressBangla: Joi.string().optional(),
        city: Joi.string().optional(),
        cityBangla: Joi.string().optional(),
        postalCode: Joi.string().optional(),
        supportNumber1: Joi.string().optional(),
        supportNumber2: Joi.string().optional(),
        offeredImageOne: Joi.string().optional(),
        offeredImageTwo: Joi.string().optional(),
        offeredImageThree: Joi.string().optional(),
        findTicketBanner: Joi.string().optional(),
        homePageDescription: Joi.string().optional(),
        homePageDescriptionBangla: Joi.string().optional(),
        facebook: Joi.string().optional(),
        instagram: Joi.string().optional(),
        twitter: Joi.string().optional(),
        linkedin: Joi.string().optional(),
        youtube: Joi.string().optional(),
        qrImage: Joi.string().optional(),
        blogImage: Joi.string().optional(),
    })
}

export const verifyCMS = validate(cmsValidation, {}, {})

