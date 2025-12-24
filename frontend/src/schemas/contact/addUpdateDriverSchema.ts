import { z } from "zod";
export const phoneNumberBaseSchema = z
  .string({
    invalid_type_error: "Phone number must be a string",
  })
  .regex(/^\d{11}$/, {
    // Exactly 11 digits
    message: "Phone number must be exactly 11 digits",
  });

export const addUpdateDriverSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().optional(),
  contactNo: phoneNumberBaseSchema.min(1, "Contact number is required"),
  dateOfBirth: z.date().nullable().optional(),
  gender: z.enum(["Male", "Female"]).optional(),
  maritalStatus: z.enum(["Married", "Unmarried"]).optional(),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
  avatar: z.string().optional(),
  licenseNumber: z
    .string({ required_error: "License number is required" })
    .min(1, "License number is required"),
  licenseIssueDate: z
    .string({
      required_error: "License issue date is required",
    })
    .min(1, "License issue date is required"),
  licenseExpDate: z
    .string({
      required_error: "License expire date is required",
    })
    .min(1, "License expire date is required"),
  licensePhoto: z
    .string({
      required_error: "License photo is required",
    })
    .min(1, "License photo is required"),
  emergencyNumber: z
    .string({
      required_error: "Emergency number is required",
    })
    .min(1, "Emergency number is required"),
  referenceBy: z
    .string({
      required_error: "Reference by is required",
    })
    .min(1, "Reference by is required"),
});

export type AddUpdateDriverDataProps = z.infer<typeof addUpdateDriverSchema>;
