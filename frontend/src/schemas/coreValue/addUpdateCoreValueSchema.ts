import { z } from "zod";

export const addUpdateCoreValueSchema = z.object({
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
});

export type AddUpdateCoreValueProps = z.infer<typeof addUpdateCoreValueSchema>;
