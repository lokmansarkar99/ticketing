import { z } from "zod";

export const loginSchema = z.object({
  userName: z.string().min(1, "Name is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginDataProps = z.infer<typeof loginSchema>;
