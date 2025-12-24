import { z } from "zod";

export const addUpdateCollectionSchema = z.object({
  coachConfigId: z
    .preprocess(
      (val) => (typeof val === "string" ? parseInt(val, 10) : val),
      z.number()
    )
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Coach Config ID must be greater than 0",
    }),

  counterId: z
    .preprocess(
      (val) => (typeof val === "string" ? parseInt(val, 10) : val),
      z.number()
    )
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Counter ID must be greater than 0",
    }),

  collectionType: z.enum(
    ["CounterCollection", "OpeningBalance", "OthersIncome"],
    {
      required_error: "Collection Type is required",
    }
  ),

  routeDirection: z.enum(["Up_Way", "Down_Way"], {
    required_error: "Route Direction is required",
  }),

  noOfPassenger: z
    .preprocess(
      (val) => (typeof val === "string" ? parseInt(val, 10) : val),
      z.number()
    )
    .optional(), // Make it optional for OpeningBalance, we'll validate later

  token: z.number().optional(),

  amount: z
    .preprocess(
      (val) => (typeof val === "string" ? parseInt(val, 10) : val),
      z.number()
    )
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Amount must be greater than 0",
    }),

  date: z.string().optional(),
  file: z.any().optional(), // Optional field
});

// No extra code below the schema definition that might be causing syntax errors.
export type AddUpdateCollectionDataProps = z.infer<
  typeof addUpdateCollectionSchema
>;
