import { z } from "zod";

export const addUpdateSeatPlanSchema = z.object({
  name: z
    .string({ required_error: "Seat plan name is required" })
    .min(1, "Seat plan name is required")
    .max(100, "Seat plan name cannot exceed 100 characters"),
  
  noOfSeat: z
    .number({
      required_error: "Number of seats is required",
      invalid_type_error: "Number of seats must be a valid number",
    })
    .min(1, "Number of seats must be at least 1")
    .max(200, "Number of seats cannot exceed 200"),
});

export type AddUpdateSeatPlanDataProps = z.infer<typeof addUpdateSeatPlanSchema>;