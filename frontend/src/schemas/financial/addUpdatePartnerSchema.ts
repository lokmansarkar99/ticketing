import { z } from "zod";
import { phoneNumberBaseSchema } from "../contact/addUpdateDriverSchema";

export const addEditPartnerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().optional(),
  phone: phoneNumberBaseSchema.min(1, "Phone is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

export type AddEditPartnerDataProps = z.infer<typeof addEditPartnerSchema>;
