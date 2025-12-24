import z from "zod";

export const updatePermissionSchema = z.object({
  id: z.number().min(1, "id is required"),
  name: z.string().min(1, "Permission name is required"),
  permissionTypeId: z.number().min(1, "Permission type is required"),
});

export type UpdatePermissionDataProps = z.infer<typeof updatePermissionSchema>;
