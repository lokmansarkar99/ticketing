import z from "zod";

export const addUpdateScheduleSchema = z.object({
  time: z.string().min(1, "Time is required"),
});

export type AddUpdateScheduleDataProps = z.infer<
  typeof addUpdateScheduleSchema
>;
