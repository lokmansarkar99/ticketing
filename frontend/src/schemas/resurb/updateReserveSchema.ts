import { z } from "zod";

export const updateResurbSchema = z.object({
  registrationNo: z.string().min(1, "Registration number is required"),
  routeId: z.number({ required_error: "Route ID is required" }),

  noOfSeat: z
    .number({
      required_error: "Number of seats is required",
      invalid_type_error: "Number of seats must be a number",
    })
    .min(1, "Number of seats must be at least 1"),

  fromDate: z.string().min(1, "From date is required"),
  fromDateTime: z.string().min(1, "From date-time is required"),
  toDate: z.string().min(1, "To date is required"),
  toDateTime: z.string().min(1, "To date-time is required"),

  passengerName: z.string().min(1, "Passenger name is required"),
  contactNo: z.string().min(1, "Contact number is required"),
  address: z.string().min(1, "Address is required"),

  amount: z.number().min(1, { message: "Amount is required" }),

  paidAmount: z
    .number({
      required_error: "Paid amount is required",
      invalid_type_error: "Paid amount must be a number",
    })
    .min(0, "Paid amount must be at least 0"),

  remarks: z.string().optional(),
});

export type updateReservationDataProps = z.infer<typeof updateResurbSchema>;
