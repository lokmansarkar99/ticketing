import { z } from "zod";

/**
 * Schema for validating Sister Concern add/update form
 */
export const addUpdateSisterConcernSchema = z.object({
  image: z
    .string({
      required_error: "ছবি নির্বাচন করুন / Please select an image",
    })
    .min(1, "ছবি প্রয়োজন / Image is required"),
});

export type AddUpdateSisterConcernProps = z.infer<
  typeof addUpdateSisterConcernSchema
>;
