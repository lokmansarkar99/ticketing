import { z } from "zod";

export const addEditPageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  status: z.enum(["Draft", "Trust", "Published"], {
    required_error: "Status is required",
    invalid_type_error: "Invalid status",
  }),
  type: z.enum(["Policy", "Navigation"], {
    required_error: "Type is required",
    invalid_type_error: "Invalid Type",
  }),
});

export type PageFormData = z.infer<typeof addEditPageSchema>;
