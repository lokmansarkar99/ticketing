import z from "zod";

export const addUpdateStationSchema = z.object({
  name: z.string().min(1, "Station name is required"),
  isSegment: z.boolean().optional(), 
  isActive: z.boolean().optional(),
  id: z.number().optional(),
});

export type AddUpdateStationDataProps = z.infer<typeof addUpdateStationSchema>;
