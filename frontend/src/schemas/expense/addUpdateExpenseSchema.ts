import { z } from "zod";

const addUpdateExpenseSchema = z.object({
  coachConfigId: z
    .number()
    .nonnegative()
    .int()
    .min(1, { message: "Coach configuration is required" }),
  supervisorId: z
    .number()
    .nonnegative()
    .int()
    .min(1, { message: "Supervisor is required" }),
  expenseCategoryId: z
    .number()
    .nonnegative()
    .int()
    .min(1, { message: "Expense category is required" }),
  routeDirection: z.enum(["Up_Way", "Down_Way"], {
    errorMap: () => ({ message: "Route direction is required" }),
  }),
  amount: z
    .number()
    .nonnegative()
    .min(1, { message: "Expense amount is required" }),
  date: z
    .date()
    .refine((date) => date !== undefined, { message: "Date is required" }),
  file: z.string().optional(),
});

export type AddUpdateExpenseDataProps = z.infer<typeof addUpdateExpenseSchema>;
