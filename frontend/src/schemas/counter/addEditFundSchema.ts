import { z } from "zod";

export const paymentSchema = z
  .object({
    paymentType: z.enum(["NAGAD", "CHEQUE", "CASH", "BKASH"], {
      required_error: "Payment Type is required",
      invalid_type_error: "Invalid Payment Type",
    }),
    txId: z.string().min(1, "Transaction ID is required"),
    confirmTxId: z.string().min(1, "Confirm Transaction ID is required"),
    amount: z
      .number({ invalid_type_error: "Amount must be a number" })
      .positive("Amount must be greater than 0"),
    confirmAmount: z
      .number({ invalid_type_error: "Confirm Amount must be a number" })
      .positive("Confirm Amount must be greater than 0"),
    date: z
      .string()
      .min(1, "Payment Date is required")
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      }),
  })
  .refine((data) => data.txId === data.confirmTxId, {
    message: "Transaction IDs must match",
    path: ["confirmTxId"],
  })
  .refine((data) => data.amount === data.confirmAmount, {
    message: "Amounts must match",
    path: ["confirmAmount"],
  });

export type PaymentDataProps = z.infer<typeof paymentSchema>;
