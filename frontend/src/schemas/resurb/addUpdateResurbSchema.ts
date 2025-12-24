import { z } from "zod";

export const addUpdateResurbSchema = z.object({
  registrationNo: z.string().optional(),
  routeId: z.number().optional(),
  fromStationId: z.number({required_error:"From station is required"}),
  destinationStationId: z.number({required_error:"Destination station is required"}),

  noOfSeat: z
    .number({
      required_error: "Number of seats is required",
      invalid_type_error: "Number of seats must be a number",
    })
    .min(1, "Number of seats must be at least 1"),

  coachClass: z
    .enum(["E_Class", "B_Class", "S_Class", "Sleeper"])
    .optional(),

  fromDate: z.string().min(1, "From date is required"),
  fromDateTime: z.string().optional(),

  toDate: z.string().min(1, "To date is required"),
  toDateTime: z.string().optional(),

  passengerName: z.string().min(1, "Passenger name is required"),
  contactNo: z.string().min(1, "Contact number is required"),
  address: z.string().min(1, "Address is required"),

  amount: z.number().optional(),

  isConfirm: z.boolean().optional(),

  paidAmount: z
    .number({
      invalid_type_error: "Paid amount must be a number",
    })
    .min(0, "Paid amount must be at least 0")
    .optional(),

  dueAmount: z.number().optional(),

  remarks: z.string().optional(),
});

export type ReservationDataProps = z.infer<typeof addUpdateResurbSchema>;
