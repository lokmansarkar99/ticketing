import { z } from "zod";

export const addUpdateFareSchema = z.object({
  routeId: z
    .number({
      required_error: "Route ID is required",
      invalid_type_error: "Route ID must be a number",
    })
    .min(1, "Route ID is required"),

  type: z.enum(["AC", "NON AC"], {
    required_error: "Coach type is required",
  }),

  seatPlanId: z
    .number({
      required_error: "Seat plan ID is required",
      invalid_type_error: "Seat plan ID must be a number",
    })
    .min(1, "Seat plan ID is required"),

  fromDate: z.date().optional(),
  toDate: z.date().optional(),

  segmentFare: z
    .array(
      z.object({
        id:z.number().default(0).optional(),
        isActive: z.boolean().default(true).optional(),
        fromStationId: z.number({
          required_error: "From station is required",
          invalid_type_error: "From station must be a number",
        }),
        toStationId: z.number({
          required_error: "To station is required",
          invalid_type_error: "To station must be a number",
        }),
        amount: z.number({
          required_error: "Fare amount is required",
          invalid_type_error: "Fare amount must be a number",
        }),
        e_class_amount: z
          .number({
            invalid_type_error: "E-class amount must be a number",
          })
          .optional(), 
        sleeper_class_amount: z
          .number({
            invalid_type_error: "Sleeper amount must be a number",
          })
          .optional(), 
        b_class_amount: z
          .number({
            invalid_type_error: "B-class amount must be a number",
          })
          .optional(), 
      })
    )
    .min(1, "At least one segment fare is required"),
});

export type AddUpdateFareDataProps = z.infer<typeof addUpdateFareSchema>;
