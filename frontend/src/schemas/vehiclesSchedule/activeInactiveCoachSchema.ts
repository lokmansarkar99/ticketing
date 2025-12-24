import { z } from "zod";

export const activeInactiveCoachSchema = z.object({
  // Required coach number
  coachNo: z.string().min(1, { message: "Coach number is required" }),

  // Optional active flag, default true
  active: z.boolean().optional().default(true),

  // Optional departure dates array
  departureDates: z
    .array(z.string().min(1, { message: "Invalid date" }))
    .optional()
    .default([]),
});

export type IAddUpdateCoachConfigurationDataProps = z.infer<
  typeof activeInactiveCoachSchema
>;