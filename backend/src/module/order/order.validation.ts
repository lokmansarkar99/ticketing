import { Joi, validate } from "express-validation";

const orderValidation = {
    body: Joi.object({
        coachConfigId: Joi.number().required(),
        returnCoachConfigId: Joi.number().optional(),
        fromStationId: Joi.number().required(),
        destinationStationId: Joi.number().required(),
        counterId: Joi.number().optional(),
        userId: Joi.number().optional(),
        customerName: Joi.string().optional().allow(' '),
        orderType: Joi.string().required().valid("One_Trip", "Round_Trip"),
        phone: Joi.string().optional().allow(' '),
        email: Joi.string().optional().allow(' '),
        address: Joi.string().optional().allow(' '),
        age: Joi.string().optional().allow(' '),
        gender: Joi.string().optional().valid("Male", "Female"),
        nid: Joi.string().optional().allow(' '),
        nationality: Joi.string().optional().allow(' '),
        paymentMethod: Joi.string().required().allow(' '),
        paymentType: Joi.string().required().valid("FULL", "PARTIAL"),
        bookingType: Joi.string().required().valid("SeatIssue", "SeatBooking"),
        expiryBookingDate: Joi.string().optional(),
        expiryBookingTime: Joi.string().optional(),
        boardingPoint: Joi.string().required().allow(' '),
        droppingPoint: Joi.string().required().allow(' '),
        returnBoardingPoint: Joi.string().optional().allow(' '),
        returnDroppingPoint: Joi.string().optional().allow(' '),
        noOfSeat: Joi.number().required(),
        amount: Joi.number().required(),
        paymentAmount: Joi.number().optional(),
        date: Joi.string().required(),// date format Ex: yyyy-MM-dd
        returnDate: Joi.string().optional(),// date format Ex: yyyy-MM-dd
        seats: Joi.array().items(Joi.object({
            fromStationId: Joi.number().required(),
            destinationStationId: Joi.number().required(),
            class: Joi.string().optional().valid("E_Class", "B_Class", "S_Class", "Sleeper"),
            seat: Joi.string().required(),
            unitPrice: Joi.number().optional(),
            discount: Joi.number().optional(),
            fare: Joi.number().required(),
            coachConfigId: Joi.number().required(),
            schedule: Joi.string().optional().allow(null),
            date: Joi.string().required(),
        }).required()).required(),
    })
}

export const verifyOrder = validate(orderValidation);
const orderMigrateValidation = {
    body: Joi.object({
        coachConfigId: Joi.number().required(),
        fromStationId: Joi.number().required(),
        destinationStationId: Joi.number().required(),
        counterId: Joi.number().optional(),
        userId: Joi.number().optional(),
        customerName: Joi.string().optional().allow(' '),
        orderType: Joi.string().required().valid("One_Trip"),
        phone: Joi.string().optional().allow(' '),
        email: Joi.string().optional().allow(' '),
        address: Joi.string().optional().allow(' '),
        age: Joi.string().optional().allow(' '),
        gender: Joi.string().optional().valid("Male", "Female"),
        nid: Joi.string().optional().allow(' '),
        nationality: Joi.string().optional().allow(' '),
        paymentMethod: Joi.string().required().allow(' '),
        paymentType: Joi.string().required().valid("FULL", "PARTIAL"),
        bookingType: Joi.string().required().valid("SeatIssue",),
        boardingPoint: Joi.string().required().allow(' '),
        droppingPoint: Joi.string().required().allow(' '),
        noOfSeat: Joi.number().required(),
        amount: Joi.number().required(),
        paymentAmount: Joi.number().optional(),
        date: Joi.string().required(),
        cancelSeats: Joi.array().items(Joi.number().required()).required(),
        seats: Joi.array().items(Joi.object({
            fromStationId: Joi.number().required(),
            destinationStationId: Joi.number().required(),
            class: Joi.string().optional().valid("E_Class", "B_Class", "S_Class", "Sleeper"),
            seat: Joi.string().required(),
            unitPrice: Joi.number().optional(),
            discount: Joi.number().optional(),
            fare: Joi.number().required(),
            coachConfigId: Joi.number().required(),
            schedule: Joi.string().optional().allow(null),
            date: Joi.string().required(),
        }).required()).required(),
    })
}

export const verifyOrderMigrate = validate(orderMigrateValidation);

const orderUpdateValidation = {
    body: Joi.object({
        customerName: Joi.string().optional().allow(' '),
        phone: Joi.string().optional().allow(' '),
    })
}

export const verifyOrderUpdate = validate(orderUpdateValidation);

const cancelRequestValidation = {
    body: Joi.object({
        seats: Joi.array().items(Joi.number().required()).required(),
    })
}

export const verifyCancelRequest = validate(cancelRequestValidation);

const orderCancelValidation = {
    body: Joi.object({
        cancelNote: Joi.string().optional(),
        refundAmount: Joi.number().optional(),
        refundType: Joi.string().required().valid("NO_Charge", "No_Cancellation", "%_Of_Ticket_Fare")
    })
}

export const verifyOrderCancel = validate(orderCancelValidation);


const checkSeatAvailabilityValidation = {
    body: Joi.object({
        coachConfigId: Joi.number().required(),
        fromStationId: Joi.number().required(),
        destinationStationId: Joi.number().required(),
        seats: Joi.array().items(Joi.string().required()).required(),
    })
}

export const verifyCheckSeatAvailability = validate(checkSeatAvailabilityValidation);

const bookingSeat = {
    body: Joi.object({
        coachConfigId: Joi.number().required(),
        seat: Joi.string().required(),
    })
}

export const verifyBookingSeat = validate(bookingSeat);


const cancelBooking = {
    body: Joi.object({
        seats: Joi.array().items(Joi.object({
            seat: Joi.string().required(),
            coachConfigId: Joi.number().required(),
            fromStationId: Joi.number().required(),
            destinationStationId: Joi.number().required(),
        }).required()).required(),
    })
}

export const verifyCancelBooking = validate(cancelBooking);