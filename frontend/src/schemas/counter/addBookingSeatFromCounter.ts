import { z } from "zod";
import { phoneNumberBaseSchema } from "../contact/addUpdateDriverSchema";

export const addBookingSeatFromCounterSchema = z.object({
  // coachConfigId: z.number({required_error:"Coach configId is required"}),
  // fromStationId: z.number({required_error:"From station id is required"}),
  // destinationStationId: z.number({required_error:"Destination station id is required"}),
  returnCoachConfigId: z.number().optional(),
  counterId: z.number().optional(),
  userId: z.number().optional(),
  customerName: z.string().optional(),
  paymentType: z
    .enum(["FULL", "PARTIAL"], {
      errorMap: () => ({
        message: "Payment Type is required",
      }),
    })
    .or(z.literal("")),

  paymentAmount: z
    .preprocess(
      (value) => parseFloat(value as string),
      z.number().nonnegative("Partial payment amount must not be negative") // Allows 0 or positive numbers
    )
    .optional(),
  gender: z.enum(["Male", "Female"]).optional(),
  phone: phoneNumberBaseSchema.min(1, "Contact number is required"),

  email: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  nid: z.string().optional().or(z.literal("")),
  nationality: z.string().optional().or(z.literal("")),
  paymentMethod: z
    .string({ required_error: "Payment method is required" })
    .min(1, "Payment method is required"),
  boardingPoint: z
    .string({ required_error: "Boarding point is required" })
    .min(1, "Boarding point is required"),
  droppingPoint: z
    .string({ required_error: "Dropping point is required" })
    .min(1, "Dropping point is required"),
  returnDroppingPoint: z.string().optional(),
  returnBoardingPoint: z.string().optional(),
  noOfSeat: z
    .number({ required_error: "Number of seats is required" })
    .int()
    .positive("Number of seats is required"),
  amount: z
    .number({ required_error: "Payment amount is required" })
    .positive("Payment amount is required")
    .or(z.literal(0)),
  date: z
    .string({ required_error: "Date is required" })
    .min(1, "Date is required"),
  seats: z
    .array(
      z
        .string({ required_error: "Seats are required" })
        .min(1, "Seats are required")
    )
    .optional(),
});

export type addBookingSeatFromCounterProps = z.infer<
  typeof addBookingSeatFromCounterSchema
>;
