import { z } from "zod";

const supervisorExpenseSchema = z
  .object({
    expenseType: z.enum(["Fuel", "Others"], {
      errorMap: () => ({ message: "Invalid expense type" }),
    }),
    fuelCompanyId: z.number().optional(),
    fuelWeight: z.number().optional(),
    fuelPrice: z.number().optional(),
    coachConfigId: z.number({
      required_error: "Coach Config ID is required",
    }),
    expenseCategoryId: z
      .number()
      .min(1, { message: "Expense Category ID is required" }),
    routeDirection: z.enum(["Up_Way", "Down_Way"], {
      errorMap: () => ({ message: "Invalid route direction" }),
    }),
    paidAmount: z
      .number({
        required_error: "Paid Amount is required",
      }),
    amount: z
      .number({
        required_error: "Amount is required",
      })
      .positive({ message: "Amount must be positive" }),
    date: z.string().nonempty("Date is required"),
    file: z.string().nonempty("File is required"),
  })
  .refine(
    (data) => {
      if (data.expenseType === "Fuel") {
        return (
          data.fuelCompanyId !== undefined &&
          data.fuelWeight !== undefined &&
          data.fuelPrice !== undefined
        );
      }
      return true; // Skip validation for non-Fuel types
    },
    {
      message:
        "Fuel expense requires fuel company ID, fuel weight, and fuel price",
      path: ["fuelCompanyId"], // Attach validation error to this field
    }
  );

export { supervisorExpenseSchema };
export type SupervisorExpenseData = z.infer<typeof supervisorExpenseSchema>;
