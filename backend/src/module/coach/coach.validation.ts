import { Joi, validate } from "express-validation";

const coachValidation = {
  body: Joi.object({
    coachNo: Joi.string().required(),
    schedule: Joi.string().required(),
    routeId: Joi.number().required(),
    fromCounterId: Joi.number().required(),
    destinationCounterId: Joi.number().required(),
    seatPlanId: Joi.number().required(),
    coachClass: Joi.string().valid("E_Class", "B_Class", "S_Class","Sleeper").required(), 
    coachType: Joi.string().valid("AC", "Non AC").optional(),
    type: Joi.string().valid("Daily", "Weekly").optional(),
    holdingTime: Joi.string().optional(),
    fareAllowed: Joi.string().optional(),
    vipTimeOut: Joi.string().optional(),
    active: Joi.boolean().optional().default(true),
    routes: Joi.array()
      .items(
        Joi.object({
          counterId: Joi.number().required(),
          isBoardingPoint: Joi.boolean().required(),
          isDroppingPoint: Joi.boolean().required(),
          boardingTime: Joi.string().optional(),
          droppingTime: Joi.string().optional(),
          active: Joi.boolean().optional().default(true),
        })
      )
      .optional(),
  }),
};

export const verifyCoach = validate(coachValidation);

const coachUpdateValidation = {
  body: Joi.object({
    coachNo: Joi.string().optional(),
    schedule: Joi.string().optional(),
    routeId: Joi.number().optional(),
    fromCounterId: Joi.number().optional(),
    destinationCounterId: Joi.number().optional(),
    seatPlanId: Joi.number().optional(),
    coachClass: Joi.string().valid("E_Class", "B_Class", "S_Class","Sleeper").optional(),
    coachType: Joi.string().valid("AC", "Non AC").optional(),
    type: Joi.string().valid("Daily", "Weekly").optional(),
    holdingTime: Joi.string().optional(),
    fareAllowed: Joi.string().optional(),
    vipTimeOut: Joi.string().optional(),
    active: Joi.boolean().optional(),
    routes: Joi.array()
      .items(
        Joi.object({
          counterId: Joi.number().required(),
          isBoardingPoint: Joi.boolean().required(),
          isDroppingPoint: Joi.boolean().required(),
          boardingTime: Joi.string().optional(),
          droppingTime: Joi.string().optional(),
          active: Joi.boolean().optional(),
        })
      )
      .optional(),
  }),
};

export const verifyCoachUpdate = validate(coachUpdateValidation);
