import z from "zod";

export const addAccountSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  accountHolderName: z.string().min(1, "Account holder name is required"),
  accountName: z.string().min(1, "Account name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  accountType: z.enum(["MobileBanking", "Bank", "Cash"], {
    errorMap: () => ({
      message: "Account type is required",
    }),
  }),
  openingBalance: z
    .number({
      required_error: "Opening balance is required",
      invalid_type_error: "Opening balance must be a number",
    })
    .min(1, "Opening balance is required"),
});

export type AddAccountDataProps = z.infer<typeof addAccountSchema>;

export const updateAccountSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  accountHolderName: z.string().min(1, "Account holder name is required"),
  accountName: z.string().min(1, "Account name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  accountType: z.enum(["MobileBanking", "Bank", "Cash"], {
    errorMap: () => ({
      message: "Account type is required",
    }),
  }),
});

export type UpdateAccountDataProps = z.infer<typeof updateAccountSchema>;
