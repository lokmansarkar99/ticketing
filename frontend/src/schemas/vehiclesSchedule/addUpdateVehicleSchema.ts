import { z } from "zod";

export const addUpdateVehicleSchema = z.object({
  registrationNo: z
    .string()
    .min(1, { message: "Registration number is required" }),
  seatPlan: z
    .string()
    .min(1, { message: "Seat plan is required" }),
  coachType: z
    .string()
    .min(1, { message: "Coach Type is required" }),
  registrationFile: z
    .string()
    .min(1, { message: "Registration file is required" }),
  fitnessCertificate: z
    .string()
    .min(1, { message: "Fitness certificate is required" }),
  taxToken: z.string().min(1, { message: "Tax token is required" }),
  routePermit: z.string().min(1, { message: "Route permit is required" }),
  manufacturerCompany: z.string().optional(),
  model: z.string().optional(),
  chasisNo: z.string().optional(),
  engineNo: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  lcCode: z.string().optional(),
  color: z.string().optional(),
  deliveryToDipo: z.string().optional(),
  deliveryDate: z.string().optional(),

  registrationExpiryDate: z.string().optional(),
  fitnessExpiryDate: z.string().optional(),
  routePermitExpiryDate: z.string().optional(),
  taxTokenExpiryDate: z.string().optional(),
  orderDate: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type AddUpdateVehicleDataProps = z.infer<typeof addUpdateVehicleSchema>;
