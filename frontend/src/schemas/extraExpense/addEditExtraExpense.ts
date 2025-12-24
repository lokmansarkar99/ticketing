import { z } from "zod";

export const AddEditExtraExpenseSchema = z.object({
  // name: z.string({ required_error: "Name is required" }).min(1, "Name is required"),
  expenseCategoryId: z
    .number({ required_error: "Expense category ID is required" })
    .int("Expense category ID must be an integer"),
  expenseSubCategoryId: z
    .number({ required_error: "Expense subcategory ID is required" })
    .int("Expense subcategory ID must be an integer"),
  totalAmount: z
    .number({ required_error: "Total amount is required" })
    .min(0, "Total amount must be a positive number"),
  date: z.string({ required_error: "Date is required" }),
  file: z.string().optional(),
  note: z.string().optional(),
  payments: z.array(
    z.object({
      accountId: z
        .number({ required_error: "Account ID is required" })
        .int("Account ID must be an integer"),
      paymentAmount: z
        .number({ required_error: "Payment amount is required" })
        .min(0, "Payment amount must be a positive number"),
    })
  ),
});

export type AddEditExtraExpenseSchemaDataProps = z.infer<typeof AddEditExtraExpenseSchema>;
