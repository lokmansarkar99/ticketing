import { z } from "zod";

export const addUpdateOfferSchema = z
  .object({
    image: z
      .string()
      .nonempty("Image is required")
      .url("Invalid image URL"),

    title: z
      .string()
      .nonempty("Title is required")
      .max(100, "Title must be at most 100 characters"),

    description: z
      .string()
      .nonempty("Description is required")
      .max(500, "Description must be at most 500 characters"),

    startDate: z
      .string()
      .nonempty("Start date/time is required")
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid start date/time",
      }),

    endDate: z
      .string()
      .nonempty("End date/time is required")
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid end date/time",
      }),

    // ⭐ NEW FIELD 1: coupon code (optional or required)
    couponCode: z
      .string()
      .optional()
      .or(z.literal("")), // allows empty string if no coupon

    // ⭐ NEW FIELD 2: routeId (must be a number)
    routeId: z
      .number({
        required_error: "Route ID is required",
        invalid_type_error: "Route ID must be a number",
      })
      .int("Route ID must be an integer")
      .positive("Route ID must be positive"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date/time must be after start date/time",
    path: ["endDate"],
  });

export type AddUpdateOfferProps = z.infer<typeof addUpdateOfferSchema>;
