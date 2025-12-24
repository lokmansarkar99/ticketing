import { z } from "zod";

export const addUpdateSliderSchema = z.object({

  image: z.string().min(1, "Image is required"), 
});

export type AddUpdateSliderProps = z.infer<typeof addUpdateSliderSchema>;
