import z from "zod";

export const addPermissionSchema = z.object({
  name: z.string().min(1, "Permission is required"),
  permissionTypeId: z.number({ required_error: "Type is required" }),
});

export type AddPermissionDataProps = z.infer<typeof addPermissionSchema>;
