import { z } from "zod";

export const cancelRequestSchema = z.object({
  cancelNote: z.string().optional(),
  refundAmount: z.number().optional(),
  refundType: z.enum(["NO_Charge", "No_Cancellation", "%_Of_Ticket_Fare"], {
    required_error: "Refund type is required",
  }),
});

export type CancelRequestDataProps = z.infer<typeof cancelRequestSchema>;
