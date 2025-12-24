import z from "zod";
export const addUpdateFinanceSchema = z.object({
  investorId: z.number().nonnegative().int().min(1, "Investor is required"),
  investingBalances: z
    .number()
    .nonnegative()
    .min(1, "Finance balance is required"),
  investingType: z.enum(["Investing", "BankLoan", "KarzeHasana"]),
  interest: z.number().optional(),
  note: z.string().optional(),
  payments: z
    .array(
      z.object({
        accountId: z.number().nonnegative().int().min(1, "Account is required"),
        paymentAmount: z.number().nonnegative().min(1, "Amount is required"),
      })
    )
    .nonempty(),
});
