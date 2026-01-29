import { z } from "zod";

export const addUpdateCoachConfigurationSchema = z.object({
  coachNo: z.string().min(1, { message: "Coach number is required" }),
  fromCounterId: z
    .number({ required_error: "Starting counter is required" })
    .min(1, { message: "Starting counter is required" }),
  destinationCounterId: z
    .number({ required_error: "Ending counter is required" })
    .min(1, { message: "Ending counter is required" }),
  schedule: z
    .string({ required_error: "Schedule is required" })
    .min(1, { message: "Schedule is required" }),
  routeId: z
    .number({ required_error: "Route is required" })
    .min(1, { message: "Route is required" }),
  coachType: z.enum(["AC", "Non AC"], {
    required_error: "Coach type is required",
  }),
  seatPlanId: z
    .number({ required_error: "Seat plan is required" })
    .min(1, { message: "Seat plan is required" }),
  coachClass: z.enum(["E_Class", "B_Class", "S_Class", "Sleeper"], {
    required_error: "Coach class is required",
  }),
  holdingTime: z.string().optional(),
  type: z.enum(["Daily", "Weekly"]).optional(),
  fareAllowed: z.string().optional(),
  vipTimeOut: z.string().optional(),

  // 🔹 active is now optional with default true
  active: z.boolean().optional().default(true),

  // 🔹 routes instead of counters
  routes: z
    .array(
      z.object({
        counterId: z
          .number({ required_error: "Counter ID is required" })
          .min(1, { message: "Counter ID is required" }),
        isBoardingPoint: z.boolean({
          required_error: "Boarding point status is required",
        }),
        isDroppingPoint: z.boolean({
          required_error: "Dropping point status is required",
        }),
        boardingTime: z
          .string({ required_error: "Boarding time is required" })
          .min(1, { message: "Boarding time is required" }),
        droppingTime: z
          .string({ required_error: "Dropping time is required" })
          .min(1, { message: "Dropping time is required" }),
        active: z.boolean().optional().default(true),
      })
    )
    .optional(),
});

export type IAddUpdateCoachConfigurationDataProps = z.infer<
  typeof addUpdateCoachConfigurationSchema
>;
