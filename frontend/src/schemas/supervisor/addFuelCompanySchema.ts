// src/schemas/addFuelCompanySchema.ts
import { z } from "zod";

export const addFuelCompanySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^[0-9]+$/, { message: "Phone must contain only numbers" }),
  email: z.string().nullable().optional(),
  website: z.string().optional(),
});

export type AddFuelCompanyData = z.infer<typeof addFuelCompanySchema>;
