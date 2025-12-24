import z from "zod";

export const addUpdateSeatSchema = z.object({
  name: z.string().min(1, "Seat is required"),
});

export type AddUpdateSeatDataProps = z.infer<typeof addUpdateSeatSchema>;
