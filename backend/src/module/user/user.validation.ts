import { query } from "express"
import { Joi, validate } from "express-validation"

const userUpdateValidation = {
    body: Joi.object({
        userName: Joi.string().optional(),
        email: Joi.string().email().optional(),
        password: Joi.string().optional().min(6).max(12),
        contactNo: Joi.string().optional(),
        roleId: Joi.number().optional(),
        counterId: Joi.number().optional(),
        dateOfBirth: Joi.string().optional(),
        gender: Joi.string().optional().valid('Male', 'Female',),
        maritalStatus: Joi.string().optional().valid('Married', 'Unmarried'),
        bloodGroup: Joi.string().optional(),
        address: Joi.string().optional(),
        avatar: Joi.string().optional(),
        active: Joi.boolean().optional(),
        permission: Joi.object({
            aifs: Joi.boolean().required(),
            board: Joi.boolean().required(),
            canViewAllCoachInvoice: Joi.boolean().required(),
            bookingPermission: Joi.boolean().required(),
            ticketCancel: Joi.boolean().required(),
            seatTransfer: Joi.boolean().required(),
            coachActiveInActive: Joi.boolean().required(),
            blockDiscount: Joi.boolean().required(),
            showDiscountMenu: Joi.boolean().required(),
            showDiscountFromDate: Joi.date().required(),
            showDiscountEndDate: Joi.date().required(),
            isPrepaid: Joi.boolean().required(),
            vipSeatAllowToSale: Joi.boolean().required(),
            showOwnCounterBoardingPoint: Joi.boolean().required(),
            showOwnCounterSalesInTripSheet: Joi.boolean().required(),
        }).optional(),
    })
}

export const verifyUserUpdate = validate(userUpdateValidation)

const supervisorReportSubmitValidation = {
    body: Joi.object({
        tripNo: Joi.number().required(),
        supervisorId: Joi.number().required(),
        upWayCoachConfigId: Joi.number().required(),
        downWayCoachConfigId: Joi.number().required(),
        upWayDate: Joi.string().required(),
        downWayDate: Joi.string().required(),
        cashOnHand: Joi.number().required(),
        totalIncome: Joi.number().optional(),
        totalExpense: Joi.number().optional(),
    })
}

export const verifySupervisorReportSubmit = validate(supervisorReportSubmitValidation)
const counterReportSubmitValidation = {
    body: Joi.object({
        coachConfigId: Joi.number().required(),
    })
}

export const verifyCounterReportSubmit = validate(counterReportSubmitValidation)


const supervisorReportValidation = {
    query: Joi.object({
        upDate: Joi.string().required(),
        downDate: Joi.string().required(),
        supervisorId: Joi.number().required()
    })
}

export const verifySupervisorReport = validate(supervisorReportValidation, {}, {})


const SupervisorReportAuthorizeValidation = {
    body: Joi.object({
        accounts: Joi.array().required().items(Joi.object({
            accountId: Joi.number().required(),
            amount: Joi.number().required(),
        })),
    })
}

export const verifySupervisorReportAuthorize = validate(SupervisorReportAuthorizeValidation);