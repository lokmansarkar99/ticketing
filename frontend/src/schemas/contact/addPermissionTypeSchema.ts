import z from "zod";

export const addPermissionTypeSchema = z.object({
  name: z.string().min(1, "Permission is required"),
});

export type AddPermissionTypeDataProps = z.infer<
  typeof addPermissionTypeSchema
>;
