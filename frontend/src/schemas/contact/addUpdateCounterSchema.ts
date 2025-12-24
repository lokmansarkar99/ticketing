import { z } from "zod";
import { phoneNumberBaseSchema } from "./addUpdateDriverSchema";

export const addUpdateCounterSchema = z
  .object({
    type: z.enum(["Own_Counter", "Commission_Counter", "Head_Office"], {
      errorMap: () => ({
        message: "Type is required",
      }),
    }),
    name: z.string().min(1, "Name is required"),
    address: z.string().min(1, "Address is required"),
    landMark: z.string().optional(),
    locationUrl: z.string().optional(),
    phone: z.string().optional(),
    mobile: phoneNumberBaseSchema.min(1, "Mobile is required"),
    fax: z.string().optional(),
    email: z.string().optional(),
    primaryContactPersonName: z
      .string()
      .min(1, "Primary contact person name is required"),
    country: z.string().optional(),
    stationId: z.number({
      required_error: "Station ID is required",
    }),
    status: z.boolean({
      required_error: "Status is required",
    }),

    // Ensure commissionType is always included in the data object
    commissionType: z
      .preprocess(
        (val) => (val === "" ? undefined : val),
        z.enum(["Fixed", "Percentage"]).optional()
      )
      .default(undefined), // Default to `undefined` if missing

    // Ensure commission is always included in the data object
    commission: z
      .preprocess((val) => {
        if (val === "" || val === null || val === undefined) return 0; // blank = 0
        if (typeof val === "string") return Number(val); // convert string to number
        return val;
      }, z.number().nonnegative("Commission must be 0 or a positive number"))
      .default(0),

    bookingAllowStatus: z
      .enum(["Coach_Wish", "Route_Wish", "Total"])
      .optional(),
    bookingAllowClass: z
      .enum(["B_Class", "E_Class", "S_Class", "Revolving", "Sleeper"])
      .optional(),
    zone: z.string().optional(),
    isSmsSend: z.boolean({
      required_error: "SMS send permission is required",
    }),
  })
  .superRefine((data, ctx) => {
    // Validate `commissionType` and `commission` only if `type` is "Commission_Counter"
    if (data.type === "Commission_Counter") {
      if (!data.commissionType) {
        ctx.addIssue({
          path: ["commissionType"],
          message: "Commission Type is required for Commission Counter",
          code: "custom",
        });
      }

      if (data.commission === undefined) {
        ctx.addIssue({
          path: ["commission"],
          message: "Commission is required for Commission Counter",
          code: "custom",
        });
      }
    }
  });

export type AddUpdateCounterDataProps = z.infer<typeof addUpdateCounterSchema>;
