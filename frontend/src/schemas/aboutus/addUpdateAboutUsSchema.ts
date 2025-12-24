import { z } from "zod";

export const addUpdateAboutUsSchema = z.object({
  // description: z.string().min(1, "Description is required"),
  image: z.string().optional(),
  // images: z.array(z.instanceof(File)).optional(),
});

export type AboutUsSchemaProps = z.infer<typeof addUpdateAboutUsSchema>;
