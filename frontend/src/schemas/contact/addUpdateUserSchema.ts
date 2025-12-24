import { z } from "zod";


export const addUserSchema = z
  .object({
    userName: z.string().min(1, "Name is required"),
    email: z.string().optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(12, "Password must be at most 12 characters long")
      .min(1, "Password is required"),
    rePassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(12, "Password must be at most 12 characters long")
      .min(1, "Password is required"),
    contactNo: z.string().min(1, "Contact No is required"),

    roleId: z.number({
      required_error: "Role is required",
    }),
    counterId: z.number({
      required_error: "Counter is required",
    }),
    dateOfBirth: z.string().optional(),
    gender: z.enum(["Male", "Female"]).optional(),
    maritalStatus: z.enum(["Married", "Unmarried"]).optional(),
    bloodGroup: z.string().optional(),
    address: z.string().optional(),
    avatar: z.string().optional(),

    // ✅ Permission added here
    permission: z.object({
      board: z.boolean(),
      canViewAllCoachInvoice: z.boolean(),
      bookingPermission: z.boolean(),
      ticketCancel: z.boolean(),
      seatTransfer: z.boolean(),
      coachActiveInActive: z.boolean(),
      blockDiscount: z.boolean(),
      showDiscountMenu: z.boolean(),
      vipSeatAllowToSale: z.boolean(),
      isPrepaid: z.boolean(),
      showOwnCounterBoardingPoint: z.boolean(),
      showOwnCounterSalesInTripSheet: z.boolean(),
      aifs: z.boolean(),
      showDiscountFromDate: z.string(),
      showDiscountEndDate: z.string(),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.rePassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["rePassword"],
      });
    }
  });


export type AddUserDataProps = z.infer<typeof addUserSchema>;

export const updateUserSchema = z.object({
  userName: z.string().min(1, "Name is required"),
  email: z.string().optional(),
  contactNo: z.string().optional(),
  dateOfBirth: z.string().nullable(),
  gender: z.enum(["Male", "Female"]).optional(),
  maritalStatus: z.enum(["Married", "Unmarried"]).optional(),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
  avatar: z.string().optional(),
  roleId: z.number({
    required_error: "Role is required",
  }),
  counterId: z.number({
    required_error: "Counter is required",
  }),
  // ✅ Permission added here
  permission: z.object({
    board: z.boolean(),
    canViewAllCoachInvoice: z.boolean(),
    bookingPermission: z.boolean(),
    ticketCancel: z.boolean(),
    seatTransfer: z.boolean(),
    coachActiveInActive: z.boolean(),
    blockDiscount: z.boolean(),
    showDiscountMenu: z.boolean(),
    vipSeatAllowToSale: z.boolean(),
    isPrepaid: z.boolean(),
    showOwnCounterBoardingPoint: z.boolean(),
    showOwnCounterSalesInTripSheet: z.boolean(),
    aifs: z.boolean(),
    showDiscountFromDate: z.string(),
    showDiscountEndDate: z.string(),
  }),
});

export type UpdateUserDataProps = z.infer<typeof updateUserSchema>;

export const updatePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters long")
      .max(12, "New password must be at most 12 characters long")
      .min(1, "New password is required"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters long")
      .max(12, "Confirm password must be at most 12 characters long")
      .min(1, "Confirm password is required"),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "New & confirm passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export type UpdatePasswordDataProps = z.infer<typeof updatePasswordSchema>;

export const updateUserProfileSchema = z.object({
  userName: z.string().min(1, "Name is required"),
  contactNo: z.string().optional(),
  email: z.string().optional(),
  dateOfBirth: z.date().optional(),
  gender: z.enum(["Male", "Female"]).optional(),
  maritalStatus: z.enum(["Married", "Unmarried"]).optional(),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
  avatar: z.string().optional(),
});

export type UpdateUserProfileDataProps = z.infer<
  typeof updateUserProfileSchema
>;
