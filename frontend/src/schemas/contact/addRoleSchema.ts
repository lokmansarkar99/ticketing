import z from "zod";

export const addRoleSchema = z.object({
  name: z.string().min(1, "Role is required"),
});

export type AddRoleDataProps = z.infer<typeof addRoleSchema>;
