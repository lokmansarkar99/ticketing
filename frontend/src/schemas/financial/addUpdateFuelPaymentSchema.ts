import { z } from "zod";


export const addUpdateFuelPaymentschema = z.object({
  registrationNo: z.string({
    required_error: "Registration number is required",
    invalid_type_error: "Registration number must be a string",
  }),
  fuelCompanyId: z.number({
    required_error: "Fuel company ID is required",
    invalid_type_error: "Fuel company ID must be a number",
  }),
  amount: z.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number",
  }),
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

export type addUpdateFuelPaymentschemaProps = z.infer<typeof addUpdateFuelPaymentschema>;
