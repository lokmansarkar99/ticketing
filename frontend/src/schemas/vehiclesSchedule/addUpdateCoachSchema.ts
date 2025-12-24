import { z } from "zod";

export const routeStationSchema = z.object({
  stationId: z.number().min(1, "Station ID is required"),
  isBoardingPoint: z.boolean(),
  isDroppingPoint: z.boolean(),
  schedule: z.string().min(1, "Schedule is required"),
  active: z.boolean(),
});

export const addUpdateCoachSchema = z.object({
  coachNo: z.string().min(1, "Coach number is required"),
  noOfSeat: z
    .number({
      required_error: "Number of seats is required",
      invalid_type_error: "Number of seats must be a number",
    })
    .min(1, "Number of seats must be at least 1"),
  routeId: z
    .number({ required_error: "Route is required" })
    .min(1, { message: "Route is required" }),
  schedule: z
    .string({ required_error: "Main schedule is required" })
    .min(1, { message: "Main schedule is required" }),
  routes: z
    .array(routeStationSchema)
    .min(1, "At least one route station is required")
    .refine(
      (routes) => routes.some((route) => route.isBoardingPoint),
      "At least one boarding point is required"
    )
    .refine(
      (routes) => routes.some((route) => route.isDroppingPoint),
      "At least one dropping point is required"
    ),
});

export type AddUpdateCoachDataProps = z.infer<typeof addUpdateCoachSchema>;